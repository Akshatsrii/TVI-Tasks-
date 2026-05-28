import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#1a1d1a",
    backgroundImage: `
      linear-gradient(rgba(166,255,77,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(166,255,77,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "32px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Courier New', Courier, monospace",
  },
  card: {
    backgroundColor: "#1e231e",
    border: "1px solid #2e352e",
    borderRadius: "12px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
  },
  urlBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#a6ff4d",
    flexShrink: 0,
  },
  urlText: {
    fontSize: "12px",
    color: "#6b7a6b",
    fontFamily: "'Courier New', Courier, monospace",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#a6ff4d",
    margin: "0 0 4px 0",
    letterSpacing: "-0.5px",
  },
  bracket: {
    color: "#a6ff4d",
  },
  subtitle: {
    fontSize: "13px",
    color: "#6b7a6b",
    margin: "0 0 28px 0",
    fontFamily: "'Courier New', Courier, monospace",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#141714",
    border: "1px solid #2e352e",
    borderRadius: "8px",
    padding: "0 14px",
    marginBottom: "12px",
    transition: "border-color 0.2s",
  },
  prompt: {
    color: "#a6ff4d",
    fontSize: "14px",
    marginRight: "10px",
    userSelect: "none",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#c8d8c8",
    fontSize: "14px",
    padding: "14px 0",
    fontFamily: "'Courier New', Courier, monospace",
    caretColor: "#a6ff4d",
    width: "100%",
  },
  connectBtn: {
    width: "100%",
    backgroundColor: "#a6ff4d",
    color: "#141714",
    border: "none",
    borderRadius: "8px",
    padding: "14px",
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "'Courier New', Courier, monospace",
    cursor: "pointer",
    marginTop: "4px",
    marginBottom: "12px",
    letterSpacing: "0.5px",
    transition: "background-color 0.2s",
  },
  googleBtn: {
    width: "100%",
    backgroundColor: "transparent",
    color: "#a6ff4d",
    border: "1px solid #2e352e",
    borderRadius: "8px",
    padding: "13px",
    fontSize: "14px",
    fontFamily: "'Courier New', Courier, monospace",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "border-color 0.2s, background-color 0.2s",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "13px",
    marginBottom: "12px",
    padding: "10px 14px",
    backgroundColor: "rgba(255,107,107,0.08)",
    border: "1px solid rgba(255,107,107,0.2)",
    borderRadius: "6px",
    fontFamily: "'Courier New', Courier, monospace",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #2e352e",
    paddingTop: "16px",
    flexWrap: "wrap",
    gap: "8px",
  },
  footerText: {
    fontSize: "12px",
    color: "#6b7a6b",
    margin: 0,
  },
  link: {
    color: "#a6ff4d",
    textDecoration: "none",
    fontSize: "12px",
  },
  hintRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "20px",
  },
  enterKey: {
    border: "1px solid #3a433a",
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "11px",
    color: "#6b7a6b",
    fontFamily: "'Courier New', Courier, monospace",
  },
  hintText: {
    fontSize: "12px",
    color: "#4a534a",
    fontFamily: "'Courier New', Courier, monospace",
  },
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <div style={styles.urlBadge}>
          <span style={styles.dot} />
          <span style={styles.urlText}>auth.yourapp.com</span>
        </div>

        <h1 style={styles.title}>
          <span style={styles.bracket}>[</span>
          Login
          <span style={styles.bracket}>]</span>
        </h1>
        <p style={styles.subtitle}>secure · terminal · access</p>

        {error && <p style={styles.error}>⚠ {error}</p>}

        <div
          style={{
            ...styles.inputWrapper,
            borderColor: emailFocused ? "#a6ff4d" : "#2e352e",
          }}
        >
          <span style={styles.prompt}>$</span>
          <input
            style={styles.input}
            type="email"
            placeholder="enter email"
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </div>

        <div
          style={{
            ...styles.inputWrapper,
            borderColor: passFocused ? "#a6ff4d" : "#2e352e",
          }}
        >
          <span style={styles.prompt}>$</span>
          <input
            style={styles.input}
            type="password"
            placeholder="enter password"
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
          />
        </div>

        <button
          style={styles.connectBtn}
          onClick={login}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0ff70")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#a6ff4d")}
        >
          login —&gt;
        </button>

        <button
          style={styles.googleBtn}
          onClick={googleLogin}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "#a6ff4d";
            e.target.style.backgroundColor = "rgba(166,255,77,0.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "#2e352e";
            e.target.style.backgroundColor = "transparent";
          }}
        >
          continue with google
        </button>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            no account?{" "}
            <Link to="/register" style={styles.link}>
              register
            </Link>
          </p>
          <Link to="/forgot" style={styles.link}>
            forgot password?
          </Link>
        </div>

        <div style={styles.hintRow}>
          <span style={styles.enterKey}>enter</span>
          <span style={styles.hintText}>to login · secured session</span>
        </div>

      </div>
    </div>
  );
}

export default Login;