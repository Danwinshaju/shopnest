import { Minus, Plus } from "lucide-react";

function QuantitySelector({ quantity, onChange, allowZero = false }) {
  const minimumQuantity = allowZero ? 0 : 1;

  function decrease() {
    onChange(Math.max(minimumQuantity, quantity - 1));
  }

  function increase() {
    onChange(quantity + 1);
  }

  function updateQuantity(event) {
    const newQuantity = Number(event.target.value);

    if (Number.isInteger(newQuantity) && newQuantity >= minimumQuantity) {
      onChange(newQuantity);
    }
  }

  return (
    <div className="quantity-selector">
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= minimumQuantity}
        aria-label="Decrease quantity"
      >
        <Minus size={18} />
      </button>

      <input
        type="number"
        min={minimumQuantity}
        value={quantity}
        onChange={updateQuantity}
        aria-label="Product quantity"
      />

      <button
        type="button"
        onClick={increase}
        aria-label="Increase quantity"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

export default QuantitySelector;
