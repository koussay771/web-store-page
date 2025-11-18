// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allProducts } from './StorePage'; // <--- ASSUMING allProducts is exported from StorePage.jsx
import { useCart } from '../context/CartContext'; // <--- ADD THIS IMPORT

const ProductDetailPage = () => {
  const { id } = useParams(); // Get product ID from URL parameters
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Get addToCart function from cart context

  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Find the product based on the ID from allProducts.
    // Ensure ID comparison is type-safe (parse id as number from URL params).
    const foundProduct = allProducts.find(p => p.id === parseInt(id));

    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // If product not found (e.g., bad URL), redirect to the store page
      console.warn(`Product with ID ${id} not found. Redirecting to store.`);
      navigate('/store'); // Or to a 404 page if you create one
    }
  }, [id, navigate]); // Re-run effect if ID or navigate function changes

  // Show a loading state or "Product not found" while product data is being fetched/set
  if (!product) {
    return <div className="flex justify-center items-center h-full text-white text-xl min-h-screen pt-20">Loading product details...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-8 bg-zinc-900 text-white min-h-screen pt-20">
      <div className="lg:w-1/2 flex justify-center items-center p-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
          />
        ) : (
          <div className="bg-blue-600 w-full h-[400px] flex items-center justify-center text-white text-3xl rounded-lg shadow-md">
            {product.name || "Product Image"}
          </div>
        )}
      </div>

      <div className="lg:w-1/2 p-4 lg:pl-10 text-center lg:text-left">
        <h1 className="text-5xl font-extrabold mb-4 text-blue-400">{product.name}</h1>
        <p className="text-xl text-zinc-300 mb-6">{product.description}</p>

        <div className="flex items-baseline justify-center lg:justify-start space-x-6 mb-8">
          {product.oldPrice && (
            <p className="text-zinc-400 line-through text-2xl">
              ${product.oldPrice.toFixed(2)}
            </p>
          )}
          <p className="text-6xl font-extrabold text-white">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center mx-auto lg:mx-0 space-x-4 mt-6
                     px-8 py-3 rounded-full text-white text-xl font-medium
                     bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => {
            addToCart(product); // <--- CALL addToCart HERE WITH THE FOUND PRODUCT
            console.log(`Added ${product.name} to cart from Product Detail Page!`);
          }}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.767.707 1.767H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span>ADD TO CART</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;