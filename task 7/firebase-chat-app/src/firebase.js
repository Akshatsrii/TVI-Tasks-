import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxqDkZKyNGi1Ui2d4x8Z--mOW3EorMJ0A",
  authDomain: "fir-chat-app-6da18.firebaseapp.com",
  projectId: "fir-chat-app-6da18",
  storageBucket: "fir-chat-app-6da18.firebasestorage.app",
  messagingSenderId: "865469829594",
  appId: "1:865469829594:web:49d0f2e2559e880ab6f0e3",
  measurementId: "G-E7GV5600Z9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);

export default app;