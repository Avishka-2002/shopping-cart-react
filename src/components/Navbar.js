import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="flex justify-between items-center bg-green-600 p-4 text-white sticky top-0 z-50 shadow-lg">
      <Link to="/" className="text-2xl font-bold">FreshShop 🍎</Link>
      <Link to="/cart" className="relative flex items-center gap-2">
        <ShoppingCart size={28} />
        {count > 0 && <span className="absolute -top-2 -right-2 bg-red-500 rounded-full px-2 text-xs font-bold">{count}</span>}
      </Link>
    </nav>
  );
};
export default Navbar;