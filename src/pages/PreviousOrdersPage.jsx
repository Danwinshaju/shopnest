import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Check,
  MapPin,
  Package,
  Pencil,
  X,
  Ban,
} from "lucide-react";

import {
  selectOrders,
  updateOrderAddress,
  cancelOrder,
} from "../features/orders/ordersSlice";
import { validateShippingAddress } from "../app/shippingValidation";

function PreviousOrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [addressForm, setAddressForm] = useState(null);
  const [errors, setErrors] = useState({});

  function startEditing(order) {
    setEditingOrderId(order.id);
    setAddressForm({ ...order.shippingAddress });
    setErrors({});
  }

  function cancelEditing() {
    setEditingOrderId(null);
    setAddressForm(null);
    setErrors({});
  }

  function handleAddressChange(event) {
    const { name } = event.target;
    let { value } = event.target;

    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "postalCode") {
      value = value.replace(/\D/g, "").slice(0, 6);
    }

    setAddressForm((currentAddress) => ({
      ...currentAddress,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  }

  function validateAddress() {
    return validateShippingAddress(addressForm);
  }

  function saveAddress(orderId) {
    const validationErrors = validateAddress();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(
      updateOrderAddress({
        orderId,
        address: {
          ...addressForm,
          fullName: addressForm.fullName.trim(),
          email: addressForm.email.trim().toLowerCase(),
          phone: addressForm.phone.trim(),
          address: addressForm.address.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          postalCode: addressForm.postalCode.trim(),
          country: addressForm.country.trim(),
        },
      })
    );

    setEditingOrderId(null);
    setAddressForm(null);
    setErrors({});
  }

  function handleCancelOrder(orderId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (confirmed) {
      dispatch(cancelOrder({ orderId, cancelledAt: new Date().toISOString() }));
    }
  }

  function handleAddressBlur(event) {
    const { name } = event.target;
    if (!name || !(name in addressForm)) return;

    const fieldError = validateShippingAddress(addressForm)[name];
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: fieldError || "",
    }));
  }

  if (orders.length === 0) {
    return (
      <section className="empty-orders">
        <div className="empty-orders-icon">
          <Package size={40} />
        </div>

        <h1>No previous orders</h1>

        <p>
          Your completed orders will appear here after checkout.
        </p>

        <Link to="/" className="primary-button">
          Start shopping
        </Link>
      </section>
    );
  }

  return (
    <main>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Purchase history</p>
          <h1>Previous orders</h1>
        </div>

        <span>
          {orders.length}{" "}
          {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      <section className="orders-list">
        {orders.map((order) => {
          const isEditing = editingOrderId === order.id;

          return (
            <article className="order-card" key={order.id}>
              <header className="order-card-header">
                <div>
                  <span>Order number</span>
                  <strong>{order.id}</strong>
                </div>

                <div>
                  <span>Placed on</span>
                  <strong>
                    {new Date(order.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>${order.total.toFixed(2)}</strong>
                </div>

                <span
                  className={`order-status ${
                    order.status === "Cancelled" ? "is-cancelled" : ""
                  }`}
                >
                  {order.status}
                </span>

                {order.status !== "Cancelled" && (
                  <button
                    type="button"
                    className="cancel-order-button"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    <Ban size={16} />
                    Cancel order
                  </button>
                )}
              </header>

              <div className="order-card-body">
                <section className="ordered-products">
                  <h2>Products</h2>

                  {order.items.map((item) => (
                    <div className="ordered-product" key={item.id}>
                      <Link
                        to={`/products/${item.id}`}
                        className="ordered-product-image"
                        aria-label={`View ${item.title}`}
                      >
                        <img src={item.image} alt={item.title} />
                      </Link>

                      <div>
                        <strong>
                          <Link to={`/products/${item.id}`}>{item.title}</Link>
                        </strong>

                        <span>
                          Quantity: {item.quantity} · $
                          {item.price.toFixed(2)} each
                        </span>
                      </div>

                      <strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </section>

                <section className="delivery-address">
                  <div className="address-heading">
                    <div>
                      <MapPin size={20} />
                      <h2>Delivery address</h2>
                    </div>

                    {!isEditing && (
                      <button
                        type="button"
                        className="edit-address-button"
                        onClick={() => startEditing(order)}
                      >
                        <Pencil size={16} />
                        Update
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="address-edit-form" onBlur={handleAddressBlur}>
                      <label>
                        <span>Full name *</span>
                        <input
                          name="fullName"
                          value={addressForm.fullName}
                          onChange={handleAddressChange}
                          autoComplete="name"
                          required
                          minLength="3"
                          maxLength="60"
                          aria-invalid={Boolean(errors.fullName)}
                        />

                        {errors.fullName && (
                          <small className="field-error">
                            {errors.fullName}
                          </small>
                        )}
                      </label>

                      <label>
                        <span>Email *</span>
                        <input
                          type="email"
                          name="email"
                          value={addressForm.email || ""}
                          onChange={handleAddressChange}
                          autoComplete="email"
                          required
                          maxLength="100"
                          aria-invalid={Boolean(errors.email)}
                        />

                        {errors.email && (
                          <small className="field-error">
                            {errors.email}
                          </small>
                        )}
                      </label>

                      <label>
                        <span>Phone *</span>
                        <input
                          type="tel"
                          name="phone"
                          value={addressForm.phone}
                          onChange={handleAddressChange}
                          inputMode="numeric"
                          autoComplete="tel"
                          required
                          maxLength="10"
                          pattern="[6-9][0-9]{9}"
                          aria-invalid={Boolean(errors.phone)}
                        />

                        {errors.phone && (
                          <small className="field-error">
                            {errors.phone}
                          </small>
                        )}
                      </label>

                      <label className="address-full-field">
                        <span>Street address *</span>
                        <textarea
                          name="address"
                          rows="3"
                          value={addressForm.address}
                          onChange={handleAddressChange}
                          autoComplete="street-address"
                          required
                          minLength="8"
                          maxLength="150"
                          aria-invalid={Boolean(errors.address)}
                        />

                        {errors.address && (
                          <small className="field-error">
                            {errors.address}
                          </small>
                        )}
                      </label>

                      <label>
                        <span>City *</span>
                        <input
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          autoComplete="address-level2"
                          required
                          maxLength="50"
                          aria-invalid={Boolean(errors.city)}
                        />

                        {errors.city && (
                          <small className="field-error">
                            {errors.city}
                          </small>
                        )}
                      </label>

                      <label>
                        <span>State *</span>
                        <input
                          name="state"
                          value={addressForm.state}
                          onChange={handleAddressChange}
                          autoComplete="address-level1"
                          required
                          maxLength="50"
                          aria-invalid={Boolean(errors.state)}
                        />

                        {errors.state && (
                          <small className="field-error">
                            {errors.state}
                          </small>
                        )}
                      </label>

                      <label>
                        <span>Postal code *</span>
                        <input
                          name="postalCode"
                          inputMode="numeric"
                          value={addressForm.postalCode}
                          onChange={handleAddressChange}
                          autoComplete="postal-code"
                          required
                          maxLength="6"
                          pattern="[1-9][0-9]{5}"
                          aria-invalid={Boolean(errors.postalCode)}
                        />

                        {errors.postalCode && (
                          <small className="field-error">
                            {errors.postalCode}
                          </small>
                        )}
                      </label>

                      <label>
                        <span>Country *</span>
                        <input
                          name="country"
                          value={addressForm.country}
                          onChange={handleAddressChange}
                          autoComplete="country-name"
                          required
                          maxLength="50"
                          aria-invalid={Boolean(errors.country)}
                        />

                        {errors.country && (
                          <small className="field-error">
                            {errors.country}
                          </small>
                        )}
                      </label>

                      <div className="address-form-actions">
                        <button
                          type="button"
                          className="save-address-button"
                          onClick={() => saveAddress(order.id)}
                        >
                          <Check size={17} />
                          Save address
                        </button>

                        <button
                          type="button"
                          className="cancel-address-button"
                          onClick={cancelEditing}
                        >
                          <X size={17} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <address>
                      <strong>
                        {order.shippingAddress.fullName}
                      </strong>

                      <span>{order.shippingAddress.address}</span>

                      <span>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </span>

                      <span>
                        {order.shippingAddress.country}
                      </span>

                      <span>
                        Phone: {order.shippingAddress.phone}
                      </span>

                      <span>
                        Email: {order.shippingAddress.email}
                      </span>
                    </address>
                  )}
                </section>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default PreviousOrdersPage;
