// import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// App.jsx
import React, { useState, useEffect, useMemo } from "react";
import "./App.css";

const PRODUCTS = [
  {
    id: 1,
    name: "Laptop Pro",
    category: "Electronics",
    price: 1299.99,
    image: "ecommerce-catalog-new/src/pics/IMG-20250819-WA0014.jpg",
    description: "Powerful laptop for professionals",
  },
  {
    id: 2,
    name: "Sneakers",
    category: "Fashion",
    price: 79.99,
    image: "https://via.placeholder.com/150",
    description: "Comfortable running shoes",
  },
  {
    id: 3,
    name: "Smartphone X",
    category: "Electronics",
    price: 899.99,
    image: "C:\Users\heman\hackathon\ecommerce-catalog-new\src\pics\IMG-20250819-WA0012.jpg",
    description: "Latest smartphone with amazing camera",
  },
  {
    id: 4,
    name: "Backpack",
    category: "Fashion",
    price: 49.99,
    image: "C:\Users\heman\hackathon\ecommerce-catalog-new\src\pics\IMG-20250819-WA0011.jpg",
    description: "Stylish backpack for daily use",
  },
  {
    id: 5,
    name: "Coffee Maker",
    category: "Home",
    price: 99.99,
    image: "https://via.placeholder.com/150",
    description: "Brew perfect coffee every morning",
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "Home",
    price: 29.99,
    image: "https://via.placeholder.com/150",
    description: "Modern lamp with adjustable brightness",
  },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home"];

// ProductCard Component
function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category">{product.category}</p>
        <p>{product.description}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <div className="actions">
          <button onClick={() => onAddToCart(product)}>Add to Cart</button>
          <button
            className="wishlist-btn"
            onClick={() => onToggleWishlist(product.id)}
            aria-label="Toggle wishlist"
          >
            {isWishlisted ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}

// CartItem Component
function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="cart-item">
      <span>{item.name}</span>
      <div className="quantity-controls">
        <button onClick={() => onQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
          -
        </button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
        />
        <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}>+</button>
      </div>
      <span>${(item.price * item.quantity).toFixed(2)}</span>
      <button onClick={() => onRemove(item.id)} className="remove-btn" aria-label="Remove from cart">×</button>
    </div>
  );
}

// FilterBar Component
function FilterBar({ categories, selectedCategory, onCategoryChange, searchTerm, onSearchChange }) {
  return (
    <div className="filter-bar">
      <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} aria-label="Filter by category">
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search products"
      />
    </div>
  );
}

// Dark/Light mode toggle
function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark/light mode">
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}

// Main App Component
export default function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  // Add product to cart or increase quantity
  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  // Change quantity or remove if qty < 1
  function changeQuantity(id, quantity) {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  // Remove item from cart
  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  // Toggle wishlist status
  function toggleWishlist(id) {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      return (
        (category === "All" || product.category === category) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [category, searchTerm]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  // Toggle theme mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="app">
      <header>
        <h1>Simple E-commerce Catalog</h1>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </header>

      <FilterBar
        categories={CATEGORIES}
        selectedCategory={category}
        onCategoryChange={setCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main>
        <section className="product-list">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist.has(product.id)}
              />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </section>

        <aside className="cart-section">
          <h2>Shopping Cart</h2>
          {cart.length === 0 && <p>Cart is empty.</p>}
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={changeQuantity}
              onRemove={removeFromCart}
            />
          ))}
          <div className="total">
            <strong>Total:</strong> ${totalPrice.toFixed(2)}
          </div>
        </aside>
      </main>
    </div>
  );
}
