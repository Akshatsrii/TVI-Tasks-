import { onObjectFinalized } from "firebase-functions/v2/storage";
import * as admin from "firebase-admin";
import * as path from "path";
import * as os from "os";
import * as fs from "fs/promises";
import * as sharp from "sharp";
import { logger } from "firebase-functions";

// ─── Admin Init Guard ─────────────────────────────────────────────────────────

if (!admin.apps.length) {
  admin.initializeApp();
}

// ─── Constants ────────────────────────────────────────────────────────────────

const THUMB_PREFIX = "thumbs/";
const THUMB_SIZES: Record<string, number> = {
  sm: 200,
  md: 600,
  lg: 1200,
};
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB hard limit
const SUPPORTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

// ─── Types ────────────────────────────────────────────────────────────────────

interface ThumbResult {
  size: string;
  width: number;
  storagePath: string;
  publicUrl: string;
}

interface UploadRecord {
  fileName: string;
  filePath: string;
  bucket: string;
  contentType: string;
  fileSize: number;
  uploadedBy: string | null;
  thumbs: ThumbResult[];
  status: "processed" | "skipped" | "failed";
  processedAt: admin.firestore.FieldValue;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTempPath(fileName: string): string {
  // Flatten any subdirectory structure for the local temp file
  return path.join(os.tmpdir(), path.basename(fileName));
}

function getThumbStoragePath(originalPath: string, sizeKey: string): string {
  const dir = path.dirname(originalPath);
  const ext = path.extname(originalPath);
  const base = path.basename(originalPath, ext);
  // e.g. "uploads/photo.jpg" → "thumbs/uploads/photo_sm.webp"
  return path.join(THUMB_PREFIX, dir, `${base}_${sizeKey}.webp`);
}

/**
 * Extract the uploader's UID from the object's custom metadata,
 * which should be set client-side when calling uploadBytes().
 */
function resolveUploaderId(metadata?: Record<string, string>): string | null {
  return metadata?.uploadedBy ?? null;
}

// ─── Main Trigger ─────────────────────────────────────────────────────────────

export const onImageUpload = onObjectFinalized(
  {
    memory: "1GiB",       // Sharp needs headroom for large images
    timeoutSeconds: 300,  // Resizing + uploading multiple sizes can take a while
    cpu: 2,
  },
  async (event) => {
    const file = event.data;
    const { name: filePath, bucket: bucketName, contentType, size, metadata } = file;

    // ── Guards ───────────────────────────────────────────────────────────────

    if (!filePath) {
      logger.warn("onImageUpload: event has no file name — skipping");
      return;
    }

    // Skip thumbnails we already generated to avoid infinite trigger loops
    if (filePath.startsWith(THUMB_PREFIX)) {
      logger.info("onImageUpload: skipping thumbnail file", { filePath });
      return;
    }

    if (!contentType || !SUPPORTED_MIME_TYPES.has(contentType)) {
      logger.info("onImageUpload: unsupported content type — skipping", {
        filePath,
        contentType,
      });
      return;
    }

    if (size > MAX_FILE_SIZE_BYTES) {
      logger.warn("onImageUpload: file exceeds size limit — skipping", {
        filePath,
        size,
        limitBytes: MAX_FILE_SIZE_BYTES,
      });
      await writeUploadRecord(filePath, bucketName, file, [], "skipped");
      return;
    }

    // ── Idempotency check ────────────────────────────────────────────────────
    // If this trigger fires twice (e.g. on retry), skip reprocessing.

    const db = admin.firestore();
    const idempotencyKey = `${bucketName}::${filePath}`;
    const existingSnap = await db
      .collection("uploads")
      .where("idempotencyKey", "==", idempotencyKey)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      logger.info("onImageUpload: already processed — skipping", { filePath });
      return;
    }

    logger.info("Processing image upload", {
      filePath,
      contentType,
      sizeBytes: size,
    });

    // ── Download original ────────────────────────────────────────────────────

    const bucket = admin.storage().bucket(bucketName);
    const tempOriginal = getTempPath(filePath);

    try {
      await bucket.file(filePath).download({ destination: tempOriginal });
      logger.info("Downloaded original", { filePath, tempOriginal });
    } catch (err) {
      logger.error("Failed to download original file", { filePath, err });
      await writeUploadRecord(filePath, bucketName, file, [], "failed");
      throw err; // Rethrow so Cloud Functions retries the download
    }

    // ── Generate thumbnails ──────────────────────────────────────────────────

    const thumbResults: ThumbResult[] = [];
    const tempThumbs: string[] = [];

    for (const [sizeKey, width] of Object.entries(THUMB_SIZES)) {
      const tempThumb = `${tempOriginal}_${sizeKey}.webp`;
      const thumbStoragePath = getThumbStoragePath(filePath, sizeKey);
      tempThumbs.push(tempThumb);

      try {
        await sharp(tempOriginal)
          .resize(width, undefined, {
            withoutEnlargement: true, // never upscale smaller images
            fit: "inside",
          })
          .webp({ quality: 82 })
          .toFile(tempThumb);

        await bucket.upload(tempThumb, {
          destination: thumbStoragePath,
          metadata: {
            contentType: "image/webp",
            cacheControl: "public, max-age=31536000", // 1 year — immutable thumbs
            metadata: { originalPath: filePath, thumbSize: sizeKey },
          },
        });

        // Make publicly accessible and grab the URL
        const thumbFile = bucket.file(thumbStoragePath);
        await thumbFile.makePublic();
        const publicUrl = thumbFile.publicUrl();

        thumbResults.push({ size: sizeKey, width, storagePath: thumbStoragePath, publicUrl });
        logger.info("Thumbnail generated", { sizeKey, width, thumbStoragePath });
      } catch (err) {
        logger.error("Failed to generate thumbnail", { sizeKey, filePath, err });
        // Non-fatal: continue generating remaining sizes
      }
    }

    // ── Cleanup temp files ───────────────────────────────────────────────────

    await Promise.allSettled([
      fs.unlink(tempOriginal),
      ...tempThumbs.map((t) => fs.unlink(t)),
    ]);

    // ── Write metadata to Firestore ──────────────────────────────────────────

    await writeUploadRecord(filePath, bucketName, file, thumbResults, "processed");

    logger.info("Image processing complete", {
      filePath,
      thumbsGenerated: thumbResults.length,
    });
  }
);

// ─── Firestore Write ──────────────────────────────────────────────────────────

async function writeUploadRecord(
  filePath: string,
  bucketName: string,
  file: { size: number; contentType?: string; metadata?: Record<string, string> },
  thumbs: ThumbResult[],
  status: UploadRecord["status"]
): Promise<void> {
  const db = admin.firestore();
  const idempotencyKey = `${bucketName}::${filePath}`;

  const record: UploadRecord & { idempotencyKey: string } = {
    fileName: path.basename(filePath),
    filePath,
    bucket: bucketName,
    contentType: file.contentType ?? "unknown",
    fileSize: file.size,
    uploadedBy: resolveUploaderId(file.metadata),
    thumbs,
    status,
    processedAt: admin.firestore.FieldValue.serverTimestamp(),
    idempotencyKey,
  };

  try {
    await db.collection("uploads").add(record);
  } catch (err) {
    logger.error("Failed to write upload record to Firestore", { filePath, err });
    // Non-fatal for thumb generation, but log loudly
  }
}