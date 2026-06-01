import { onRequest } from "firebase-functions/v2/https";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";

// HTTP REST endpoint
export const api = onRequest(async (req, res) => {
  const db = admin.firestore();

  try {
    if (req.method === "GET" && req.path === "/users") {
      const snap = await db.collection("users").limit(20).get();
      const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json({ success: true, data: users });
      return;
    }

    if (req.method === "POST" && req.path === "/users") {
      const { name, email } = req.body;
      if (!name || !email) {
        res.status(400).json({ error: "name and email required" });
        return;
      }
      const ref = await db.collection("users").add({
        name, email, createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      logger.log("User created via API", { id: ref.id });
      res.status(201).json({ success: true, id: ref.id });
      return;
    }

    res.status(404).json({ error: "Route not found" });
  } catch (err) {
    logger.error("API error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Callable function (auto-authenticated)
export const getUserData = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const db = admin.firestore();
  const doc = await db.collection("users").doc(request.auth.uid).get();

  if (!doc.exists) throw new HttpsError("not-found", "User not found");

  return { uid: request.auth.uid, ...doc.data() };
});