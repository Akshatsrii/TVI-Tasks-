import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

import {
  auth,
  db,
  analytics
} from "../firebase";

import {
  logEvent
} from "firebase/analytics";

function SendMessage() {

  const [text, setText] =
    useState("");

  const sendMessage =
    async (e) => {

      e.preventDefault();

      if (!text.trim()) return;

      await addDoc(
        collection(db, "messages"),
        {
          text,
          uid: auth.currentUser.uid,
          name: auth.currentUser.displayName,
          photoURL:
            auth.currentUser.photoURL,
          timestamp:
            serverTimestamp()
        }
      );

      logEvent(
        analytics,
        "message_sent"
      );

      setText("");
    };

  return (
    <form onSubmit={sendMessage}>

      <input
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Message"
      />

      <button type="submit">
        Send
      </button>

    </form>
  );
}

export default SendMessage;