// src/components/Product.js
import React, { useContext } from 'react';
import { CartContext } from '../CartContext';

const Product = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px', borderRadius: '8px' }}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart 🛒</button>
    </div>
  );
};

export default Product;