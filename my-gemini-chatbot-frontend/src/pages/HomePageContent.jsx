// src/pages/HomePageContent.jsx
import React from 'react';
import ProductDisplay from '../components/ProductDisplay'; // Your existing product display
import SetupDisplay from '../components/SetupDisplay';   // Your new setup display

const HomePageContent = () => {
  return (
    <div className="flex flex-col items-center p-4">
      {/* Your Existing Product Display */}
      {/* Note: If your ProductDisplay takes props like `searchTerm`, pass them here.
          Based on your App.jsx, ProductDisplay currently doesn't take props for the home route. */}
      <ProductDisplay /> 

      {/* Spacer for visual separation */}
      <div className="w-full h-12"></div> 

      {/* Your New Setup Display */}
      <SetupDisplay />
    </div>
  );
};

export default HomePageContent;