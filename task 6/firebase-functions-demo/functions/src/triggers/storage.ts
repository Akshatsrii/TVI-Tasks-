import { onObjectFinalized } from "firebase-functions/v2/storage";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";

export const onImageUpload = onObjectFinalized(async (event) => {
  const file = event.data;

  // Only process images
  if (!file.contentType?.startsWith("image/")) return;

  logger.log("Image uploaded", { name: file.name, size: file.size });

  // In production: use sharp or ImageMagick to resize
  // const bucket = admin.storage().bucket(file.bucket);
  // const tempFile = path.join(os.tmpdir(), file.name);
  // await bucket.file(file.name).download({ destination: tempFile });
  // await sharp(tempFile).resize(200).toFile(thumbPath);

  // Save metadata to Firestore
  await admin.firestore().collection("uploads").add({
    fileName: file.name,
    size: file.size,
    uploadedAt: admin.firestore.FieldValue.serverTimestamp()
  });
});