"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load from local storage for guest
      const localCart = localStorage.getItem('guest_cart');
      if (localCart) {
        setItems(JSON.parse(localCart));
      }
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data.data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        await api.post('/cart/add', { productId: product._id, quantity });
        await fetchCart();
      } catch (error) {
        throw error;
      }
    } else {
      // Guest cart logic
      const updatedItems = [...items];
      const existingItemIndex = updatedItems.findIndex(i => i.product._id === product._id);
      if (existingItemIndex > -1) {
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        updatedItems.push({ product, quantity });
      }
      setItems(updatedItems);
      localStorage.setItem('guest_cart', JSON.stringify(updatedItems));
    }
  };

  const updateQuantity = async (item, quantity) => {
    if (isAuthenticated) {
      try {
        await api.put('/cart/update', { cartItemId: item._id, quantity });
        await fetchCart();
      } catch (error) {
        console.error('Failed to update quantity on backend', error);
      }
    } else {
      const updatedItems = items.map(i => 
        i.product._id === item.product._id ? { ...i, quantity } : i
      );
      setItems(updatedItems);
      localStorage.setItem('guest_cart', JSON.stringify(updatedItems));
    }
  };

  const removeFromCart = async (itemId, productId) => {
    if (isAuthenticated) {
      await api.delete(`/cart/remove/${itemId}`);
      await fetchCart();
    } else {
      const updatedItems = items.filter(item => item.product._id !== productId);
      setItems(updatedItems);
      localStorage.setItem('guest_cart', JSON.stringify(updatedItems));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart/clear');
      } catch (error) {
        console.error('Failed to clear cart on backend', error);
      }
      setItems([]);
    } else {
      setItems([]);
      localStorage.removeItem('guest_cart');
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, isLoading, itemCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
