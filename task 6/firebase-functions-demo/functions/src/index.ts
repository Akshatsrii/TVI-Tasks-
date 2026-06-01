import * as admin from "firebase-admin";
import { defineString, defineInt } from "firebase-functions/params";
import { logger } from "firebase-functions";

// ─── Environment Params ───────────────────────────────────────────────────────
// Validated at deploy time by Firebase; failures surface before any function
// runs rather than at runtime mid-request.

const APP_ENV         = defineString("APP_ENV",         { default: "development" });
const APP_NAME        = defineString("APP_NAME",        { default: "YourApp" });
const SMTP_USER       = defineString("SMTP_USER",       { default: "yourapp@gmail.com" });
const LOG_LEVEL       = defineString("LOG_LEVEL",       { default: "info" });
const CLEANUP_DAYS    = defineInt("CLEANUP_DAYS",       { default: 30 });
const MAX_UPLOAD_MB   = defineInt("MAX_UPLOAD_MB",      { default: 20 });

// ─── Admin Init (exactly once) ────────────────────────────────────────────────
// Guard is belt-and-suspenders: Firebase itself prevents double-init in the
// same process, but the check makes intent explicit and simplifies unit tests
// that import individual modules directly.

function initAdmin(): void {
  if (admin.apps.length > 0) return;

  const projectId = process.env.GCLOUD_PROJECT ?? process.env.FIREBASE_CONFIG
    ? JSON.parse(process.env.FIREBASE_CONFIG!).projectId
    : undefined;

  admin.initializeApp({
    // Explicit projectId prevents "could not determine project" errors in
    // emulator and CI environments where ADC may not be fully configured.
    ...(projectId ? { projectId } : {}),
  });

  logger.info("Firebase Admin initialised", {
    projectId,
    nodeVersion: process.version,
    env: process.env.APP_ENV ?? "unknown",
  });
}

initAdmin();

// ─── Firestore Settings ───────────────────────────────────────────────────────
// ignoreUndefinedProperties: prevents accidental writes of `undefined` values,
// which Firestore rejects at runtime with a cryptic serialisation error.

admin.firestore().settings({ ignoreUndefinedProperties: true });

// ─── Exports ──────────────────────────────────────────────────────────────────
// Each module is responsible for its own internal admin.apps.length guard.
// Grouping exports by domain makes cold-start tree-shaking easier to reason
// about and keeps the deployment surface explicit.

// HTTP / Callable
export { api, getUserData } from "./http/api";

// Firestore triggers
export { onOrderCreated, onOrderUpdated, onOrderDeleted } from "./triggers/orders";

// Auth triggers
export { onNewUser } from "./triggers/auth";

// Storage triggers
export { onImageUpload } from "./triggers/storage";

// Scheduled + event-driven email
export { sendWelcomeEmail, dailyCleanup } from "./scheduled/cleanup";

// ─── Deployment Metadata ──────────────────────────────────────────────────────
// Logged once per cold start; visible in Cloud Logging under the first
// function invocation. Useful for correlating deployments with log anomalies.

logger.info("Functions bundle loaded", {
  app:          APP_NAME.value(),
  env:          APP_ENV.value(),
  smtpUser:     SMTP_USER.value(),
  logLevel:     LOG_LEVEL.value(),
  cleanupDays:  CLEANUP_DAYS.value(),
  maxUploadMb:  MAX_UPLOAD_MB.value(),
  deployedAt:   new Date().toISOString(),
  functionsExported: [
    "api",
    "getUserData",
    "onOrderCreated",
    "onOrderUpdated",
    "onOrderDeleted",
    "onNewUser",
    "onImageUpload",
    "sendWelcomeEmail",
    "dailyCleanup",
  ],
});