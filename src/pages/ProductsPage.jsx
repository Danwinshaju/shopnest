import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { getProducts } from "../api/productsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.category))];
  }, [products]);

  const suggestedCategories = useMemo(() => {
    const categoryCounts = products.reduce((counts, product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
      return counts;
    }, {});

    return [...categories]
      .sort((first, second) => categoryCounts[second] - categoryCounts[first])
      .slice(0, 6);
  }, [categories, products]);

  const displayedProducts = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    return [...filteredProducts].sort((firstProduct, secondProduct) => {
      switch (sortOption) {
        case "price-low":
          return firstProduct.price - secondProduct.price;

        case "price-high":
          return secondProduct.price - firstProduct.price;

        case "name-az":
          return firstProduct.title.localeCompare(secondProduct.title);

        case "name-za":
          return secondProduct.title.localeCompare(firstProduct.title);

        default:
          return 0;
      }
    });
  }, [products, searchText, selectedCategory, sortOption]);

  function resetFilters() {
    setSearchText("");
    setSelectedCategory("all");
    setSortOption("default");
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <section className="message-card error-message">
        <h1>Something went wrong</h1>
        <p>{error}</p>

        <button
          type="button"
          className="primary-button"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <main>
      <section className="products-heading">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> ShopNest catalogue</p>
          <h1>{selectedCategory === "all" ? "All products" : selectedCategory}</h1>
          <p>
            Browse trusted products, compare prices and add your favorites to cart.
          </p>
        </div>

        <span className="result-count">
          {displayedProducts.length} products
        </span>
      </section>

      <section className="product-controls" aria-label="Product filters">
        <label className="search-field">
          <span className="control-label">Search products</span>
          <span className="search-input-wrap">
            <Search size={19} />
            <input
              type="search"
              placeholder="Search by product or category"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            {searchText && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchText("")}
                aria-label="Clear product search"
              >
                <X size={17} />
              </button>
            )}
          </span>
        </label>

        <label>
          <span className="control-label">Category</span>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All categories</option>

            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="control-label">Sort by</span>

          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
          >
            <option value="default">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name-az">Name: A to Z</option>
            <option value="name-za">Name: Z to A</option>
          </select>
        </label>
      </section>

      <section className="product-suggestions" aria-label="Popular product suggestions">
        <span className="suggestions-title">
          <Sparkles size={17} /> Popular suggestions
        </span>
        <div className="suggestion-chips">
          {suggestedCategories.map((category) => (
            <button
              type="button"
              className={selectedCategory === category ? "is-active" : ""}
              onClick={() => setSelectedCategory(category)}
              key={category}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {displayedProducts.length > 0 ? (
        <section className="product-grid">
          {displayedProducts.map((product) => (
            <ProductCard
              product={product}
              onSelect={setSelectedProduct}
              key={product.id}
            />
          ))}
        </section>
      ) : (
        <section className="message-card">
          <h2>No matching products</h2>
          <p>Try changing your search or selected category.</p>

          <button
            type="button"
            className="primary-button"
            onClick={resetFilters}
          >
            Clear filters
          </button>
        </section>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}

export default ProductsPage;
