import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/firestore';
import { paymentService } from '../services/stripe';
import CheckoutForm from '../components/CheckoutForm';
import toast from 'react-hot-toast';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_STRIPE_KEY');

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const totalAmount = getTotalPrice();
  const deliveryFee = totalAmount > 5000 ? 0 : 300; // Free delivery over Rs 5000
  const finalTotal = totalAmount + deliveryFee;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      navigate('/');
      return;
    }

    // Pre-fill shipping info with user data
    setShippingInfo(prev => ({
      ...prev,
      name: user.displayName || '',
      email: user.email || ''
    }));
  }, [user, cart, navigate]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      setLoading(true);

      // Create order in Firestore
      const orderData = {
        userId: user.uid,
        items: cart,
        shippingInfo,
        paymentIntentId: paymentIntent.id,
        subtotal: totalAmount,
        deliveryFee,
        total: finalTotal,
        status: 'confirmed',
        createdAt: new Date()
      };

      const orderId = await createOrder(orderData);

      // Clear cart
      clearCart();

      // Show success message
      toast.success('Order placed successfully!');

      // Redirect to order confirmation
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    toast.error(error.message || 'Payment failed. Please try again.');
  };

  if (!user || cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rs {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>Rs {finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Street address, apartment, suite, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>

              {clientSecret ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    loading={loading}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const result = await paymentService.createPaymentIntent(finalTotal);
                        setClientSecret(result.clientSecret);
                      } catch (error) {
                        toast.error('Failed to initialize payment. Please try again.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || !shippingInfo.name || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Initializing Payment...' : 'Proceed to Payment'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;