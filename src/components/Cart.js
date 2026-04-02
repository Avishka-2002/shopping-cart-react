import React, { useContext } from 'react';
import { CartContext } from '../CartContext';

const Cart = () => {
  const { cart, removeFromCart, totalPrice } = useContext(CartContext);

  return (
    <div style={{ borderLeft: '2px solid #000', padding: '20px' }}>
      <h2>Your Cart 🛍️</h2>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        cart.map(item => (
          <div key={item.id}>
            <h4>{item.name} (x{item.quantity})</h4>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      )}
      <hr />
      <h3>Total: ${totalPrice}</h3>
    </div>
  );
};

export default Cart;