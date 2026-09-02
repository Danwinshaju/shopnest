import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { selectWishlistItems } from "../features/wishlist/wishlistSlice";

function WishlistPage() {
  const wishlistItems = useSelector(selectWishlistItems);
  const navigate = useNavigate();

  if (wishlistItems.length === 0) {
    return (
      <section className="empty-wishlist">
        <div className="empty-wishlist-icon"><Heart size={40} /></div>
        <h1>Your wishlist is empty</h1>
        <p>Save products you like and return to them anytime.</p>
        <Link to="/" className="primary-button">Explore products</Link>
      </section>
    );
  }

  return (
    <main>
      <div className="page-heading">
        <div><p className="eyebrow">Saved for later</p><h1>My wishlist</h1></div>
        <span>{wishlistItems.length} saved products</span>
      </div>
      <section className="product-grid">
        {wishlistItems.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={(product) => navigate(`/products/${product.id}`)}
            moveFromWishlist
          />
        ))}
      </section>
    </main>
  );
}

export default WishlistPage;
