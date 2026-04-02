import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/firestore';
import { Package, Eye, Calendar, CreditCard } from 'lucide-react';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) return;

        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to view your orders.</p>
          <Link
            to="/login"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Link
            to="/"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="flex items-center space-x-2">
                        <Package className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'delivered'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{orderDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-4 h-4" />
                        <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                      </div>
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3">
                        <span className="text-sm text-gray-600">+{order.items.length - 4} more</span>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t pt-4">
                    <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                      Total: <span className="font-semibold text-lg text-gray-900">Rs {order.total.toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        View Details
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;