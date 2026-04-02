import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartPage from './pages/CartPage';
import { initialProducts } from './data';

function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Our Fresh Products 🥦</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {initialProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      {/* Navigation Link Example */}
      <div style={{ padding: '10px 2rem', background: '#f9f9f9' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
        <Link to="/cart">Go to Cart 🛒</Link>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;