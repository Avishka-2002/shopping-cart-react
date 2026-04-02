import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_STRIPE_KEY');

// Stripe service functions
export const stripeService = {
  // Create payment intent on the backend
  createPaymentIntent: async (amount, currency = 'lkr') => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Confirm payment with Stripe
  confirmPayment: async (clientSecret, paymentMethod) => {
    try {
      const stripe = await stripePromise;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  },

  // Get Stripe instance
  getStripe: () => stripePromise,
};

// For development/testing purposes, you can use this mock implementation
export const mockStripeService = {
  createPaymentIntent: async (amount, currency = 'lkr') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      clientSecret: 'pi_mock_' + Date.now(),
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
    };
  },

  confirmPayment: async (clientSecret, paymentMethod) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random success/failure for testing
    if (Math.random() > 0.1) { // 90% success rate
      return {
        id: 'pi_' + Date.now(),
        status: 'succeeded',
        amount: 1000,
        currency: 'lkr',
      };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  },

  getStripe: () => stripePromise,
};

// Use mock service in development, real service in production
export const paymentService = process.env.NODE_ENV === 'production'
  ? stripeService
  : mockStripeService;