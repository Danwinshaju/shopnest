import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Star, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

import {
  addToCart,
  removeFromCart,
  selectCartItems,
  updateQuantity,
} from "../features/cart/cartSlice";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import QuantitySelector from "./QuantitySelector";

function ProductModal({ product, onClose, moveFromWishlist = false }) {
  const dispatch = useDispatch();
  const existingItem = useSelector((state) =>
    selectCartItems(state).find((item) => item.id === product.id)
  );
  const [quantity, setQuantity] = useState(existingItem?.quantity || 1);

  function handleQuantityChange(nextQuantity) {
    setQuantity(nextQuantity);

    if (existingItem) {
      dispatch(updateQuantity({ id: product.id, quantity: nextQuantity }));
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const dialog = document.querySelector(".product-modal");
        const focusableElements = dialog?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'
        );

        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  function handleCartAction() {
    if (moveFromWishlist && existingItem) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Product is already in your cart");
      onClose();
      return;
    }

    if (existingItem) {
      dispatch(removeFromCart(product.id));
      setQuantity(1);
      toast.success("Product removed from cart");
      return;
    }

    dispatch(addToCart({ product, quantity }));

    if (moveFromWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Product moved to cart");
      onClose();
      return;
    }

    toast.success(
      `${quantity} ${quantity === 1 ? "item" : "items"} added to cart`
    );
  }

  return (
    <div className="product-modal-backdrop" onMouseDown={onClose}>
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close product details"
          autoFocus
        >
          <X size={22} />
        </button>

        <div className="modal-image-panel">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="modal-product-content">
          <p className="product-category">{product.category}</p>
          <h2 id="product-modal-title">{product.title}</h2>

          <div className="details-rating">
            <div className="rating-stars">
              <Star size={18} fill="currentColor" />
              <strong>{product.rating.rate}</strong>
            </div>
            <span>{product.rating.count} reviews</span>
          </div>

          <p className="modal-price">${product.price.toFixed(2)}</p>
          <p className="modal-description">{product.description}</p>

          <div className="modal-purchase-row">
            <div>
              <span className="quantity-label">Quantity</span>
              <QuantitySelector
                quantity={quantity}
                onChange={handleQuantityChange}
              />
            </div>

            <button
              type="button"
              className="add-cart-button"
              onClick={handleCartAction}
            >
              {existingItem ? <Trash2 size={20} /> : <ShoppingCart size={20} />}
              {existingItem ? "Remove from cart" : "Add to cart"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductModal;
