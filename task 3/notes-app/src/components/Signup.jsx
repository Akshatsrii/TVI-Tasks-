import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Passwords do not match.");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      const messages = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/invalid-email": "Please enter a valid email.",
      };
      setError(messages[err.code] || "Something went wrong. Try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.title}>Register</h1>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={signup} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirm(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.btn}>Sign Up</button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <a href="/login" style={styles.switchLink}>Login</a>
        </p>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#111",
    border: "1.5px solid #FFD600",
    borderRadius: "16px",
    padding: "36px",
    width: "360px",
  },
  title: {
    color: "#FFD600",
    fontFamily: "sans-serif",
    fontSize: "26px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "24px",
  },
  error: {
    background: "rgba(255,60,60,0.08)",
    border: "1px solid rgba(255,80,80,0.3)",
    color: "#ff6b6b",
    fontSize: "13px",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "12px",
    fontFamily: "sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    background: "#000",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "sans-serif",
    outline: "none",
  },
  btn: {
    background: "#FFD600",
    border: "none",
    borderRadius: "8px",
    padding: "13px",
    color: "#000",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "sans-serif",
    cursor: "pointer",
    marginTop: "4px",
  },
  switchText: {
    color: "#888",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "18px",
    fontFamily: "sans-serif",
  },
  switchLink: {
    color: "#FFD600",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Signup;