import { useEffect, useState } from "react";
import {
  addDoc, collection, deleteDoc, doc,
  onSnapshot, orderBy, query, updateDoc
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";

function Home({ user }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const addNote = async () => {
    if (!title || !body) return;
    await addDoc(collection(db, "notes"), {
      title, body, uid: user.uid, createdAt: Date.now(),
    });
    setTitle(""); setBody("");
  };

  const deleteNote = async (id) => await deleteDoc(doc(db, "notes", id));

  const saveEdit = async (id) => {
    await updateDoc(doc(db, "notes", id), { title: editTitle, body: editBody });
    setEditId(null);
  };

  const userName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <div style={s.page}>

      {/* Navbar */}
      <div style={s.nav}>
        <span style={s.logo}>📝 Notes</span>
        <div style={s.navRight}>
          <span style={s.welcome}>Hey, <b style={s.name}>{userName}</b> 👋</span>
          <button onClick={() => signOut(auth)} style={s.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Add Note Form */}
      <div style={s.formCard}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={s.input}
        />
        <textarea
          placeholder="Write your note..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          style={{ ...s.input, resize: "vertical" }}
        />
        <button onClick={addNote} style={s.addBtn}>+ Add Note</button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <p style={s.empty}>No notes yet. Add one above!</p>
      ) : (
        <div style={s.grid}>
          {notes.map((note) => (
            <div key={note.id} style={s.noteCard}>
              {editId === note.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={s.editInput}
                  />
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={3}
                    style={{ ...s.editInput, resize: "vertical" }}
                  />
                  <div style={s.cardActions}>
                    <button onClick={() => saveEdit(note.id)} style={s.saveBtn}>Save</button>
                    <button onClick={() => setEditId(null)} style={s.cancelBtn}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={s.noteTitle}>{note.title}</h3>
                  <p style={s.noteBody}>{note.body}</p>
                  {note.uid === user.uid && (
                    <div style={s.cardActions}>
                      <button onClick={() => { setEditId(note.id); setEditTitle(note.title); setEditBody(note.body); }} style={s.editBtn}>Edit</button>
                      <button onClick={() => deleteNote(note.id)} style={s.deleteBtn}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: "0 0 40px",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px",
    borderBottom: "1.5px solid #FFD600",
    background: "#111",
  },
  logo: { color: "#FFD600", fontSize: "20px", fontWeight: "700" },
  navRight: { display: "flex", alignItems: "center", gap: "16px" },
  welcome: { color: "#aaa", fontSize: "14px" },
  name: { color: "#FFD600" },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #FFD600",
    color: "#FFD600",
    padding: "7px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "sans-serif",
  },
  formCard: {
    background: "#111",
    border: "1.5px solid #FFD600",
    borderRadius: "14px",
    padding: "24px",
    margin: "32px auto",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    background: "#000",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  addBtn: {
    background: "#FFD600",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    color: "#000",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "sans-serif",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    color: "#555",
    marginTop: "60px",
    fontSize: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
    padding: "0 32px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  noteCard: {
    background: "#111",
    border: "1px solid #FFD600",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  noteTitle: { color: "#FFD600", fontSize: "16px", fontWeight: "700", margin: 0 },
  noteBody: { color: "#ccc", fontSize: "14px", margin: 0, lineHeight: "1.5" },
  cardActions: { display: "flex", gap: "8px", marginTop: "4px" },
  editBtn: {
    flex: 1, padding: "8px", borderRadius: "7px", border: "1px solid #FFD600",
    background: "transparent", color: "#FFD600", cursor: "pointer",
    fontSize: "13px", fontFamily: "sans-serif",
  },
  deleteBtn: {
    flex: 1, padding: "8px", borderRadius: "7px", border: "1px solid #ff4444",
    background: "transparent", color: "#ff4444", cursor: "pointer",
    fontSize: "13px", fontFamily: "sans-serif",
  },
  saveBtn: {
    flex: 1, padding: "8px", borderRadius: "7px", border: "none",
    background: "#FFD600", color: "#000", cursor: "pointer",
    fontSize: "13px", fontWeight: "700", fontFamily: "sans-serif",
  },
  cancelBtn: {
    flex: 1, padding: "8px", borderRadius: "7px", border: "1px solid #555",
    background: "transparent", color: "#888", cursor: "pointer",
    fontSize: "13px", fontFamily: "sans-serif",
  },
  editInput: {
    background: "#000",
    border: "1px solid #FFD600",
    borderRadius: "7px",
    padding: "10px 12px",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
};

export default Home;