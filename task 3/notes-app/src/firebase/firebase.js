import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const registerUser = async (email, password) => {
  try {
    const user = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("User Registered:", user);

    return user;
  } catch (error) {
    console.log(error.code);
    console.log(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("User Logged In:", user);

    return user;
  } catch (error) {
    console.log(error.code);
    console.log(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);

    console.log("User Logged Out");
  } catch (error) {
    console.log(error.code);
    console.log(error.message);
  }
};

export const addNote = async (title, content) => {
  try {
    const docRef = await addDoc(collection(db, "notes"), {
      title,
      content,
      createdAt: new Date()
    });

    console.log("Document Added:", docRef.id);
  } catch (error) {
    console.log(error.code);
    console.log(error.message);
  }
};

export const getNotes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "notes"));

    const notes = [];

    querySnapshot.forEach((doc) => {
      notes.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(notes);

    return notes;
  } catch (error) {
    console.log(error.code);
    console.log(error.message);
  }
};