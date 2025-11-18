// src/Navbar.jsx
import React, { useState, useEffect, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import toast from 'react-hot-toast'; // <--- Only added this import if not already there, for logout toast

// Accept currentSearchTerm, onSearchChange, and isVisible props
// Use forwardRef to allow parent component (App.jsx) to attach a ref
const Navbar = forwardRef(({ currentSearchTerm, onSearchChange, isVisible }, ref) => {
  // --- ONLY CHANGE: Use totalItemsInCart from useCart() ---
  const { totalItemsInCart } = useCart();
  // --- END ONLY CHANGE ---

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { // Made async to await logout for toast
    await logout();
    navigate('/');
    toast.success('Logged out successfully!'); // <--- Added this toast for user feedback on logout
  };

  return (
    // Apply visibility class directly to the nav element
    // Keep all existing classes and append the visibility ones
    <nav
      ref={ref} // Attach the forwarded ref to the nav element
      className={`
        w-full text-white p-4 flex items-center justify-between z-30 bg-zinc-900
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'}
      `}
      style={{
        // Ensure it always stays at the top of its parent flex container
        // and doesn't affect the layout of siblings when hidden
        position: 'sticky', // Use sticky so it stays at the top of its flow context
        top: 0,
        // Since it's sticky, its parent div's flex-col layout handles its position.
        // We only need to adjust its transform.
      }}
    >

      {/* Left Section: Still empty - UNCHANGED FROM YOUR CODE */}
      <div className="flex items-center">
        {/* Hamburger Menu Icon was previously here, now removed */}
      </div>

      {/* Middle Section: Search Bar (Input Field with Icon) - UNCHANGED FROM YOUR CODE */}
      <div className="flex-grow flex justify-center px-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full py-2 pl-10 pr-4 rounded-full bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentSearchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400
                         transition transform: duration-200 hover:scale-125 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Right Section: Navigation Links, Cart Icon, and Login/Logout Button - UPDATED CART COUNT ONLY */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:text-blue-400 transition-colors duration-200 text-lg">Home</Link>
        <Link to="/store" className="hover:text-blue-400 transition-colors duration-200 text-lg">Store</Link>
        <Link to="/about-us" className="hover:text-blue-400 transition-colors duration-200 text-lg">About Us</Link>
        <Link to="/contact-us" className="hover:text-blue-400 transition-colors duration-200 text-lg">Contact Us</Link>

        <Link to="/cart" className="relative text-white hover:text-blue-400 focus:outline-none p-2 rounded-full
                                     transition transform duration-200 hover:scale-125"
              aria-label="Cart">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path>
          </svg>
          {/* --- ONLY CHANGE: Display totalItemsInCart --- */}
          {totalItemsInCart > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce-once">
              {totalItemsInCart}
            </span>
          )}
          {/* --- END ONLY CHANGE --- */}
        </Link>

        {user ? (
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium text-blue-300">
              Hello, {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-full text-lg font-medium
                               hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-blue-600 text-white py-2 px-4 rounded-full text-lg font-medium
                                       hover:bg-blue-700 transition-colors duration-200">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}); // End forwardRef here

export default Navbar;