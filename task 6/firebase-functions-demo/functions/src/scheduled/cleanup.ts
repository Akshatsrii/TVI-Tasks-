import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret, defineString } from "firebase-functions/params";

// ─── Secrets & Config ─────────────────────────────────────────────────────────

const SMTP_PASS = defineSecret("SMTP_PASSWORD");
const SMTP_USER = defineString("SMTP_USER", { default: "yourapp@gmail.com" });
const APP_NAME = defineString("APP_NAME", { default: "YourApp" });

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserRecord {
  email?: unknown;
  name?: unknown;
  welcomeEmailSent?: boolean;
}

// ─── Transporter Factory (lazy, not module-level) ─────────────────────────────
// Re-created per invocation — safe for Cloud Functions' stateless execution model.

function createTransporter(): nodemailer.Transporter {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER.value(),
      pass: SMTP_PASS.value(),
    },
    pool: true,          // reuse connections within a single invocation
    maxConnections: 3,
  });
}

// ─── Welcome Email ────────────────────────────────────────────────────────────

export const sendWelcomeEmail = onDocumentCreated(
  {
    document: "users/{userId}",
    secrets: [SMTP_PASS],
    retry: false, // prevent duplicate emails on function retry
  },
  async (event) => {
    const userId = event.params.userId;
    const user = event.data?.data() as UserRecord | undefined;

    // Guard: missing data
    if (!user) {
      logger.warn("sendWelcomeEmail: document has no data", { userId });
      return;
    }

    // Guard: invalid email
    if (typeof user.email !== "string" || !user.email.includes("@")) {
      logger.warn("sendWelcomeEmail: invalid or missing email", { userId });
      return;
    }

    // Idempotency: skip if already sent (handles manual retries)
    if (user.welcomeEmailSent) {
      logger.info("sendWelcomeEmail: already sent, skipping", { userId });
      return;
    }

    const recipientEmail = user.email;
    const recipientName = typeof user.name === "string" ? user.name : "there";
    const senderAddress = `${APP_NAME.value()} <${SMTP_USER.value()}>`;

    const transporter = createTransporter();

    try {
      // Verify SMTP connection before attempting send
      await transporter.verify();

      await transporter.sendMail({
        from: senderAddress,
        to: recipientEmail,
        subject: `Welcome to ${APP_NAME.value()}!`,
        text: `Hi ${recipientName}, welcome to ${APP_NAME.value()}! We're glad you're here.`,
        html: buildWelcomeHtml(recipientName),
      });

      // Mark as sent to guard against duplicate sends
      await event.data!.ref.update({
        welcomeEmailSent: true,
        welcomeEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info("Welcome email sent", { userId, to: recipientEmail });
    } catch (err) {
      logger.error("Failed to send welcome email", { userId, to: recipientEmail, err });
      throw err; // surface to Cloud Functions for visibility (but retry: false prevents loops)
    } finally {
      transporter.close();
    }
  }
);

function buildWelcomeHtml(name: string): string {
  const escapedName = name.replace(/[<>&"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] ?? c)
  );
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Hi ${escapedName}, welcome aboard! 🎉</h2>
      <p>We're thrilled to have you. Let us know if you need anything.</p>
    </div>
  `;
}

// ─── Daily Cleanup ────────────────────────────────────────────────────────────

const CLEANUP_BATCH_SIZE = 400; // safely under Firestore's 500-op batch limit
const RETENTION_DAYS = 30;

export const dailyCleanup = onSchedule(
  {
    schedule: "every 24 hours",
    timeoutSeconds: 540,   // max allowed; cleanup may process many batches
    memory: "256MiB",
  },
  async () => {
    const db = admin.firestore();
    const cutoff = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
    );

    let totalDeleted = 0;
    let hasMore = true;

    // Loop in batches until no old docs remain — avoids the 500-doc hard limit
    // and handles collections larger than one batch.
    while (hasMore) {
      const snapshot = await db
        .collection("logs")
        .where("createdAt", "<", cutoff)
        .limit(CLEANUP_BATCH_SIZE)
        .get();

      if (snapshot.empty) {
        hasMore = false;
        break;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));

      try {
        await batch.commit();
        totalDeleted += snapshot.size;
        logger.info(`Cleanup batch committed`, { deleted: snapshot.size, totalSoFar: totalDeleted });
      } catch (err) {
        logger.error("Cleanup batch failed, stopping early", { totalDeleted, err });
        throw err;
      }

      // If we got fewer docs than the limit, there's nothing left
      hasMore = snapshot.size === CLEANUP_BATCH_SIZE;
    }

    logger.info("Daily cleanup complete", { totalDeleted, retentionDays: RETENTION_DAYS });
  }
);