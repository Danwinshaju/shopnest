import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../features/cart/cartSlice";
import ordersReducer from "../features/orders/ordersSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import { saveState } from "./localStorage";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer,
    wishlist: wishlistReducer,
  },
});

let persistenceTimer;

store.subscribe(() => {
  clearTimeout(persistenceTimer);

  persistenceTimer = setTimeout(() => {
  const state = store.getState();

  saveState("ecommerce-cart", state.cart.items);
  saveState("ecommerce-orders", state.orders.orders);
  saveState("ecommerce-address", state.orders.savedAddress);
  saveState("ecommerce-wishlist", state.wishlist.items);
  }, 150);
});
