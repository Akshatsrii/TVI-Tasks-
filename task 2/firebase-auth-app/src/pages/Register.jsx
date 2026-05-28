import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile
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
  registerBtn: {
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
    marginBottom: "20px",
    letterSpacing: "0.5px",
    transition: "background-color 0.2s",
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
    justifyContent: "center",
    alignItems: "center",
    borderTop: "1px solid #2e352e",
    paddingTop: "16px",
    gap: "6px",
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

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const register = async () => {
    try {
      setError("");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const getInputWrapperStyle = (field) => ({
    ...styles.inputWrapper,
    borderColor: focusedField === field ? "#a6ff4d" : "#2e352e",
  });

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <div style={styles.urlBadge}>
          <span style={styles.dot} />
          <span style={styles.urlText}>auth.yourapp.com</span>
        </div>

        <h1 style={styles.title}>
          <span style={styles.bracket}>[</span>
          Register
          <span style={styles.bracket}>]</span>
        </h1>
        <p style={styles.subtitle}>create · your · account</p>

        {error && <p style={styles.error}>⚠ {error}</p>}

        <div style={getInputWrapperStyle("name")}>
          <span style={styles.prompt}>$</span>
          <input
            style={styles.input}
            type="text"
            placeholder="full name"
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        <div style={getInputWrapperStyle("email")}>
          <span style={styles.prompt}>$</span>
          <input
            style={styles.input}
            type="email"
            placeholder="enter email"
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        <div style={getInputWrapperStyle("password")}>
          <span style={styles.prompt}>$</span>
          <input
            style={styles.input}
            type="password"
            placeholder="enter password"
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        <button
          style={styles.registerBtn}
          onClick={register}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0ff70")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#a6ff4d")}
        >
          create account —&gt;
        </button>

        <div style={styles.footer}>
          <p style={styles.footerText}>already have an account?</p>
          <Link to="/" style={styles.link}>
            login
          </Link>
        </div>

        <div style={styles.hintRow}>
          <span style={styles.enterKey}>enter</span>
          <span style={styles.hintText}>to register · new session</span>
        </div>

      </div>
    </div>
  );
}

export default Register;