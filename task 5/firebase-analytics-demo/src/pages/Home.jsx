// src/pages/Home.jsx
// ─────────────────────────────────────────────
// 🏠 HOME PAGE
//
// This page:
// 1. Fetches Remote Config on load
// 2. Reads feature flags: show_premium_section, new_ui_enabled
// 3. Logs page_view analytics event
// 4. Renders products and conditionally shows PremiumSection
// ─────────────────────────────────────────────

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import PremiumSection from "../components/PremiumSection";
import { logPageView, setAnalyticsUserId } from "../firebase/analytics";
import {
  initRemoteConfig,
  getConfigBoolean,
  getConfigString,
  getConfigNumber,
} from "../firebase/remoteConfig";

// Sample products data
const PRODUCTS = [
  { id: "prod_1", name: "Wireless Headphones", price: 79, image: "🎧", badge: "Best Seller" },
  { id: "prod_2", name: "Smart Watch",         price: 199, image: "⌚", badge: "New" },
  { id: "prod_3", name: "Mechanical Keyboard", price: 129, image: "⌨️", badge: null },
  { id: "prod_4", name: "USB-C Hub",           price: 49,  image: "🔌", badge: "Sale" },
];

export default function Home() {
  // Remote Config state
  const [configLoaded, setConfigLoaded] = useState(false);
  const [showPremium, setShowPremium]   = useState(false);
  const [heroBanner, setHeroBanner]     = useState("Loading...");
  const [newUiEnabled, setNewUiEnabled] = useState(false);
  const [discount, setDiscount]         = useState(0);

  useEffect(() => {
    // ─────────────────────────────────────────
    // Step 1: Log page_view analytics event
    // ─────────────────────────────────────────
    logPageView("Home", window.location.href);

    // ─────────────────────────────────────────
    // Step 2: Set a demo user ID
    // In real app: use setAnalyticsUserId(user.uid) after login
    // ─────────────────────────────────────────
    setAnalyticsUserId("demo_user_123");

    // ─────────────────────────────────────────
    // Step 3: Fetch Remote Config from Firebase
    // Then read all the feature flags
    // ─────────────────────────────────────────
    const loadConfig = async () => {
      await initRemoteConfig();

      // Read values from Remote Config
      const premiumVisible = getConfigBoolean("show_premium_section");
      const bannerText     = getConfigString("hero_banner_text");
      const newUi          = getConfigBoolean("new_ui_enabled");
      const disc           = getConfigNumber("discount_percentage");

      setShowPremium(premiumVisible);
      setHeroBanner(bannerText);
      setNewUiEnabled(newUi);
      setDiscount(disc);
      setConfigLoaded(true);
    };

    loadConfig();
  }, []);

  return (
    <div className="home-page">

      {/* ── HERO BANNER ── */}
      {/* Text comes from Remote Config: hero_banner_text */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">🔥 Firebase Analytics + Remote Config Demo</div>
          <h1 className="hero-title">{heroBanner}</h1>
          <p className="hero-subtitle">
            Every button click is tracked. Open <strong>Browser Console</strong> to
            see analytics events logged in real time.
          </p>
        </div>

        {/* Remote Config status card */}
        <div className="config-status-card">
          <h3>🎛️ Remote Config Values</h3>
          <div className="config-row">
            <span>show_premium_section</span>
            <span className={`config-val ${showPremium ? "true" : "false"}`}>
              {configLoaded ? String(showPremium) : "loading..."}
            </span>
          </div>
          <div className="config-row">
            <span>new_ui_enabled</span>
            <span className={`config-val ${newUiEnabled ? "true" : "false"}`}>
              {configLoaded ? String(newUiEnabled) : "loading..."}
            </span>
          </div>
          <div className="config-row">
            <span>discount_percentage</span>
            <span className="config-val neutral">
              {configLoaded ? `${discount}%` : "loading..."}
            </span>
          </div>
          <p className="config-hint">
            Change these in Firebase Console → Remote Config → Publish
          </p>
        </div>
      </section>

      {/* ── HOW TO TEST ANALYTICS ── */}
      <section className="debug-info">
        <h2>🧪 How to Test Analytics Events</h2>
        <div className="debug-steps">
          <div className="debug-step">
            <span className="step-num">1</span>
            <div>
              <strong>Open Browser Console</strong>
              <p>Press F12 → Console tab. You'll see [Analytics] logs here.</p>
            </div>
          </div>
          <div className="debug-step">
            <span className="step-num">2</span>
            <div>
              <strong>Enable DebugView</strong>
              <p>In Chrome: install Firebase DebugView extension, or add <code>?debug_mode=true</code> to URL</p>
            </div>
          </div>
          <div className="debug-step">
            <span className="step-num">3</span>
            <div>
              <strong>Firebase Console → Analytics → DebugView</strong>
              <p>See events appear in real time as you click buttons below!</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section className="products-section">
        <h2 className="section-title">🛍️ Products</h2>
        <p className="section-subtitle">Click any button to fire Analytics events</p>
        <div className="products-grid">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── PREMIUM SECTION (Feature Flag) ── */}
      {/* Only shown when show_premium_section = true in Remote Config */}
      {configLoaded && (
        <section className="feature-flag-demo">
          <div className="feature-flag-header">
            <h2>🚩 Feature Flag: <code>show_premium_section</code></h2>
            <p>
              This section is{" "}
              <strong>{showPremium ? "VISIBLE ✅" : "HIDDEN ❌"}</strong>
              {" "}because <code>show_premium_section = {String(showPremium)}</code> in Remote Config.
            </p>
            <p className="hint">
              Go to Firebase Console → Remote Config → set <code>show_premium_section</code> to <code>true</code> and click Publish to show it!
            </p>
          </div>

          {showPremium && (
            <PremiumSection
              newUiEnabled={newUiEnabled}
              discountPercentage={discount}
            />
          )}

          {!showPremium && (
            <div className="hidden-section-placeholder">
              🙈 PremiumSection is hidden by feature flag
            </div>
          )}
        </section>
      )}

      {/* ── ANALYTICS EVENTS REFERENCE ── */}
      <section className="events-reference">
        <h2>📋 Analytics Events in This App</h2>
        <div className="events-table">
          <div className="event-row header">
            <span>Event Name</span>
            <span>Triggered By</span>
            <span>Parameters</span>
          </div>
          <div className="event-row">
            <code>page_view</code>
            <span>Page load</span>
            <span>page_title, page_location</span>
          </div>
          <div className="event-row">
            <code>button_click</code>
            <span>"Add to Cart"</span>
            <span>button_id, product_id, price</span>
          </div>
          <div className="event-row">
            <code>purchase</code>
            <span>"Buy Now"</span>
            <span>transaction_id, value, items[]</span>
          </div>
          <div className="event-row">
            <code>search</code>
            <span>Search form</span>
            <span>search_term</span>
          </div>
          <div className="event-row">
            <code>login</code>
            <span>Login button</span>
            <span>method</span>
          </div>
          <div className="event-row">
            <code>sign_up</code>
            <span>Sign Up button</span>
            <span>method</span>
          </div>
          <div className="event-row">
            <code>premium_upgrade_click</code>
            <span>Upgrade button</span>
            <span>ui_variant, discount_offered</span>
          </div>
        </div>
      </section>

    </div>
  );
}