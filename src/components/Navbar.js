import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react'; // Cool icon library

const Navbar = () => {
  const { cart } = useContext(CartContext);
  
  // Calculate total items (e.g., 2 cakes + 1 carrot = 3 items)
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav style={navStyle}>
      <h2>FreshShop 🍎</h2>
      <div style={cartIconStyle}>
        <ShoppingCart size={24} />
        <span style={badgeStyle}>{itemCount}</span>
      </div>
    </nav>
  );
};

// Simple Inline Styles (We can move to CSS later)
const navStyle = {
  display: 'flex', 
  justifyContent: 'space-between', 
  padding: '1rem 2rem', 
  background: '#2ecc71', 
  color: 'white',
  alignItems: 'center'
};

const cartIconStyle = { position: 'relative', cursor: 'pointer' };

const badgeStyle = {
  position: 'absolute',
  top: '-10px',
  right: '-10px',
  background: 'red',
  borderRadius: '50%',
  padding: '2px 6px',
  fontSize: '12px'
};

export default Navbar;