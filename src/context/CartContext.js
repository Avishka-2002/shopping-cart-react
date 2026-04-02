import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.uid}`);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    } else {
      setCart([]);
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && cart.length > 0) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart));
    } else if (user) {
      localStorage.removeItem(`cart_${user.uid}`);
    }
  }, [cart, user]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.uid}`);
    }
  };

  const getTotalPrice = useCallback(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    setTotalPrice(getTotalPrice());
  }, [getTotalPrice]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalPrice,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};