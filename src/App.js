import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartPage from './pages/CartPage';
import { initialProducts } from './data';
import { CartProvider } from './context/CartContext';

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Our Fresh Stock 🥬</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {initialProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;