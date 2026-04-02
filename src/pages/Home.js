import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { subscribeToProducts } from '../services/firestore';

function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProducts((productsData) => {
      setProducts(productsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category))).sort()];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <main className="p-8">
      <div className="mb-8 grid gap-4 md:grid-cols-2 items-end">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full transition ${category === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-green-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">{category} Items</h1>
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Home;