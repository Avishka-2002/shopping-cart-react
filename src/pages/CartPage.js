import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);

  if (cart.length === 0) return <div className="p-10 text-center text-xl">Empty cart! 🛍️</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.map(item => (
        <div key={item.id} className="flex items-center gap-4 border-b py-4">
          <img src={item.image} className="w-16 h-16 rounded object-cover" alt="" />
          <div className="flex-grow">
            <h3 className="font-bold">{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => updateQuantity(item.id, -1)} className="border p-1 rounded"><Minus size={14}/></button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, 1)} className="border p-1 rounded"><Plus size={14}/></button>
          </div>
          <button onClick={() => removeFromCart(item.id)} className="text-red-500"><Trash2 size={20}/></button>
        </div>
      ))}
      <div className="mt-6 text-right font-bold text-2xl">Total: ${totalPrice.toFixed(2)}</div>
    </div>
  );
};
export default CartPage;