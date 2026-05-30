// src/components/ProductCard.jsx
// ─────────────────────────────────────────────
// 🛍️ PRODUCT CARD COMPONENT
// Logs analytics events for: Buy Now, Purchase
// ─────────────────────────────────────────────

import { logBuyNowClick, logPurchase } from "../firebase/analytics";

export default function ProductCard({ product }) {
  const { id, name, price, image, badge } = product;

  // 🛒 EVENT: button_click (buy_now)
  // Fires when "Add to Cart" is clicked
  const handleBuyNow = () => {
    // Log the button click event
    logBuyNowClick(id, name, price);
    alert(
      `🛒 Added "${name}" to cart!\n\n` +
      `✅ Analytics event "button_click" logged!\n` +
      `   button_id: "buy_now"\n` +
      `   product_id: "${id}"\n` +
      `   price: $${price}\n\n` +
      `Check Firebase Console → DebugView`
    );
  };

  // 💰 EVENT: purchase
  // Fires when "Buy Now" (instant purchase) is clicked
  const handlePurchase = () => {
    const transactionId = "TXN_" + Date.now();

    // Log the purchase event with all required fields
    logPurchase(transactionId, price, "USD", [
      {
        item_id: id,
        item_name: name,
        price: price,
        quantity: 1,
      },
    ]);

    alert(
      `💰 Purchase Successful!\n\n` +
      `✅ Analytics event "purchase" logged!\n` +
      `   transaction_id: "${transactionId}"\n` +
      `   value: $${price}\n` +
      `   item: "${name}"\n\n` +
      `Check Firebase Console → DebugView`
    );
  };

  return (
    <div className="product-card">
      {badge && <span className="product-badge">{badge}</span>}

      <div className="product-image">
        <span className="product-emoji">{image}</span>
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">${price}</p>
      </div>

      <div className="product-actions">
        {/* Logs "button_click" with button_id: "buy_now" */}
        <button className="btn-cart" onClick={handleBuyNow}>
          Add to Cart
        </button>

        {/* Logs "purchase" event */}
        <button className="btn-buy" onClick={handlePurchase}>
          Buy Now 💳
        </button>
      </div>

      <div className="analytics-hint">
        📊 Logs: <code>button_click</code> + <code>purchase</code>
      </div>
    </div>
  );
}