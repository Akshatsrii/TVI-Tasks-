import {
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { auth } from "../firebase";

function Login() {

  const login = async () => {

    const provider =
      new GoogleAuthProvider();

    await signInWithPopup(
      auth,
      provider
    );
  };

  return (
    <div className="center">
      <button onClick={login}>
        Login With Google
      </button>
    </div>
  );
}

export default Login;