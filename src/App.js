// src/App.js
import React from 'react';
import { products } from './data';
import { CartProvider } from './CartContext';
import Product from './components/Product';
import Cart from './components/Cart';

function App() {
  return (
    <CartProvider>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div>
          <h1>Supermarket 🥬</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {products.map(p => <Product key={p.id} product={p} />)}
          </div>
        </div>
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;