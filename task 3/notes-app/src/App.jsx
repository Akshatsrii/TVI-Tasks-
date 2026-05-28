import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "./firebase/firebase";

import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

function App() {

  const [note, setNote] = useState("");

  const [notes, setNotes] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "notes"),
      (snapshot) => {

        const data = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data()
          })
        );

        setNotes(data);
      }
    );

    return () => unsubscribe();

  }, []);

  const addNote = async () => {

    if (!note) return;

    await addDoc(
      collection(db, "notes"),
      {
        title: note
      }
    );

    setNote("");
  };

  const deleteNote = async (id) => {

    await deleteDoc(
      doc(db, "notes", id)
    );
  };

  const updateNote = async (id) => {

    await updateDoc(
      doc(db, "notes", id),
      {
        title: "Updated Note"
      }
    );
  };

  return (
    <div>

      <h1>Firestore Notes App</h1>

      <NoteForm
        note={note}
        setNote={setNote}
        addNote={addNote}
      />

      <hr />

      <NoteList
        notes={notes}
        deleteNote={deleteNote}
        updateNote={updateNote}
      />

    </div>
  );
}

export default App;