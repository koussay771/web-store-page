// src/pages/StorePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // Removed useNavigate as it's not directly used for filtering logic here
import { useCart } from '../context/CartContext';
import { db } from '../firebase'; // Import your Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions

// --- IMPORTANT: Remove the local 'export const allProducts = [...];' array.
// We will now fetch this data from Firestore! ---


const StorePage = ({ searchTerm }) => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  const [activeCategoryFilterButton, setActiveCategoryFilterButton] = useState('All');
  const [sortOption, setSortOption] = useState('none');

  // We will derive available categories once products are fetched
  const [categoriesForButtons, setCategoriesForButtons] = useState(['All']);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [error, setError] = useState(null); // New error state

  // Internal state to store ALL fetched products
  const [fetchedAllProducts, setFetchedAllProducts] = useState([]);


  // Effect to fetch products from Firestore on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsCollectionRef = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollectionRef);
        const productsList = productSnapshot.docs.map(doc => ({
          id: doc.id, // Firestore document ID
          ...doc.data()
        }));
        setFetchedAllProducts(productsList);

        // Update categories for filter buttons once products are fetched
        const uniqueCategories = ['All', ...new Set(productsList.map(p => p.category))];
        setCategoriesForButtons(uniqueCategories);

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array: run only once on mount


  // Effect to react to URL parameter changes AND internal filter/sort changes
  useEffect(() => {
    // Do not try to filter/sort if products haven't been fetched yet or there's an error
    if (loading || error) return; // Wait until products are fetched or an error occurs

    const urlMainCategory = searchParams.get('category');
    const urlSubCategory = searchParams.get('subcategory');

    // console.log('StorePage: URL Main Category:', urlMainCategory); // You can uncomment for debugging
    // console.log('StorePage: URL Sub Category:', urlSubCategory);
    // console.log('StorePage: Internal activeCategoryFilterButton (before update):', activeCategoryFilterButton);
    // console.log('StorePage: Internal searchTerm:', searchTerm);


    // --- 1. Determine which category filter button should be active based on URL ---
    let newActiveButtonCategory = 'All'; // Default

    if (urlMainCategory) {
      if (urlSubCategory) {
        // Find a product to match the display category button
        const productToMatchButton = fetchedAllProducts.find(p =>
          p.mainCategory === urlMainCategory && p.subCategory === urlSubCategory
        );
        if (productToMatchButton) {
          newActiveButtonCategory = productToMatchButton.category;
        }
      } else {
        // Handle top-level categories from sidebar that don't have subcategories
        const productToMatchButton = fetchedAllProducts.find(p =>
            p.mainCategory === urlMainCategory && (p.subCategory === null || p.subCategory === undefined)
        );
        if (productToMatchButton) {
            newActiveButtonCategory = productToMatchButton.category;
        } else {
            // As a fallback, try to find any product under that mainCategory if a direct match isn't found
            const anyProductInMainCategory = fetchedAllProducts.find(p => p.mainCategory === urlMainCategory);
            if (anyProductInMainCategory) {
                // If a product exists in the main category but has no specific subCategory
                // and no product.category matches it directly, stay "All" or similar.
                // For simplicity, we'll try to use the mainCategory as a fallback for the button display if no better category is found.
                // This logic might need slight refinement based on your exact category naming in Firestore.
                newActiveButtonCategory = urlMainCategory.charAt(0).toUpperCase() + urlMainCategory.slice(1).replace(/-/g, ' '); // Capitalize and replace hyphens
            }
        }
      }
    }

    if (newActiveButtonCategory !== activeCategoryFilterButton) {
      setActiveCategoryFilterButton(newActiveButtonCategory);
      // console.log('StorePage: Updated activeCategoryFilterButton to:', newActiveButtonCategory); // For debugging
    }


    // --- 2. Apply Filtering (using fetchedAllProducts) ---
    const filtered = fetchedAllProducts.filter(product => {
      const matchesSearch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      let matchesCategoryFromUrl = true;
      if (urlMainCategory) {
        matchesCategoryFromUrl = product.mainCategory === urlMainCategory;
        if (urlSubCategory) {
          matchesCategoryFromUrl = matchesCategoryFromUrl && product.subCategory === urlSubCategory;
        }
      }

      return matchesSearch && matchesCategoryFromUrl;
    });

    // 3. Apply Sorting:
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'price-asc') {
        return a.price - b.price;
      } else if (sortOption === 'price-desc') {
        return b.price - a.price;
      } else if (sortOption === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    setDisplayedProducts(sorted);

  }, [searchParams, searchTerm, sortOption, fetchedAllProducts, loading, error]);


  // Function to generate the URL for category filter buttons
  const getCategoryLink = (categoryDisplayName) => {
    if (categoryDisplayName === 'All') {
      return '/store';
    }

    const matchingProduct = fetchedAllProducts.find(p => p.category === categoryDisplayName);

    if (matchingProduct) {
      if (matchingProduct.subCategory) {
        return `/store?category=${matchingProduct.mainCategory}&subcategory=${matchingProduct.subCategory}`;
      } else {
        return `/store?category=${matchingProduct.mainCategory}`;
      }
    }
    // Fallback if no matching product (shouldn't happen if categoriesForButtons is correct)
    return '/store';
  };


  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8 pt-20">
      <h1 className="text-5xl font-extrabold text-blue-400 mb-10 text-center">Our Products</h1>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4 max-w-6xl mx-auto gap-4">
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {categoriesForButtons.map(category => (
            <Link
              key={category}
              to={getCategoryLink(category)}
              className={`px-5 py-2 rounded-full text-lg font-medium transition-colors duration-200
                          ${activeCategoryFilterButton === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                          }`}
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none bg-zinc-700 border border-zinc-600 text-white py-2 px-4 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="none">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
          {/* Dropdown arrow icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading / Error / No Products Messages */}
      {loading && <p className="text-center text-xl text-blue-400 mt-10">Loading products...</p>}
      {error && <p className="text-center text-xl text-red-400 mt-10">Error: {error}</p>}
      {!loading && !error && displayedProducts.length === 0 && (
        <p className="text-center text-xl text-zinc-400 mt-10">No products found matching your criteria.</p>
      )}

      {/* Product Grid */}
      {!loading && !error && displayedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {displayedProducts.map(product => (
            <div
              key={product.id}
              className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden flex flex-col hover:scale-105 transition-transform duration-300"
            >
              <Link to={`/product/${product.id}`} className="block relative h-48 bg-zinc-700 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </Link>
              <div className="p-4 flex-1 flex flex-col">
                <Link to={`/product/${product.id}`} className="text-xl font-bold text-blue-400 hover:underline mb-2">
                  {product.name}
                </Link>
                <p className="text-zinc-300 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-baseline mt-auto mb-3">
                  {product.oldPrice && (
                    <span className="text-zinc-400 line-through mr-2">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-2xl font-extrabold">${product.price.toFixed(2)}</span>
                </div>

                {/* Add to Cart Button for each product */}
                <button
                  onClick={() => {
                    addToCart(product);
                    console.log(`Added ${product.name} to cart from Store Page!`);
                  }}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StorePage;