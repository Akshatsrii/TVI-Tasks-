import {
  collection,
  query,
  orderBy
} from "firebase/firestore";

import {
  useCollection
} from "react-firebase-hooks/firestore";

import {
  signOut
} from "firebase/auth";

import {
  db,
  auth
} from "../firebase";

import Message from "./Message";
import SendMessage from "./SendMessage";
import UploadImage from "./UploadImage";

function ChatRoom() {
  const q = query(
    collection(db, "messages"),
    orderBy("timestamp")
  );

  const [messages, loading] = useCollection(q);

  return (
    <div className="chatroom-container">

      <div className="chatroom-header">
        <h2>💬 Firebase Chat</h2>

        <button
          className="logout-btn"
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>

      <div className="chat">

        {loading && (
          <p className="loading">
            Loading messages...
          </p>
        )}

        {messages?.docs.map((doc) => (
          <Message
            key={doc.id}
            message={doc.data()}
          />
        ))}

      </div>

      <div className="chat-actions">
        <UploadImage />
        <SendMessage />
      </div>

    </div>
  );
}

export default ChatRoom;