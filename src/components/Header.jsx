import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { Heart, Package, ShoppingBag, Store } from "lucide-react";

import { selectCartCount } from "../features/cart/cartSlice";
import { selectWishlistCount } from "../features/wishlist/wishlistSlice";

function Header() {
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Store size={20} />
          </span>
          <span>ShopNest</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>
            <Store size={18} /> <span>Products</span>
          </NavLink>

          <NavLink to="/wishlist" className="cart-link">
            <Heart size={18} /> <span>Wishlist</span>
            {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
          </NavLink>

          <NavLink to="/cart" className="cart-link">
            <ShoppingBag size={18} />
            <span>Cart</span>

            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </NavLink>

          <NavLink to="/orders">
            <Package size={18} /> <span>Orders</span>
          </NavLink>
        </div>
      </nav>

    </header>
  );
}

export default Header;
