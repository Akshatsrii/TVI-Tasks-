// src/components/Navbar.jsx
// ─────────────────────────────────────────────
// 🧭 NAVBAR COMPONENT
// Logs analytics events for: Login, Sign Up, Search
// ─────────────────────────────────────────────

import { useState } from "react";
import { logLogin, logSignUp, logSearch } from "../firebase/analytics";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // 🔍 EVENT: Search — fires when user submits search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    logSearch(searchTerm); // logs "search" event to Firebase
    alert(`Searching for: "${searchTerm}"\n\n✅ Analytics event "search" logged!\nCheck Firebase Console → DebugView`);
    setSearchTerm("");
  };

  // 👤 EVENT: Login — fires when user clicks Login
  const handleLogin = () => {
    logLogin("email"); // logs "login" event to Firebase
    setLoggedIn(true);
    alert('✅ Analytics event "login" logged!\nCheck Firebase Console → DebugView');
  };

  // 📝 EVENT: Sign Up — fires when user clicks Sign Up
  const handleSignUp = () => {
    logSignUp("email"); // logs "sign_up" event to Firebase
    alert('✅ Analytics event "sign_up" logged!\nCheck Firebase Console → DebugView');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🔥</span>
        <span className="brand-name">FireStore</span>
      </div>

      {/* Search bar — logs "search" event */}
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>

      {/* Auth buttons */}
      <div className="navbar-actions">
        {loggedIn ? (
          <span className="logged-in-badge">✅ Logged In</span>
        ) : (
          <>
            <button className="btn-outline" onClick={handleLogin}>
              Login
            </button>
            <button className="btn-primary" onClick={handleSignUp}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}