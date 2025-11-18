// src/ProductSidebar.jsx
import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';

const ProductSidebar = ({ isExpanded, setIsExpanded }) => {
  // State to manage which main category's sub-list is currently open
  const [activeCategory, setActiveCategory] = useState(null); // Will store the name of the active main category

  // Define your nested categories
  const categories = [
    {
      name: 'Informatique',
      // No 'path' here, as clicking it will open the sub-list
      subCategories: [
        { name: 'Mouse', path: '/store?category=informatique&subcategory=mouse' },
        { name: 'Keyboard', path: '/store?category=informatique&subcategory=keyboard' },
        { name: 'Headset', path: '/store?category=informatique&subcategory=headset' },
      ],
    },
    { name: 'Téléphonie & Tablette', path: '/store?category=telephonie-tablette' },
    { name: 'Stockage', path: '/store?category=stockage' },
    { name: 'Impression', path: '/store?category=impression' },
    { name: 'TV-Son-Photos', path: '/store?category=tv-son-photos' },
    { name: 'Electroménager', path: '/store?category=electromenager' },
    { name: 'Sécurité', path: '/store?category=securite' },
    { name: 'Bureautique', path: '/store?category=bureautique' },
    { name: 'Réseau & Connectiques', path: '/store?category=reseau-connectiques' },
  ];

  const handleCategoryClick = (categoryName) => {
    // If the clicked category is already active, close it. Otherwise, open it.
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-black text-white
                   transition-all duration-300 z-50  ${
                     isExpanded ? 'w-80' : 'w-16'
                   }`}
    >
      {/* Sidebar header - with conditional button placement */}
      <div className={`p-4 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        {/* Categories title - only visible when sidebar is expanded */}
        {isExpanded && (
          <h2 className="text-xl font-bold whitespace-nowrap">Categories</h2>
        )}
        {/* Toggle Button for Sidebar - color is white */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:text-white focus:outline-none"
          aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isExpanded ? (
            // Icon for when sidebar is expanded (arrow pointing left)
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          ) : (
            // Icon for when sidebar is collapsed (arrow pointing right)
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M6 5l7 7-7 7"></path>
            </svg>
          )}
        </button>
      </div>

      {/* "Products" text - visible only when sidebar is collapsed and rotated */}
      {!isExpanded && (
        <div
          className="absolute top-1/2 left-1/2
                     transform -translate-x-1/2 -translate-y-1/2 -rotate-90
                     origin-center text-white font-bold whitespace-nowrap
                     text-6xl leading-none"
        >
          Products
        </div>
      )}

      {/* Main content of sidebar - only visible when expanded */}
      {isExpanded && (
        <nav className="mt-4 px-2">
          <ul>
            {/* All Products link (optional, but useful) */}
            <li className="mb-2">
                <Link to="/store" className="block p-2 rounded hover:bg-zinc-700">All Products</Link>
            </li>
            {/* Render main categories */}
            {categories.map((category) => (
              <React.Fragment key={category.name}>
                <li className="mb-2">
                  {category.subCategories ? ( // If it has sub-categories, make it a clickable item to toggle sub-list
                    <button
                      onClick={() => handleCategoryClick(category.name)}
                      className="w-full text-left block: p-2 rounded hover:bg-zinc-700 flex justify-between items-center"
                    >
                      <span>{category.name}</span>
                      {/* Arrow icon for expand/collapse */}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeCategory === category.name ? 'rotate-90' : ''
                        }`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  ) : ( // Otherwise, it's a regular link
                    <Link to={category.path} className="block p-2 rounded hover:bg-zinc-700">
                      {category.name}
                    </Link>
                  )}
                </li>
                {/* Render sub-categories if this is the active category */}
                {activeCategory === category.name && category.subCategories && (
                  <ul className="ml-4"> {/* Indent sub-categories */}
                    {category.subCategories.map((subCategory) => (
                      <li key={subCategory.name} className="mb-1">
                        <Link to={subCategory.path} className="block p-2 rounded hover:bg-zinc-700 text-sm">
                          {subCategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ProductSidebar;