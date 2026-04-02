import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Settings, Package } from 'lucide-react';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-green-600 p-4 text-white sticky top-0 z-50 shadow-lg">
      <Link to="/" className="text-2xl font-bold">FreshShop 🍎</Link>

      <div className="flex items-center gap-4">
        {/* Cart Link */}
        <Link to="/cart" className="relative flex items-center gap-2 hover:bg-green-700 px-3 py-2 rounded">
          <ShoppingCart size={28} />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 rounded-full px-2 text-xs font-bold">
              {count}
            </span>
          )}
        </Link>

        {/* Orders Link */}
        <Link to="/orders" className="flex items-center gap-2 hover:bg-green-700 px-3 py-2 rounded">
          <Package size={20} />
          <span className="hidden sm:block">Orders</span>
        </Link>

        {/* User Authentication Section */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User size={20} />
              <span className="text-sm hidden sm:block">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              {isAdmin && (
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
                  ADMIN
                </span>
              )}
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 hover:bg-green-700 px-3 py-2 rounded"
                title="Admin Panel"
              >
                <Settings size={18} />
                <span className="hidden sm:block">Admin</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 hover:bg-green-700 px-3 py-2 rounded"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded font-medium hover:bg-gray-100"
          >
            <User size={18} />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;