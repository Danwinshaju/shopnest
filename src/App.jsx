import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/Layout";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PreviousOrdersPage from "./pages/PreviousOrdersPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import NotFoundPage from "./pages/NotFoundPage";
import WishlistPage from "./pages/WishlistPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<PreviousOrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          <Route
            path="/order-success/:orderId"
            element={<OrderSuccessPage />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={2200}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
