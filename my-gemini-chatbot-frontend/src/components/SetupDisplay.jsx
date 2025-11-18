// src/components/SetupDisplay.jsx
import React from 'react';
import setupData from '../data/setupData'; // Import the setup data

const SetupDisplay = () => {
  if (!setupData) {
    return <div className="text-center p-4 text-red-400">Setup data not found.</div>;
  }

  return (
    <div className="bg-zinc-800 p-8 rounded-lg shadow-xl text-white max-w-4xl mx-auto my-8 border border-zinc-700">
      <h2 className="text-4xl font-extrabold text-blue-400 mb-6 text-center">{setupData.name}</h2>

      <div className="flex flex-col md:flex-row gap-8 mb-8 items-center">
        {setupData.image && (
          <div className="md:w-1/2 flex justify-center">
            <img
              src={setupData.image}
              alt={setupData.name}
              className="rounded-lg shadow-lg object-cover max-h-96 w-full"
            />
          </div>
        )}
        <div className="md:w-1/2">
          <p className="text-zinc-300 text-lg mb-4">{setupData.description}</p>
          <p className="text-xl font-semibold text-green-400 mb-4">
            Estimated Cost: {setupData.priceEstimate}
          </p>
          {setupData.notes && (
            <p className="text-zinc-400 text-sm italic">{setupData.notes}</p>
          )}
        </div>
      </div>

      <h3 className="text-3xl font-bold text-blue-300 mb-6 text-center">Key Components</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {setupData.components.map((component, index) => (
          <div key={index} className="flex items-start">
            <span className="text-yellow-400 text-2xl mr-3 transform -rotate-12">★</span>
            <p className="text-lg">
              <span className="font-semibold text-blue-200">{component.name}:</span>{' '}
              <span className="text-zinc-200">{component.detail}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupDisplay;