// src/components/PremiumSection.jsx
// ─────────────────────────────────────────────
// 👑 PREMIUM SECTION — Feature Flag Demo
//
// This entire section is controlled by Remote Config!
// The parent (Home.jsx) reads `show_premium_section` from
// Remote Config and only renders this component if true.
//
// Also controlled by `new_ui_enabled` flag for A/B testing.
// ─────────────────────────────────────────────

import { logCustomEvent, setAnalyticsUserProperties } from "../firebase/analytics";

export default function PremiumSection({ newUiEnabled, discountPercentage }) {

  // 🎯 When user clicks "Upgrade to Premium"
  const handleUpgrade = () => {
    // Set user property so Analytics knows this user is premium
    setAnalyticsUserProperties({ subscription: "premium" });

    // Log a custom event
    logCustomEvent("premium_upgrade_click", {
      ui_variant: newUiEnabled ? "new_ui" : "classic_ui",
      discount_offered: discountPercentage,
    });

    alert(
      `👑 Premium Upgrade Clicked!\n\n` +
      `✅ setUserProperties called:\n` +
      `   subscription: "premium"\n\n` +
      `✅ Custom event "premium_upgrade_click" logged!\n` +
      `   ui_variant: "${newUiEnabled ? "new_ui" : "classic_ui"}"\n` +
      `   discount_offered: ${discountPercentage}%\n\n` +
      `Check Firebase Console → DebugView`
    );
  };

  // ─────────────────────────────────────────────
  // 🆕 NEW UI (when new_ui_enabled = true in Remote Config)
  // This is the A/B test variant
  // ─────────────────────────────────────────────
  if (newUiEnabled) {
    return (
      <section className="premium-section new-ui">
        <div className="new-ui-badge">🧪 A/B Test: New UI Variant</div>
        <div className="premium-content">
          <h2 className="premium-title">
            🚀 Exclusive Premium Access
          </h2>
          <p className="premium-subtitle">
            You're seeing the NEW UI (new_ui_enabled = <strong>true</strong> in Remote Config)
          </p>

          <div className="premium-features-grid">
            <div className="feature-item">⚡ Faster Checkout</div>
            <div className="feature-item">🎁 Free Shipping</div>
            <div className="feature-item">💬 Priority Support</div>
            <div className="feature-item">🔒 Early Access</div>
          </div>

          {discountPercentage > 0 && (
            <div className="discount-banner">
              🔥 Limited offer: <strong>{discountPercentage}% OFF</strong> your first month!
              <br />
              <small>(discount_percentage = {discountPercentage} from Remote Config)</small>
            </div>
          )}

          <button className="btn-premium-cta" onClick={handleUpgrade}>
            Upgrade to Premium →
          </button>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // 🏛️ CLASSIC UI (when new_ui_enabled = false)
  // ─────────────────────────────────────────────
  return (
    <section className="premium-section classic-ui">
      <div className="classic-ui-badge">📺 Classic UI Variant</div>
      <div className="premium-content">
        <h2 className="premium-title">👑 Go Premium</h2>
        <p className="premium-subtitle">
          Classic UI (new_ui_enabled = <strong>false</strong> in Remote Config)
        </p>

        <ul className="premium-list">
          <li>✅ Ad-free experience</li>
          <li>✅ Exclusive deals</li>
          <li>✅ Free shipping on all orders</li>
          <li>✅ 24/7 customer support</li>
        </ul>

        {discountPercentage > 0 && (
          <div className="discount-banner">
            🎉 Save <strong>{discountPercentage}%</strong> today!
          </div>
        )}

        <button className="btn-premium-cta classic" onClick={handleUpgrade}>
          Upgrade Now
        </button>
      </div>
    </section>
  );
}