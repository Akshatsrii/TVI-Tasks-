import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";

const SMTP_PASS = defineSecret("SMTP_PASSWORD");

// Welcome email on user signup
export const sendWelcomeEmail = onDocumentCreated(
  { document: "users/{userId}", secrets: [SMTP_PASS] },
  async (event) => {
    const user = event.data?.data();
    if (!user?.email) return;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "yourapp@gmail.com", pass: SMTP_PASS.value() }
    });

    await transporter.sendMail({
      from: "yourapp@gmail.com",
      to: user.email,
      subject: "Welcome!",
      html: `<h2>Hi ${user.name}, welcome aboard! 🎉</h2>`
    });

    logger.log("Welcome email sent", { to: user.email });
  }
);

// Scheduled cleanup every 24 hours
export const dailyCleanup = onSchedule("every 24 hours", async () => {
  const db = admin.firestore();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const old = await db.collection("logs")
    .where("createdAt", "<", cutoff)
    .limit(500)
    .get();

  const batch = db.batch();
  old.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  logger.log(`Cleanup done: deleted ${old.size} old logs`);
});