// src/components/Navbar.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  const { cart } = useContext(CartContext);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="flex justify-between items-center bg-green-600 p-4 text-white shadow-md sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold tracking-tight">FreshShop 🍎</Link>
      
      <div className="flex items-center gap-6">
        <Link to="/cart" className="relative cursor-pointer hover:scale-110 transition-transform">
          <ShoppingCart size={28} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold animate-bounce">
              {itemCount}
            </span>
          )}
        </Link>
        
        {user && (
          <button onClick={logout} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-3 py-1.5 rounded-lg transition-colors">
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;