import {
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { auth } from "../firebase";

function Login() {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div>
      <button onClick={signIn}>
        Login With Google
      </button>
    </div>
  );
}

export default Login;