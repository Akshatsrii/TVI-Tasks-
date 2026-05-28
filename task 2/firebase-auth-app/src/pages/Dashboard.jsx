import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

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
    maxWidth: "460px",
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
    boxShadow: "0 0 6px #a6ff4d55",
  },
  urlText: {
    fontSize: "12px",
    color: "#6b7a6b",
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
  },
  divider: {
    borderColor: "#2e352e",
    borderStyle: "solid",
    borderWidth: "0 0 1px 0",
    margin: "0 0 24px 0",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#141714",
    border: "1px solid #2e352e",
    borderRadius: "8px",
    padding: "14px 16px",
    marginBottom: "12px",
  },
  statusLabel: {
    fontSize: "12px",
    color: "#6b7a6b",
  },
  statusValue: {
    fontSize: "13px",
    color: "#c8d8c8",
    fontWeight: "bold",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "rgba(166,255,77,0.08)",
    border: "1px solid rgba(166,255,77,0.2)",
    borderRadius: "20px",
    padding: "4px 10px",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#a6ff4d",
  },
  badgeText: {
    fontSize: "11px",
    color: "#a6ff4d",
  },
  welcomeBox: {
    backgroundColor: "#141714",
    border: "1px solid #2e352e",
    borderLeft: "3px solid #a6ff4d",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  },
  welcomePrompt: {
    fontSize: "12px",
    color: "#6b7a6b",
    marginBottom: "4px",
  },
  welcomeText: {
    fontSize: "15px",
    color: "#c8d8c8",
  },
  welcomeUser: {
    color: "#a6ff4d",
    fontWeight: "bold",
  },
  logoutBtn: {
    width: "100%",
    backgroundColor: "transparent",
    color: "#ff6b6b",
    border: "1px solid rgba(255,107,107,0.3)",
    borderRadius: "8px",
    padding: "14px",
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "'Courier New', Courier, monospace",
    cursor: "pointer",
    letterSpacing: "0.5px",
    transition: "background-color 0.2s, border-color 0.2s",
    marginBottom: "20px",
  },
  hintRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderTop: "1px solid #2e352e",
    paddingTop: "16px",
  },
  enterKey: {
    border: "1px solid #3a433a",
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "11px",
    color: "#6b7a6b",
  },
  hintText: {
    fontSize: "12px",
    color: "#4a534a",
  },
};

function Dashboard() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const user = auth.currentUser;
  const displayName = user?.displayName || "User";
  const displayEmail = user?.email || "unknown";

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <div style={styles.urlBadge}>
          <span style={styles.dot} />
          <span style={styles.urlText}>app.yourapp.com/dashboard</span>
        </div>

        <h1 style={styles.title}>
          <span style={styles.bracket}>[</span>
          Dashboard
          <span style={styles.bracket}>]</span>
        </h1>
        <p style={styles.subtitle}>active · session · running</p>

        <hr style={styles.divider} />

        <div style={styles.welcomeBox}>
          <p style={styles.welcomePrompt}>$ whoami</p>
          <p style={styles.welcomeText}>
            welcome back,{" "}
            <span style={styles.welcomeUser}>{displayName}</span>
          </p>
        </div>

        <div style={styles.statusRow}>
          <span style={styles.statusLabel}>session</span>
          <div style={styles.statusBadge}>
            <span style={styles.badgeDot} />
            <span style={styles.badgeText}>authenticated</span>
          </div>
        </div>

        <div style={{ ...styles.statusRow, marginBottom: "24px" }}>
          <span style={styles.statusLabel}>email</span>
          <span style={styles.statusValue}>{displayEmail}</span>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={logout}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(255,107,107,0.08)";
            e.target.style.borderColor = "rgba(255,107,107,0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.borderColor = "rgba(255,107,107,0.3)";
          }}
        >
          logout —&gt;
        </button>

        <div style={styles.hintRow}>
          <span style={styles.enterKey}>esc</span>
          <span style={styles.hintText}>to logout · end session</span>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;