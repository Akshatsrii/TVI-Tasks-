import { onRequest } from "firebase-functions/v2/https";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserRecord {
  id: string;
  name: string;
  email: string;
  createdAt: admin.firestore.Timestamp | null;
}

interface CreateUserBody {
  name?: unknown;
  email?: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && EMAIL_REGEX.test(email);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function sanitizeString(value: string): string {
  return value.trim().slice(0, 256);
}

function getDb(): admin.firestore.Firestore {
  return admin.firestore();
}

// ─── HTTP REST Endpoint ───────────────────────────────────────────────────────

export const api = onRequest(async (req, res) => {
  // Reject unexpected methods upfront
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(req.method)) {
    res.status(405).set("Allow", allowedMethods.join(", ")).json({ error: "Method not allowed" });
    return;
  }

  const db = getDb();

  try {
    // GET /users — list users
    if (req.method === "GET" && req.path === "/users") {
      const snap = await db.collection("users").orderBy("createdAt", "desc").limit(20).get();

      const users: UserRecord[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<UserRecord, "id">),
      }));

      res.json({ success: true, data: users, count: users.length });
      return;
    }

    // POST /users — create user
    if (req.method === "POST" && req.path === "/users") {
      const { name, email } = req.body as CreateUserBody;

      // Validate
      const errors: string[] = [];
      if (!isNonEmptyString(name)) errors.push("name must be a non-empty string");
      if (!isValidEmail(email)) errors.push("email must be a valid email address");

      if (errors.length > 0) {
        res.status(400).json({ error: "Validation failed", details: errors });
        return;
      }

      // Sanitize (type narrowed above)
      const safeName = sanitizeString(name as string);
      const safeEmail = sanitizeString(email as string).toLowerCase();

      // Prevent duplicate emails
      const existing = await db.collection("users").where("email", "==", safeEmail).limit(1).get();
      if (!existing.empty) {
        res.status(409).json({ error: "A user with this email already exists" });
        return;
      }

      const ref = await db.collection("users").add({
        name: safeName,
        email: safeEmail,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info("User created via REST API", { id: ref.id, email: safeEmail });
      res.status(201).json({ success: true, id: ref.id });
      return;
    }

    res.status(404).json({ error: "Route not found" });
  } catch (err) {
    logger.error("API error", { path: req.path, method: req.method, err });
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Callable Function ────────────────────────────────────────────────────────

export const getUserData = onCall(async (request) => {
  // Auth guard
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to access this resource.");
  }

  const { uid } = request.auth;
  const db = getDb();

  let doc: admin.firestore.DocumentSnapshot;
  try {
    doc = await db.collection("users").doc(uid).get();
  } catch (err) {
    logger.error("Firestore read failed in getUserData", { uid, err });
    throw new HttpsError("internal", "Failed to retrieve user data. Please try again.");
  }

  if (!doc.exists) {
    throw new HttpsError("not-found", "No user record found for your account.");
  }

  logger.info("getUserData called", { uid });

  return {
    uid,
    ...(doc.data() as Omit<UserRecord, "id">),
  };
});           