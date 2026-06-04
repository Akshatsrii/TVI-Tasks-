import { beforeUserCreated } from "firebase-functions/v2/identity";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";

// ─── Admin Init Guard ─────────────────────────────────────────────────────────
// Safe to call multiple times; no-ops if already initialized.

if (!admin.apps.length) {
  admin.initializeApp();
}

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = "user" | "moderator" | "admin";
type UserPlan = "free" | "pro" | "enterprise";

interface CustomClaims {
  role: UserRole;
  plan: UserPlan;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  plan: UserPlan;
  provider: string;
  createdAt: admin.firestore.FieldValue;
  lastLoginAt: admin.firestore.FieldValue;
  disabled: boolean;
  emailVerified: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derive a role from the sign-in provider or email domain.
 * Extend this logic to support invite-based roles, domain allowlists, etc.
 */
function resolveRole(email: string, provider: string): UserRole {
  // Example: internal domain gets moderator by default
  if (email.endsWith("@yourcompany.com")) return "moderator";
  // Anonymous / phone-only users stay "user"
  if (provider === "phone" || provider === "anonymous") return "user";
  return "user";
}

/**
 * Extract the primary sign-in provider string from providerData.
 * Falls back to "unknown" if not available.
 */
function resolveProvider(
  providerData?: admin.auth.UserInfo[]
): string {
  return providerData?.[0]?.providerId ?? "unknown";
}

// ─── Before User Created ──────────────────────────────────────────────────────

export const onNewUser = beforeUserCreated(async (event) => {
  const user = event.data;

  // Guard: identity functions can fire without full user data in edge cases
  if (!user) {
    logger.warn("onNewUser: event fired with no user data");
    return {};
  }

  const email = user.email ?? "";
  const provider = resolveProvider(user.providerData);

  logger.info("New user signup", {
    uid: user.uid,
    email,
    provider,
    emailVerified: user.emailVerified,
  });

  // ── 1. Resolve claims ──────────────────────────────────────────────────────

  const claims: CustomClaims = {
    role: resolveRole(email, provider),
    plan: "free",
  };

  // ── 2. Write Firestore profile ─────────────────────────────────────────────
  // Done here (before user is fully created) so the profile exists the moment
  // the client's auth state resolves. Use set() with merge:false to ensure a
  // clean initial write — no stale data from a previous deleted account.

  const db = admin.firestore();

  const profile: UserProfile = {
    uid: user.uid,
    email,
    displayName: user.displayName ?? email.split("@")[0] ?? "Anonymous",
    photoURL: user.photoURL ?? null,
    role: claims.role,
    plan: claims.plan,
    provider,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    disabled: false,
    emailVerified: user.emailVerified ?? false,
  };

  try {
    await db.collection("users").doc(user.uid).set(profile, { merge: false });
    logger.info("User profile created", { uid: user.uid, role: claims.role });
  } catch (err) {
    // A Firestore failure here blocks sign-in — log and rethrow so Firebase
    // surfaces it as a sign-in error rather than silently creating a claimless user.
    logger.error("Failed to create user profile", { uid: user.uid, err });
    throw err;
  }

  // ── 3. Return claims to Firebase Auth ─────────────────────────────────────

  return { customClaims: claims };
});

// ─── Sync Claims → Firestore on Admin Claim Update ───────────────────────────
// When claims are changed server-side (e.g. upgrading a user to "pro"),
// call this helper to keep the Firestore profile in sync.

export async function syncClaimsToProfile(
  uid: string,
  claims: Partial<CustomClaims>
): Promise<void> {
  const db = admin.firestore();

  await db.collection("users").doc(uid).update({
    ...claims,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  logger.info("Claims synced to Firestore profile", { uid, claims });
}