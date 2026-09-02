const PERSON_NAME_PATTERN = /^[\p{L}]+(?:[ .'-][\p{L}]+)*$/u;
const PLACE_NAME_PATTERN = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
const EMAIL_PATTERN = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
const PHONE_PATTERN = /^[6-9][0-9]{9}$/;
const ADDRESS_PATTERN = /^[\p{L}\p{N}\s,./#'()-]+$/u;

export function validateShippingAddress(form) {
  const errors = {};
  const fullName = form.fullName?.trim() || "";
  const email = form.email?.trim() || "";
  const phone = form.phone?.trim() || "";
  const address = form.address?.trim() || "";
  const city = form.city?.trim() || "";
  const state = form.state?.trim() || "";
  const postalCode = form.postalCode?.trim() || "";
  const country = form.country?.trim() || "";

  if (!fullName) {
    errors.fullName = "Full name is required";
  } else if (fullName.length < 3 || !PERSON_NAME_PATTERN.test(fullName)) {
    errors.fullName = "Name must contain only letters and spaces";
  }

  const emailLocalPart = email.split("@")[0] || "";
  const hasInvalidEmailDots =
    emailLocalPart.startsWith(".") ||
    emailLocalPart.endsWith(".") ||
    emailLocalPart.includes("..");

  if (!email) {
    errors.email = "Email address is required";
  } else if (
    email.length > 254 ||
    emailLocalPart.length > 64 ||
    hasInvalidEmailDots ||
    !EMAIL_PATTERN.test(email)
  ) {
    errors.email = "Enter a valid email, such as name@example.com";
  }

  if (!phone) {
    errors.phone = "Phone number is required";
  } else if (!PHONE_PATTERN.test(phone) || /^([0-9])\1{9}$/.test(phone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number";
  }

  if (!address) {
    errors.address = "Street address is required";
  } else if (
    address.length < 8 ||
    address.length > 150 ||
    !ADDRESS_PATTERN.test(address) ||
    !/[\p{L}]/u.test(address)
  ) {
    errors.address = "Enter a valid street address (8–150 characters)";
  }

  if (!city) {
    errors.city = "City is required";
  } else if (city.length < 2 || !PLACE_NAME_PATTERN.test(city)) {
    errors.city = "City must contain only letters and spaces";
  }

  if (!state) {
    errors.state = "State is required";
  } else if (state.length < 2 || !PLACE_NAME_PATTERN.test(state)) {
    errors.state = "State must contain only letters and spaces";
  }

  if (!postalCode) {
    errors.postalCode = "Postal code is required";
  } else if (!/^[1-9][0-9]{5}$/.test(postalCode)) {
    errors.postalCode = "Enter a valid 6-digit postal code";
  }

  if (!country) {
    errors.country = "Country is required";
  } else if (country.length < 2 || !PLACE_NAME_PATTERN.test(country)) {
    errors.country = "Country must contain only letters and spaces";
  }

  return errors;
}
