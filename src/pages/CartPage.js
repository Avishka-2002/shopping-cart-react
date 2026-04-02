import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react'; // Icons for UX

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);

  if (cart.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Your cart is empty! 🛒</h2></div>;
  }

  return (
    <div style={containerStyle}>
      <h1>Your Shopping Cart 🛍️</h1>
      <table style={tableStyle}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} style={rowStyle}>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <button onClick={() => updateQuantity(item.id, -1)} style={iconBtn}><Minus size={16} /></button>
                <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} style={iconBtn}><Plus size={16} /></button>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => removeFromCart(item.id)} style={deleteBtn}>
                  <Trash2 size={18} color="red" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={summaryStyle}>
        <h3>Total Amount: <span style={{ color: '#27ae60' }}>${totalPrice.toFixed(2)}</span></h3>
        <button style={checkoutBtn}>Proceed to Checkout 💳</button>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { padding: '2rem', maxWidth: '800px', margin: 'auto' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const rowStyle = { borderBottom: '1px solid #eee', textAlign: 'left', height: '60px' };
const iconBtn = { cursor: 'pointer', border: '1px solid #ccc', background: 'white', borderRadius: '4px' };
const deleteBtn = { background: 'none', border: 'none', cursor: 'pointer' };
const summaryStyle = { marginTop: '30px', textAlign: 'right', borderTop: '2px solid #333', paddingTop: '20px' };
const checkoutBtn = { background: '#2ecc71', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default CartPage;