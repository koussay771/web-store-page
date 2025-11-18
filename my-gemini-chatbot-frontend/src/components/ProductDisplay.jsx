// src/components/ProductDisplay.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // <--- ADD THIS IMPORT

// --- IMPORTS FOR YOUR IMAGES ---
import MouseImage from '../assets/Mouse.png';
import KeyboardImage from '../assets/Keyboard.png';
import HeadsetImage from '../assets/Headset.png';
// --------------------------------

const ProductDisplay = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // <--- ADD THIS LINE TO GET addToCart FUNCTION

  const [dragArrowDirection, setDragArrowDirection] = useState(null);

  const products = [
    {
      id: 101,
      name: "Logitech Superlight Pro",
      price: 100.00,
      oldPrice: 150.00,
      image: MouseImage,
      category: "Gaming Mouse",
      description: 'Experience lightning-fast responsiveness and an incredibly lightweight design for competitive gaming.'
    },
    {
      id: 201,
      name: "Logitech G Mechanical Keyboard",
      price: 225.00,
      oldPrice: 280.00,
      image: KeyboardImage,
      category: "Keyboard",
      description: 'Enjoy satisfying tactile feedback and durable mechanical switches, perfect for typing and gaming. RGB backlighting.'
    },
    {
      id: 301,
      name: "HyperX Cloud II Headset",
      price: 150.00,
      oldPrice: 200.00,
      image: HeadsetImage,
      category: "Headset",
      description: 'Immersive 7.1 virtual surround sound and supreme comfort for extended gaming and media consumption. Detachable mic.'
    },
  ];

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const currentProduct = products[currentProductIndex];

  useEffect(() => {
    let intervalId;
    if (!isDragging) {
      intervalId = setInterval(() => {
        setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [currentProductIndex, products.length, isDragging]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const dragThreshold = 100;
    let productChanged = false;

    if (info.offset.x > dragThreshold) {
      setCurrentProductIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
      setDragArrowDirection('left');
      productChanged = true;
    } else if (info.offset.x < -dragThreshold) {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
      setDragArrowDirection('right');
      productChanged = true;
    }

    if (productChanged) {
      setTimeout(() => {
        setDragArrowDirection(null);
      }, 500);
    }
  };

  return (
    <div className="flex-1 p-4 relative flex items-center justify-center overflow-hidden">

      <AnimatePresence>
        {dragArrowDirection === 'left' && (
          <motion.div
            key="arrow-left"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="absolute left-24 top-1/2 -translate-y-1/2 text-white text-5xl font-bold pointer-events-none z-20"
          >
            ←
          </motion.div>
        )}
        {dragArrowDirection === 'right' && (
          <motion.div
            key="arrow-right"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
            className="absolute right-24 top-1/2 -translate-y-1/2 text-white text-5xl font-bold pointer-events-none z-20"
          >
            →
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative flex flex-col items-center text-center p-4 max-w-lg cursor-grab bg-zinc-900 rounded-lg"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTap={() => {
            if (!isDragging) {
                navigate(`/product/${currentProduct.id}`);
            }
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <span className="text-5xl font-extrabold text-gray-800 opacity-20 whitespace-nowrap select-none transform scale-x-125">
              {currentProduct.category}
            </span>
          </div>

          {currentProduct.image ? (
            <div className="w-full h-96 flex items-center justify-center mb-4 rounded-lg shadow-md overflow-hidden z-10">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-full h-full object-contain"
                draggable="false"
              />
            </div>
          ) : (
            <div className="bg-blue-600 w-full h-96 flex items-center justify-center text-white text-2xl mb-4 rounded-lg shadow-md z-10">
              {currentProduct.name || "Product Image"}
            </div>
          )}

          <h3 className="text-4xl font-bold my-6">{currentProduct.name}</h3>

          <div className="flex items-baseline space-x-4">
            {currentProduct.oldPrice && (
              <p className="text-zinc-400 line-through text-lg">
                ${currentProduct.oldPrice.toFixed(2)}
              </p>
            )}
            <p className="text-5xl font-extrabold text-blue-400">
              ${currentProduct.price.toFixed(2)}
            </p>
          </div>

          <button
            type="button"
            className="flex items-center space-x-3 mt-6
                       px-6 py-2 rounded-full text-white text-lg font-medium
                       hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(currentProduct); // <--- CALL addToCart HERE
              console.log(`Added ${currentProduct.name} to cart from carousel!`);
            }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
              <span className="text-white text-xl leading-none -mt-0.5">+</span>
            </div>
            <span>ADD TO CART</span>
          </button>

        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentProductIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentProductIndex === index ? 'bg-blue-500' : 'bg-zinc-600'
            } transition-colors duration-200`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ProductDisplay;