import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { getProductById } from "../api/productsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import QuantitySelector from "../components/QuantitySelector";
import {
  addToCart,
  removeFromCart,
  selectCartItems,
  updateQuantity,
} from "../features/cart/cartSlice";

function ProductDetailsPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const existingItem = useSelector((state) =>
    selectCartItems(state).find((item) => String(item.id) === productId)
  );
  const displayedQuantity = existingItem?.quantity || quantity;

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        setError("");
        setProduct(await getProductById(productId));
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  function handleQuantityChange(nextQuantity) {
    setQuantity(nextQuantity);

    if (existingItem) {
      dispatch(updateQuantity({ id: existingItem.id, quantity: nextQuantity }));
    }
  }

  function handleCartAction() {
    if (existingItem) {
      dispatch(removeFromCart(existingItem.id));
      setQuantity(1);
      toast.success("Product removed from cart");
      return;
    }

    dispatch(addToCart({ product, quantity }));
    toast.success("Product added to cart");
  }

  if (isLoading) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <section className="message-card error-message">
        <h1>Product unavailable</h1>
        <p>{error || "This product could not be found."}</p>
        <Link to="/" className="primary-button">Return to products</Link>
      </section>
    );
  }

  return (
    <main>
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Back to products
      </Link>

      <section className="product-details">
        <div className="details-image-panel">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="details-content">
          <p className="product-category">{product.category}</p>
          <h1>{product.title}</h1>

          <div className="details-rating">
            <div className="rating-stars">
              <Star size={18} fill="currentColor" />
              <strong>{product.rating.rate}</strong>
            </div>
            <span>{product.rating.count} reviews</span>
          </div>

          <p className="details-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <div className="purchase-panel">
            <div>
              <span className="quantity-label">Quantity</span>
              <QuantitySelector
                quantity={displayedQuantity}
                onChange={handleQuantityChange}
              />
            </div>

            <button type="button" className="add-cart-button" onClick={handleCartAction}>
              {existingItem ? <Trash2 size={20} /> : <ShoppingCart size={20} />}
              {existingItem ? "Remove from cart" : "Add to cart"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;
