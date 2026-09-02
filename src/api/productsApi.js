const FAKE_STORE_API_URL = "https://fakestoreapi.com";
const DUMMY_JSON_API_URL = "https://dummyjson.com";

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error("Unable to load products");
  }

  return response.json();
}

export async function getProducts() {
  const results = await Promise.allSettled([
    fetch(`${FAKE_STORE_API_URL}/products`).then(handleResponse),
    fetch(`${DUMMY_JSON_API_URL}/products?limit=40`).then(handleResponse),
  ]);

  const fakeStoreProducts =
    results[0].status === "fulfilled"
      ? results[0].value.map(normalizeFakeStoreProduct)
      : [];
  const dummyProducts =
    results[1].status === "fulfilled"
      ? results[1].value.products.map(normalizeDummyProduct)
      : [];

  const products = [...fakeStoreProducts, ...dummyProducts];

  if (products.length === 0) {
    throw new Error("Unable to load products");
  }

  return products;
}

export async function getProductById(productId) {
  if (String(productId).startsWith("dummy-")) {
    const dummyId = String(productId).replace("dummy-", "");
    const response = await fetch(`${DUMMY_JSON_API_URL}/products/${dummyId}`);
    return normalizeDummyProduct(await handleResponse(response));
  }

  const response = await fetch(`${FAKE_STORE_API_URL}/products/${productId}`);
  return normalizeFakeStoreProduct(await handleResponse(response));
}

function formatCategory(category) {
  return category
    .split(/[-\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeFakeStoreProduct(product) {
  return { ...product, category: formatCategory(product.category) };
}

function normalizeDummyProduct(product) {
  return {
    id: `dummy-${product.id}`,
    title: product.title,
    price: product.price,
    description: product.description,
    category: formatCategory(product.category),
    image: product.thumbnail || product.images?.[0],
    rating: {
      rate: product.rating,
      count: product.reviews?.length || product.stock || 0,
    },
  };
}
