import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div style={cardStyle}>
      <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</span>
        <button onClick={() => addToCart(product)} style={buttonStyle}>
          Add to Cart 🛒
        </button>
      </div>
    </div>
  );
};

const cardStyle = {
  border: '1px solid #ddd',
  padding: '15px',
  width: '250px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const buttonStyle = {
  background: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default ProductCard;