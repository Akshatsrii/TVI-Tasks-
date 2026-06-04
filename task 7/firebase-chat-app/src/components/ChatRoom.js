import { useRef, useEffect } from "react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import UploadImage from "./UploadImage";

const MESSAGES_LIMIT = 50;

function ChatRoom() {
  const bottomRef = useRef(null);

  const q = query(
    collection(db, "messages"),
    orderBy("timestamp"),
    limit(MESSAGES_LIMIT)
  );

  const [messages, loading, error] = useCollection(q);

  // Auto-scroll to latest message
  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSignOut = () => signOut(auth);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-green-400 to-green-500 shadow-md shadow-green-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
            💬
          </div>
          <div>
            <h1 className="text-white font-extrabold text-base leading-tight">
              Firebase Chat
            </h1>
            <span className="flex items-center gap-1.5 text-green-100 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-200 animate-pulse" />
              Live
            </span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-full border border-white/30 transition-all duration-200 active:scale-95"
        >
          <span>Logout</span>
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-2">

        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-green-500">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:300ms]" />
          </div>
        )}

        {error && (
          <div className="text-center text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl py-3 px-4">
            Failed to load messages. Please refresh.
          </div>
        )}

        {!loading && messages?.empty && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
            <span className="text-4xl">💬</span>
            <p className="text-sm font-semibold">No messages yet</p>
            <p className="text-xs">Be the first to say hello!</p>
          </div>
        )}

        {messages?.docs.map((doc) => (
          <Message key={doc.id} message={doc.data()} />
        ))}

        <div ref={bottomRef} />
      </main>

      {/* Actions */}
      <footer className="flex items-center gap-2 px-4 py-3 border-t border-green-100 bg-white/80 backdrop-blur-sm">
        <UploadImage />
        <SendMessage />
      </footer>

    </div>
  );
}

export default ChatRoom;