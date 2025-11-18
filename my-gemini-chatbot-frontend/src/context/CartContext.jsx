// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast'; // Assuming you have react-hot-toast installed

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or an empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('cartItems');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // If item exists, update its quantity
        const updatedItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        toast.success(`Increased quantity of ${product.name} in cart!`);
        return updatedItems;
      } else {
        // If item doesn't exist, add it with quantity 1
        toast.success(`${product.name} added to cart!`);
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // --- NEW/UPDATED FUNCTIONS ---
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.error(`${itemToRemove.name} removed from cart.`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        // If new quantity is 0 or less, remove the item
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
    // No toast here as it's called frequently by +/- buttons.
    // The visual update is usually enough feedback.
  };

  const clearCart = () => {
    setCartItems([]);
    toast('Cart cleared!', { icon: '🗑️' });
  };

  // Calculate total items for cart icon display
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price of all items in cart
  const cartTotalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  // --- END NEW/UPDATED FUNCTIONS ---

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, // Expose clearCart
        totalItemsInCart, // Expose totalItemsInCart
        cartTotalPrice, // Expose cartTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};