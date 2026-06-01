import { beforeUserCreated } from "firebase-functions/v2/identity";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";

export const onNewUser = beforeUserCreated(async (event) => {
  const user = event.data;
  logger.log("New user signup", { email: user?.email });

  // Set custom claims (e.g. default role)
  return {
    customClaims: { role: "user", plan: "free" }
  };
});

// Write user profile to Firestore on creation
export const createUserProfile = admin.app()
  ? null // initialized elsewhere
  : null;

// Auth trigger via onCall alternative: in api.ts use request.auth