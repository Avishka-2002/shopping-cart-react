import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement
} from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret, onSuccess, onError, loading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message);
        onError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!');
        onSuccess(paymentIntent);
      } else {
        setMessage('Payment processing...');
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentElementOptions = {
    layout: 'tabs'
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={paymentElementOptions}
        className="min-h-[400px]"
      />

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('succeeded')
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing || loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay Rs ${(clientSecret ? JSON.parse(atob(clientSecret.split('.')[1])).amount / 100 : 0).toLocaleString()}`
        )}
      </button>

      <div className="text-xs text-gray-500 text-center">
        <p>Your payment information is secure and encrypted.</p>
        <p>We accept Visa, MasterCard, American Express, and more.</p>
      </div>
    </form>
  );
};

export default CheckoutForm;