import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const FEATURES = [
  { icon: "⚡", label: "Real-Time" },
  { icon: "🔒", label: "Secure" },
  { icon: "🌍", label: "Global" },
];

function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 overflow-hidden">

      {/* Ambient blobs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-green-300 opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-green-400 opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-[10%] w-28 h-28 rounded-full bg-green-200 opacity-25 blur-2xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-green-100 p-8 text-center border border-green-100">

        {/* Live badge */}
        <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Chat
        </span>

        {/* Avatar */}
        <div className="w-[88px] h-[88px] mx-auto mb-5 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-200">
          <span className="text-5xl">💬</span>
        </div>

        <h1 className="text-4xl font-extrabold text-green-800 mb-2 tracking-tight">
          Firebase Chat
        </h1>

        <p className="text-gray-500 mb-6 leading-relaxed text-sm">
          Sign in with Google and start chatting securely with friends in real time.
        </p>

        {/* Feature pills */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {FEATURES.map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 bg-green-50 rounded-xl py-2.5 text-green-800 text-xs font-semibold"
            >
              <span className="text-xl">{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* Google sign-in */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-200 active:scale-[0.98]"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google"
            className="w-6 h-6 bg-white rounded-full p-1"
          />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4 text-gray-300 text-xs">
          <span className="flex-1 h-px bg-gray-100" />
          or
          <span className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Footer */}
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt=""
            className="w-4 h-4 opacity-50"
          />
          Secure Authentication powered by Firebase
        </p>
      </div>
    </div>
  );
}

export default Login;