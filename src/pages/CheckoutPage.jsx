import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

import {
  clearCart,
  selectCartItems,
  selectCartTotal,
} from "../features/cart/cartSlice";

import {
  placeOrder,
  selectSavedAddress,
} from "../features/orders/ordersSlice";
import { validateShippingAddress } from "../app/shippingValidation";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const savedAddress = useSelector(selectSavedAddress);

  const [form, setForm] = useState({
    ...emptyForm,
    ...(savedAddress || {}),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  function handleChange(event) {
    const { name } = event.target;
    let { value } = event.target;

    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "postalCode") {
      value = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    if (!name || !(name in form)) return;

    const fieldError = validateShippingAddress(form)[name];
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: fieldError || "",
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateShippingAddress(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstInvalidField =
        Object.keys(validationErrors)[0];

      document
        .querySelector(`[name="${firstInvalidField}"]`)
        ?.focus();

      return;
    }

    setIsSubmitting(true);

    const orderId = `ORD-${Date.now()}`;

    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: cartItems,
      total: cartTotal,
      status: "Confirmed",
      paymentMethod: "Cash on delivery",
      shippingAddress: {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
      },
    };

    dispatch(placeOrder(newOrder));
    dispatch(clearCart());

    navigate(`/order-success/${orderId}`, {
      replace: true,
    });
  }

  return (
    <main>
      <Link to="/cart" className="back-link">
        <ArrowLeft size={18} />
        Back to cart
      </Link>

      <div className="page-heading">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1>Delivery details</h1>
        </div>
      </div>

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
          onBlur={handleBlur}
          noValidate
        >
          <div className="form-section-heading">
            <h2>Contact and shipping information</h2>
            <p>Fields marked with * are required.</p>
          </div>

          <div className="form-grid">
            <label className="full-field">
              <span>Full name *</span>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
                minLength="3"
                maxLength="60"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={
                  errors.fullName ? "fullName-error" : undefined
                }
              />

              {errors.fullName && (
                <small id="fullName-error" className="field-error">
                  {errors.fullName}
                </small>
              )}
            </label>

            <label>
              <span>Email address *</span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
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
              <span>Phone number *</span>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                inputMode="numeric"
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

            <label className="full-field">
              <span>Street address *</span>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                autoComplete="street-address"
                rows="3"
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
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
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
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
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
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                inputMode="numeric"
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
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
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
          </div>

          <div className="payment-information">
            <Lock size={20} />

            <div>
              <strong>Cash on delivery</strong>
              <p>Pay when your order is delivered.</p>
            </div>
          </div>

          <button
            type="submit"
            className="place-order-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Placing order..."
              : `Place order · $${cartTotal.toFixed(2)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Your order</h2>

          <div className="checkout-products">
            {cartItems.map((item) => (
              <div className="checkout-product" key={item.id}>
                <div className="checkout-product-image">
                  <img src={item.image} alt="" />

                  <span>{item.quantity}</span>
                </div>

                <div>
                  <strong>{item.title}</strong>
                  <small>
                    ${item.price.toFixed(2)} each
                  </small>
                </div>

                <span>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <strong className="free-shipping">Free</strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default CheckoutPage;
