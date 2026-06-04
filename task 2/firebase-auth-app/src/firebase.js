import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqX8ELKKZXgwSsRXotfWt0gmfG1EUnubM",
  authDomain: "ak-project-caace.firebaseapp.com",
  projectId: "ak-project-caace",
  storageBucket: "ak-project-caace.firebasestorage.app",
  messagingSenderId: "116538745274",
  appId: "1:116538745274:web:612d0663990e75a73f3d83",
  measurementId: "G-G1XHRDRMCC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);