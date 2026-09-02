import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import QuantitySelector from "../components/QuantitySelector";
import {
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "../features/cart/cartSlice";

function CartPage() {
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  function handleQuantityChange(productId, quantity) {
    dispatch(
      updateQuantity({
        id: productId,
        quantity,
      })
    );
  }

  function handleRemove(productId) {
    dispatch(removeFromCart(productId));
  }

  if (cartItems.length === 0) {
    return (
      <section className="empty-cart">
        <div className="empty-cart-icon">
          <ShoppingBag size={38} />
        </div>

        <h1>Your cart is empty</h1>

        <p>
          You have not added any products to your cart yet.
        </p>

        <Link to="/" className="primary-button">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <main>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Review your selection</p>
          <h1>Shopping cart</h1>
        </div>

        <span>
          {cartItems.length}{" "}
          {cartItems.length === 1 ? "product" : "products"}
        </span>
      </div>

      <div className="cart-layout">
        <section className="cart-items" aria-label="Cart products">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <Link
                to={`/products/${item.id}`}
                className="cart-item-image"
              >
                <img src={item.image} alt={item.title} />
              </Link>

              <div className="cart-item-information">
                <p className="product-category">
                  {item.category}
                </p>

                <h2>
                  <Link to={`/products/${item.id}`}>
                    {item.title}
                  </Link>
                </h2>

                <p className="cart-unit-price">
                  ${item.price.toFixed(2)} each
                </p>

                <div className="cart-item-actions">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(quantity) =>
                      handleQuantityChange(item.id, quantity)
                    }
                  />

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>

              <strong className="cart-line-total">
                ${(item.price * item.quantity).toFixed(2)}
              </strong>
            </article>
          ))}

          <Link to="/" className="continue-shopping">
            <ArrowLeft size={18} />
            Continue shopping
          </Link>
        </section>

        <aside className="order-summary">
          <h2>Order summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <strong className="free-shipping">Free</strong>
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>

          <Link to="/checkout" className="checkout-button">
            Proceed to checkout
          </Link>

          <p className="summary-note">
            Secure checkout and easy returns.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default CartPage;