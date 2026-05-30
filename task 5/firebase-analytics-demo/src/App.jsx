// src/App.jsx
// ─────────────────────────────────────────────
// Root app component
// Renders Navbar + current page
// ─────────────────────────────────────────────

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Home />
      </main>
      <footer className="footer">
        <p>🔥 Firebase Analytics Demo · Open Console to see events · Check Firebase DebugView for real-time data</p>
      </footer>
    </div>
  );
}

export default App;