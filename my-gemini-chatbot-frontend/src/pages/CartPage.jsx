// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import react-hot-toast

const CartPage = () => {
  // Get cart state and functions from the CartContext
  const { cartItems, removeFromCart, updateQuantity, cartTotalPrice, totalItemsInCart, clearCart } = useCart(); // Destructure totalItemsInCart and clearCart

  // No longer need separate handleQuantityChange and handleRemoveItem if we call directly
  // But let's keep simplified ones for clarity and potential future logic
  const handleUpdateQuantity = (productId, change) => {
    const item = cartItems.find(i => i.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + change);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    // TODO: Implement actual checkout logic later (e.g., Stripe, PayPal, order placement)
    toast.success("Proceeding to checkout (functionality not yet fully built)!");
    console.log("Checkout initiated with total:", cartTotalPrice.toFixed(2));
    // Optionally clear the cart after "checkout" for demo purposes
    // clearCart();
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8 pt-20">
      <h1 className="text-5xl font-extrabold text-blue-400 mb-10 text-center">Your Shopping Cart</h1>

      {totalItemsInCart === 0 ? ( // Use totalItemsInCart for empty check
        // Display message if cart is empty
        <div className="text-center py-20">
          <p className="text-2xl text-zinc-400 mb-6">Your cart is empty. Time to find some awesome gear!</p>
          <Link
            to="/store"
            className="bg-blue-600 text-white py-3 px-8 rounded-full text-xl font-medium
                         hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 inline-block"
          >
            Go to Store
          </Link>
        </div>
      ) : (
        // Display cart items if cart is not empty
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Cart Items List */}
          <div className="flex-1 bg-zinc-800 p-6 rounded-lg shadow-xl">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-6 py-4 border-b border-zinc-700 last:border-b-0"
              >
                {/* Product Image */}
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-md border border-zinc-700"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1">
                  <Link to={`/product/${item.id}`} className="text-2xl font-semibold hover:text-blue-400 transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-zinc-400 text-md">{item.description ? item.description.substring(0, 70) + '...' : ''}</p>
                  <p className="text-xl font-bold mt-2">${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="bg-zinc-700 text-white w-8 h-8 rounded-full flex items-center justify-center
                               hover:bg-zinc-600 transition-colors duration-200 text-xl font-bold"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    -
                  </button>
                  <span className="text-xl font-medium w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="bg-zinc-700 text-white w-8 h-8 rounded-full flex items-center justify-center
                               hover:bg-zinc-600 transition-colors duration-200 text-xl font-bold"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>

                {/* Item Total Price */}
                <div className="text-xl font-bold w-24 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-full"
                  aria-label={`Remove ${item.name}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3 bg-zinc-800 p-6 rounded-lg shadow-xl self-start sticky top-20">
            <h2 className="text-3xl font-bold mb-6 border-b border-zinc-700 pb-4">Order Summary</h2>
            <div className="flex justify-between items-center text-xl font-medium mb-4">
              <span>Subtotal ({totalItemsInCart} items):</span> {/* Use totalItemsInCart here */}
              <span>${cartTotalPrice.toFixed(2)}</span>
            </div>
            {/* You can add shipping, tax, etc. here later */}
            <div className="flex justify-between items-center text-3xl font-extrabold text-blue-400 mt-6 pt-4 border-t border-zinc-700">
              <span>Total:</span>
              <span>${cartTotalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout} // Use the new handleCheckout
              className="w-full bg-blue-600 text-white py-4 mt-8 rounded-full text-xl font-bold
                         hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart} // Add Clear Cart button
              className="w-full bg-zinc-700 text-white py-4 mt-4 rounded-full text-xl font-bold
                         hover:bg-zinc-600 transition-colors duration-200 transform hover:scale-105"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;