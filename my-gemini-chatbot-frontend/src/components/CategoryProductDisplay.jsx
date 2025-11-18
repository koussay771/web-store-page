// src/components/CategoryProductDisplay.jsx
import React from 'react';

const CategoryProductDisplay = ({ products, subCategoryName }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">No Products Found</h2>
        <p className="text-xl text-zinc-300">
          No products available for "{subCategoryName.charAt(0).toUpperCase() + subCategoryName.slice(1)}" at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">
        {subCategoryName.charAt(0).toUpperCase() + subCategoryName.slice(1)} Products
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Layout for product presentation */}
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-zinc-800 rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row items-center p-6 space-y-4 md:space-y-0 md:space-x-6"
          >
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full h-auto max-h-80 object-contain rounded-lg"
              />
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-3 text-white">{product.name}</h2>
              <p className="text-zinc-300 text-lg mb-4">{product.description}</p>
              <div className="flex flex-col items-center md:items-start justify-center md:justify-start">
                <span className="text-4xl font-extrabold text-blue-400 mb-4">${product.price.toFixed(2)}</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProductDisplay;