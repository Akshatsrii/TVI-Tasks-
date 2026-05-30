import { trackPurchase } from "../firebase/analytics";

function ProductCard() {
  return (
    <div className="card">
      <h2>Premium Laptop</h2>

      <p>₹999</p>

      <button
        onClick={trackPurchase}
      >
        Buy Now
      </button>
    </div>
  );
}

export default ProductCard;