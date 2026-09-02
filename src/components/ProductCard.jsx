import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "react-toastify";

import {
  addToCart,
  removeFromCart,
  selectCartItems,
  updateQuantity,
} from "../features/cart/cartSlice";
import {
  removeFromWishlist,
  selectWishlistItems,
  toggleWishlist,
} from "../features/wishlist/wishlistSlice";
import QuantitySelector from "./QuantitySelector";

function ProductCard({ product, onSelect, moveFromWishlist = false }) {
  const dispatch = useDispatch();
  const existingItem = useSelector((state) =>
    selectCartItems(state).find((item) => item.id === product.id)
  );
  const isWishlisted = useSelector((state) =>
    selectWishlistItems(state).some((item) => item.id === product.id)
  );

  function handleAddToCart() {
    if (moveFromWishlist) {
      if (!existingItem) {
        dispatch(addToCart({ product, quantity: 1 }));
      }

      dispatch(removeFromWishlist(product.id));
      toast.success(existingItem ? "Product is already in your cart" : "Product moved to cart");
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));

    toast.success(
      existingItem ? "Cart quantity increased" : "Product added to cart"
    );
  }

  function handleWishlist() {
    dispatch(toggleWishlist(product));
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist"
    );
  }

  function handleQuantityChange(quantity) {
    if (quantity === 0) {
      dispatch(removeFromCart(product.id));
      toast.success("Product removed from cart");
      return;
    }

    dispatch(updateQuantity({ id: product.id, quantity }));
  }

  return (
    <article className="product-card">
      <button
        type="button"
        className="product-image-container"
        onClick={() => onSelect(product)}
        aria-label={`View details for ${product.title}`}
      >
        <img src={product.image} alt={product.title} className="product-image" />
      </button>

      <div className="product-content">
        <p className="product-category">{product.category}</p>
        <h2 className="product-title">
          <button type="button" onClick={() => onSelect(product)}>
            {product.title}
          </button>
        </h2>

        <div className="product-rating">
          <Star size={17} fill="currentColor" />
          <span>{product.rating.rate}</span>
          <span className="rating-count">({product.rating.count} reviews)</span>
        </div>

        <div className="product-card-footer">
          <strong className="product-price">${product.price.toFixed(2)}</strong>
          <button type="button" className="view-button" onClick={() => onSelect(product)}>
            View details
          </button>
        </div>

        <div
          className={`product-card-purchase ${existingItem && !moveFromWishlist ? "is-in-cart" : ""}`}
        >
          {existingItem && !moveFromWishlist ? (
            <>
              <QuantitySelector
                quantity={existingItem.quantity}
                onChange={handleQuantityChange}
                allowZero
              />
            </>
          ) : (
            <button type="button" className="card-cart-button" onClick={handleAddToCart}>
              <ShoppingCart size={17} />
              {moveFromWishlist ? "Move to cart" : "Add to cart"}
            </button>
          )}
          {!moveFromWishlist && (
            <button
              type="button"
              className={`wishlist-button ${isWishlisted ? "is-active" : ""}`}
              onClick={handleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={isWishlisted}
            >
              <Heart size={19} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
