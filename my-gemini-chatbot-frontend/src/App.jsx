// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ProductSidebar from './ProductSidebar';
import Chatbot from './Chatbot';

// --- Re-import ProductDisplay directly ---
import ProductDisplay from './components/ProductDisplay'; // Keep your ProductDisplay

// --- Import SetupDisplay directly ---
import SetupDisplay from './components/SetupDisplay';

// Import all your other page components
import StorePage from './pages/StorePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import WelcomeAnimation from './WelcomeAnimation';
import DataProductPage from './pages/DataProductPage'; // <-- UPDATED: Changed from ProductDetailPage
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage'; // <-- NEW IMPORT for CheckoutPage
// Import the CartProvider and AuthProvider
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Import Toaster from react-hot-toast
import { Toaster } from 'react-hot-toast';

// IMPORT YOUR PROTECTED ROUTE COMPONENT HERE
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);

  // --- Navbar Visibility State and Refs ---
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const contentScrollRef = useRef(null); // Ref for the scrollable content div
  const navbarRef = useRef(null); // Ref for the Navbar component itself to get its height

  const handleWelcomeAnimationComplete = () => {
    setShowWelcomeAnimation(false);
    navigate('/');
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    if (window.location.pathname !== '/store') {
      navigate('/store');
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // --- Scroll Logic for Navbar Hiding ---
  useEffect(() => {
    const handleScroll = () => {
      if (!contentScrollRef.current) return;

      const currentScrollY = contentScrollRef.current.scrollTop;
      const scrollThreshold = 50; // Pixels to scroll before hiding/showing

      // Scrolling down
      if (currentScrollY > lastScrollY.current && currentScrollY > scrollThreshold) {
        setIsNavbarVisible(false);
      }
      // Scrolling up (or near the top)
      else if (currentScrollY < lastScrollY.current || currentScrollY <= scrollThreshold) {
        setIsNavbarVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const scrollElement = contentScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [location.pathname]); // Re-attach listener if route changes (e.g., to reset scroll)

  // Get Navbar height and apply padding to content
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, [navbarRef.current?.offsetHeight]); // Recalculate if Navbar height changes

  return (
    <AuthProvider>
      <CartProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              backgroundColor: '#1a202c',
              color: '#60A5FA',
              fontSize: '0.9rem',
              padding: '8px 12px',
              borderRadius: '8px',
            },
            success: {
              iconTheme: { primary: '#60A5FA', secondary: '#1a202c' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#1a202c' },
            },
          }}
        />

        {showWelcomeAnimation && (
          <WelcomeAnimation onAnimationComplete={handleWelcomeAnimationComplete} />
        )}

        {!showWelcomeAnimation && (
          <div className="flex h-screen bg-zinc-900 text-white">
            <ProductSidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
            <div
              className={`flex-1 flex flex-col transition-all duration-300 ${
                isSidebarExpanded ? 'ml-80' : 'ml-16'
              }`}
            >
              <Navbar
                ref={navbarRef}
                currentSearchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                isVisible={isNavbarVisible}
              />
              <div
                ref={contentScrollRef}
                className={`flex-1 ${isAuthPage ? 'overflow-hidden' : 'overflow-y-auto'}`}
                style={{ paddingTop: `${navbarHeight}px` }}
              >
                <Routes>
                  {/* --- REVERTED HOME ROUTE: Render ProductDisplay and SetupDisplay directly --- */}
                  <Route
                    path="/"
                    element={
                      <div className="flex flex-col items-center p-4">
                        <ProductDisplay /> {/* Your original ProductDisplay */}
                        <div className="w-full h-12"></div> {/* Spacer */}
                        <SetupDisplay /> {/* The new SetupDisplay */}
                      </div>
                    }
                  />

                  <Route path="/store" element={<StorePage searchTerm={searchTerm} />} />
                  <Route path="/about-us" element={<AboutUsPage />} />
                  <Route path="/contact-us" element={<ContactUsPage />} />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/product/:id" element={<DataProductPage />} /> {/* <-- UPDATED: Uses DataProductPage */}
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </div>
            </div>
            <Chatbot />
          </div>
        )}
      </CartProvider>
    </AuthProvider>
  );
  
  
}

export default App;