import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useContext(CartContext);
  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice > 5000 ? 0 : 300; // Free delivery over Rs 5000
  const finalTotal = totalPrice + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-600 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Add some fresh products to your cart!</p>
          <Link
            to="/"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 inline-flex items-center"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    className="w-20 h-20 rounded-lg object-cover"
                    alt={item.name}
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <p className="font-bold text-green-600">Rs {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="font-semibold">Rs {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items):</span>
                  <span>Rs {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-xs text-green-600">Free delivery on orders over Rs 5,000</p>
                )}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>Rs {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 text-center block mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 text-center block"
              >
                Continue Shopping
              </Link>

              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Secure checkout powered by Stripe</p>
                <p>Free returns within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;