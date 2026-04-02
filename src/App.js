import React from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import { initialProducts } from './data';

function App() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <h1>Our Products 🥦</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {initialProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;