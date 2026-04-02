import React, { useState } from 'react';
import { initialProducts } from './data';
import ProductCard from './components/ProductCard';

function Home() {
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Logic to Filter Products 🧠
  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Vegetables', 'Fruits', 'Cakes', 'Biscuits'];

  return (
    <main style={{ padding: '2rem' }}>
      <div style={filterContainer}>
        {/* Search Bar */}
        <input 
          type="text" 
          placeholder="Search products... 🔍" 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInput}
        />
        
        {/* Category Buttons */}
        <div style={{ marginTop: '15px' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)}
              style={category === cat ? activeBtn : inactiveBtn}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <h1>{category} Items 🥦</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

// Styles
const filterContainer = { marginBottom: '30px', textAlign: 'center' };
const searchInput = { padding: '10px', width: '300px', borderRadius: '20px', border: '1px solid #ddd' };
const inactiveBtn = { margin: '5px', padding: '8px 15px', cursor: 'pointer', borderRadius: '15px', border: '1px solid #2ecc71', background: 'white' };
const activeBtn = { ...inactiveBtn, background: '#2ecc71', color: 'white' };

export default Home;