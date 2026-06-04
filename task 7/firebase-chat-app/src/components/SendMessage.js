import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { auth, db, analytics } from "../firebase";

function SendMessage() {
  const [text, setText]       = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!text.trim() || sending || !user) return;

    setSending(true);
    setError(null);

    try {
      await addDoc(collection(db, "messages"), {
        text:      text.trim(),
        uid:       user.uid,
        name:      user.displayName,
        photoURL:  user.photoURL,
        timestamp: serverTimestamp(),
      });

      analytics && logEvent(analytics, "message_sent");
      setText("");
    } catch (err) {
      console.error("Failed to send:", err);
      setError("Message failed to send. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form aria-label="Send a message" onSubmit={sendMessage} className="send-form">
      <label htmlFor="message-input" className="sr-only">Message</label>
      <input
        id="message-input"
        className="message-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        maxLength={500}
        disabled={sending}
      />
      {error && <p role="alert" className="send-error">{error}</p>}
      <button
        className="send-btn"
        type="submit"
        disabled={sending || !text.trim()}
        aria-label="Send message"
      >
        {sending ? "..." : "➤"}
      </button>
    </form>
  );
}

export default SendMessage;