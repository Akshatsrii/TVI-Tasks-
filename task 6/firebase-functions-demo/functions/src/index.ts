import * as admin from "firebase-admin";

admin.initializeApp();

export { api, getUserData } from "./http/api";
export { onOrderCreated, onOrderUpdated, onOrderDeleted } from "./triggers/firestore";
export { onNewUser } from "./triggers/auth";
export { onImageUpload } from "./triggers/storage";
export { sendWelcomeEmail, dailyCleanup } from "./scheduled/cleanup";