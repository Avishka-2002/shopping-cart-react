import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrderById } from '../services/firestore';
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          setError('Order ID is missing');
          return;
        }

        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Check if user owns this order
  if (order.userId !== user?.uid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this order.</p>
        </div>
      </div>
    );
  }

  const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days delivery

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'confirmed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Order Details
              </h3>
              <p className="text-sm text-gray-600">Order Date: {orderDate.toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Payment ID: {order.paymentIntentId}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                Delivery Information
              </h3>
              <p className="text-sm text-gray-600">Estimated Delivery: {estimatedDelivery.toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Standard Delivery (3-5 business days)</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Shipping Address
          </h3>
          <div className="text-sm text-gray-700">
            <p className="font-medium">{order.shippingInfo.name}</p>
            <p>{order.shippingInfo.address}</p>
            <p>{order.shippingInfo.city}, {order.shippingInfo.postalCode}</p>
            <p>{order.shippingInfo.phone}</p>
            <p>{order.shippingInfo.email}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs {(item.price * item.quantity).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Rs {item.price.toLocaleString()} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>Rs {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Fee:</span>
              <span>{order.deliveryFee === 0 ? 'Free' : `Rs ${order.deliveryFee.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>Rs {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 text-center"
          >
            View All Orders
          </Link>
          <Link
            to="/"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;