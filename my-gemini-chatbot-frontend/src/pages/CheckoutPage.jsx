// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // For notifications

const CheckoutPage = () => {
  const { cartItems, cartTotalPrice, totalItemsInCart, clearCart } = useCart();
  const navigate = useNavigate();

  // State to hold shipping information
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Redirect to cart if it's empty
  useEffect(() => {
    if (totalItemsInCart === 0) {
      toast.error("Your cart is empty! Add items before checking out.");
      navigate('/cart');
    }
  }, [totalItemsInCart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (totalItemsInCart === 0) {
      toast.error("Cannot place order: Your cart is empty.");
      navigate('/store');
      return;
    }

    // Basic validation
    const { fullName, address, city, postalCode, country } = shippingInfo;
    if (!fullName || !address || !city || !postalCode || !country) {
      toast.error("Please fill in all shipping information fields.");
      return;
    }

    // --- Simulate Order Placement ---
    console.log("--- Order Details ---");
    console.log("Shipping Info:", shippingInfo);
    console.log("Items:", cartItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })));
    console.log("Total Price:", cartTotalPrice.toFixed(2));
    console.log("---------------------");

    // Clear the cart after "successful" order placement
    clearCart();
    toast.success("Order placed successfully! (Simulated)");

    // Navigate to a confirmation page or home page
    navigate('/'); // Or navigate to a dedicated /order-confirmation page later
  };

  if (totalItemsInCart === 0) {
    // Render nothing or a loading state while redirecting
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8 pt-20">
      <h1 className="text-5xl font-extrabold text-blue-400 mb-10 text-center">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary Section */}
        <div className="bg-zinc-800 p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-6 border-b border-zinc-700 pb-4 text-blue-300">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-zinc-700 last:border-b-0">
              <div className="flex items-center">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded mr-4" />
                <span className="text-lg">{item.name} ({item.quantity})</span>
              </div>
              <span className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-6 pt-4 border-t border-zinc-700">
            <div className="flex justify-between items-center text-xl font-medium mb-2">
              <span>Subtotal:</span>
              <span>${cartTotalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-medium mb-2">
              <span>Shipping:</span>
              <span>$0.00</span> {/* Placeholder for now */}
            </div>
            <div className="flex justify-between items-center text-xl font-medium mb-4">
              <span>Tax:</span>
              <span>$0.00</span> {/* Placeholder for now */}
            </div>
            <div className="flex justify-between items-center text-4xl font-extrabold text-blue-400">
              <span>Total:</span>
              <span>${cartTotalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information Section */}
        <div className="bg-zinc-800 p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-6 border-b border-zinc-700 pb-4 text-blue-300">Shipping Information</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-zinc-300 text-sm font-bold mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-zinc-300 text-sm font-bold mb-2">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-zinc-300 text-sm font-bold mb-2">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-zinc-300 text-sm font-bold mb-2">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="block text-zinc-300 text-sm font-bold mb-2">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={shippingInfo.country}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 mt-8 rounded-full text-xl font-bold
                       hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
          >
            Place Order (Simulated)
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;