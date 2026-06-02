import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import "./styles.css";

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="container">
      <h1>Firebase Chat App</h1>
      {user ? <ChatRoom /> : <Login />}
    </div>
  );
}

export default App;