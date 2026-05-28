import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBk04zDyHp2kgo6PSjL5auQjl8hWT-YYZ0",
  authDomain: "note-app-45534.firebaseapp.com",
  projectId: "note-app-45534",
  storageBucket: "note-app-45534.firebasestorage.app",
  messagingSenderId: "729169510573",
  appId: "1:729169510573:web:b54f953adabffe86058624",
  measurementId: "G-SK323NBJ0V"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);