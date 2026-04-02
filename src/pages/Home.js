import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { subscribeToProducts } from '../services/firestore';

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProducts((productsData) => {
      setProducts(productsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const productsByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredProducts.filter(product => product.category === category);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <main className="p-8">
      <div className="mb-8">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {categories.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          {productsByCategory[category].length === 0 ? (
            <p className="text-gray-500">No products found in this category.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsByCategory[category].map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}

export default Home;