import { useState } from "react";
import {
  loginUser,
  registerUser,
} from "../firebase/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!isLogin && password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      if (isLogin) {
        const user = await loginUser(email, password);
        console.log(user);
        alert("Login Successful");
      } else {
        const user = await registerUser(email, password);
        console.log(user);
        alert("Registration Successful");
      }
    } catch (err) {
      console.log(err);

      if (err.code === "auth/invalid-credential") {
        setError("Invalid Email or Password");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.logo}>FIRE AUTH</h1>

        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              ...styles.tab,
              ...(isLogin ? styles.activeTab : {}),
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              ...styles.tab,
              ...(!isLogin ? styles.activeTab : {}),
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              style={styles.input}
            />
          )}

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <button type="submit" style={styles.btn}>
            {isLogin ? "Login" : "Register"}
          </button>

        </form>

        <p style={styles.bottomText}>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            style={styles.link}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? " Register" : " Login"}
          </span>
        </p>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#000000,#111111,#1a1a1a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    width: "380px",
    background: "#111",
    border: "1px solid #FFD700",
    borderRadius: "20px",
    padding: "35px",
    boxShadow: "0 0 30px rgba(255,215,0,0.2)",
  },

  logo: {
    color: "#FFD700",
    textAlign: "center",
    marginBottom: "25px",
    fontFamily: "sans-serif",
    letterSpacing: "2px",
  },

  tabs: {
    display: "flex",
    marginBottom: "25px",
    border: "1px solid #FFD700",
    borderRadius: "10px",
    overflow: "hidden",
  },

  tab: {
    flex: 1,
    padding: "12px",
    border: "none",
    background: "transparent",
    color: "#FFD700",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },

  activeTab: {
    background: "#FFD700",
    color: "#000",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #333",
    background: "#000",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
  },

  btn: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#FFD700",
    color: "#000",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    marginTop: "5px",
  },

  bottomText: {
    color: "#999",
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
  },

  link: {
    color: "#FFD700",
    cursor: "pointer",
    fontWeight: "600",
  },

  error: {
    color: "red",
    fontSize: "13px",
    textAlign: "center",
  },
};

export default Login;