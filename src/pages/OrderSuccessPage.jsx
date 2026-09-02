import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, PackageCheck } from "lucide-react";

import { selectOrders } from "../features/orders/ordersSlice";

function OrderSuccessPage() {
  const { orderId } = useParams();
  const orders = useSelector(selectOrders);

  const order = orders.find(
    (currentOrder) => currentOrder.id === orderId
  );

  if (!order) {
    return (
      <section className="message-card">
        <h1>Order not found</h1>
        <p>We could not find the requested order.</p>

        <Link to="/orders" className="primary-button">
          View previous orders
        </Link>
      </section>
    );
  }

  return (
    <main className="order-success">
      <CheckCircle2 size={76} />

      <p className="eyebrow">Order confirmed</p>
      <h1>Thank you for your order!</h1>

      <p>
        Your order has been successfully placed and stored in
        your order history.
      </p>

      <div className="confirmation-card">
        <PackageCheck size={28} />

        <div>
          <span>Order number</span>
          <strong>{order.id}</strong>
        </div>

        <div>
          <span>Order total</span>
          <strong>${order.total.toFixed(2)}</strong>
        </div>

        <div>
          <span>Delivering to</span>
          <strong>
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.country}
          </strong>
        </div>
      </div>

      <div className="success-actions">
        <Link to="/orders" className="primary-button">
          View previous orders
        </Link>

        <Link to="/" className="secondary-button">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}

export default OrderSuccessPage;