// src/firebase/firebase.js
// ─────────────────────────────────────────────
// 🔥 STEP 1: Firebase Initialization
//
// HOW TO GET YOUR CONFIG:
//   1. Go to https://console.firebase.google.com
//   2. Create a new project (or open existing)
//   3. Click the web icon </> to add a web app
//   4. Copy the firebaseConfig object shown
//   5. Paste it below replacing the placeholder values
// ─────────────────────────────────────────────

import { initializeApp } from "firebase/app";

// ✅ REPLACE these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
 
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID", // needed for Analytics
};

// Initialize Firebase App (singleton — only runs once)
const app = initializeApp(firebaseConfig);

export default app;