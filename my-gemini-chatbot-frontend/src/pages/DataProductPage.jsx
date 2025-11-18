// src/pages/DataProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Import your Firestore instance
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions for single document
import { useCart } from '../context/CartContext'; // Import useCart context

const DataProductPage = () => { // Renamed component from ProductDetailPage
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // For navigating back
  const { addToCart } = useCart(); // Access addToCart from context

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const productRef = doc(db, 'products', id); // Reference to the specific document
        const productSnap = await getDoc(productRef); // Fetch the document

        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        } else {
          setError("Product not found.");
          console.log("No such product document!");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Only fetch if an ID is present in the URL
      fetchProduct();
    }
  }, [id]); // Re-run effect if the ID in the URL changes

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center pt-20">
        <p className="text-xl text-blue-400">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center pt-20">
        <p className="text-xl text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate('/store')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
        >
          Back to Store
        </button>
      </div>
    );
  }

  if (!product) {
    // This case should ideally be caught by 'error' if ID doesn't exist
    // but as a fallback, if product is null and not loading/error,
    // it means something went wrong or the product simply doesn't exist.
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center pt-20">
        <p className="text-xl text-zinc-400 mb-4">Product details unavailable.</p>
        <button
          onClick={() => navigate('/store')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
        >
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8 pt-20 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-zinc-800 rounded-lg shadow-lg overflow-hidden md:flex">
        <div className="md:w-1/2 flex items-center justify-center p-6 bg-zinc-700">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-96 w-auto object-contain rounded-lg"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-400 mb-4">{product.name}</h1>
            <p className="text-zinc-300 text-lg mb-6">{product.description}</p>
            <div className="flex items-baseline mb-6">
              {product.oldPrice && (
                <span className="text-zinc-400 line-through text-lg mr-3">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
              <span className="text-5xl font-extrabold text-white">${product.price.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-auto"> {/* Pushes button to the bottom */}
            <button
              onClick={() => {
                addToCart(product);
                console.log(`Added ${product.name} to cart from Product Detail Page!`);
                // Optionally navigate to cart or show a confirmation
                // navigate('/cart');
              }}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-bold text-xl hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
            >
              Add to Cart
            </button>
            <button
              onClick={() => navigate(-1)} // Go back to the previous page
              className="w-full mt-4 bg-zinc-700 text-zinc-300 py-3 px-6 rounded-full font-bold text-xl hover:bg-zinc-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataProductPage; // Export with the new name