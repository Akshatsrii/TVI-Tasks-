import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center border border-green-100">
        
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center shadow-md">
          <span className="text-5xl">💬</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Firebase Chat
        </h1>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Sign in with your Google account and start chatting
          securely with your friends in real time.
        </p>

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-green-400 hover:bg-green-500 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google"
            className="w-6 h-6 bg-white rounded-full p-1"
          />

          Continue with Google
        </button>

        <p className="text-sm text-gray-400 mt-6">
          Secure Authentication powered by Firebase
        </p>
      </div>
    </div>
  );
}

export default Login;