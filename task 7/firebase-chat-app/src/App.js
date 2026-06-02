import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getToken, onMessage } from "firebase/messaging";

import { auth, messaging } from "./firebase";

import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";

import "./styles.css";

function App() {

  const [user] = useAuthState(auth);

  useEffect(() => {

    const setupFCM = async () => {

      const permission =
        await Notification.requestPermission();

      if (permission === "granted") {

        const token =
          await getToken(
            messaging,
            {
              vapidKey: "YOUR_VAPID_KEY"
            }
          );

        console.log("FCM Token:", token);
      }

    };

    setupFCM();

    onMessage(
      messaging,
      (payload) => {

        alert(
          payload.notification.title +
          "\n" +
          payload.notification.body
        );

      }
    );

  }, []);

  return (
    <div className="container">
      <h1>Firebase Chat App</h1>
      {user ? <ChatRoom /> : <Login />}
    </div>
  );
}

export default App;