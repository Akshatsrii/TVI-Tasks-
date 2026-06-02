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

  const [messages] =
    useCollection(q);

  return (
    <div>

      <button
        onClick={() =>
          signOut(auth)
        }
      >
        Logout
      </button>

      <div className="chat">

        {messages?.docs.map((doc) => (
          <Message
            key={doc.id}
            message={doc.data()}
          />
        ))}

      </div>

      <UploadImage />

      <SendMessage />

    </div>
  );
}

export default ChatRoom;