import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../../app/localStorage";

const initialState = {
  orders: loadState("ecommerce-orders", []),
  savedAddress: loadState("ecommerce-address", null),
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder: (state, action) => {
      state.orders.unshift(action.payload);
      state.savedAddress = action.payload.shippingAddress;
    },

    updateOrderAddress: (state, action) => {
      const { orderId, address } = action.payload;

      const order = state.orders.find(
        (currentOrder) => currentOrder.id === orderId
      );

      if (order) {
        order.shippingAddress = address;
      }

      state.savedAddress = address;
    },

    updateSavedAddress: (state, action) => {
      state.savedAddress = action.payload;
    },

    cancelOrder: (state, action) => {
      const { orderId, cancelledAt } = action.payload;
      const order = state.orders.find(
        (currentOrder) => currentOrder.id === orderId
      );

      if (order && order.status !== "Cancelled") {
        order.status = "Cancelled";
        order.cancelledAt = cancelledAt;
      }
    },
  },
});

export const {
  placeOrder,
  updateOrderAddress,
  updateSavedAddress,
  cancelOrder,
} = ordersSlice.actions;

export const selectOrders = (state) => state.orders.orders;
export const selectSavedAddress = (state) =>
  state.orders.savedAddress;

export default ordersSlice.reducer;
