'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductModuleProps } from '../types';

const StandardSizingModule: React.FC<ProductModuleProps> = ({
  product,
  selectedSize,
  selectedFit,
  onSizeSelect,
  onFitSelect,
  className = ''
}) => {
  const [showMeasurements, setShowMeasurements] = useState(false);
  
  // Standard shirt sizes
  const standardSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  
  // Fit options for shirts
  const fitOptions = [
    {
      value: 'slim',
      label: 'Slim Fit',
      description: 'Tailored through the chest and waist'
    },
    {
      value: 'classic',
      label: 'Classic Fit', 
      description: 'Traditional cut with room for comfort'
    }
  ];

  // Optional neck and sleeve measurements
  const neckSizes = ['15"', '15.5"', '16"', '16.5"', '17"', '17.5"'];
  const sleeveSizes = ['32"', '33"', '34"', '35"', '36"', '37"'];

  const isShirt = product.category === 'shirts' || 
                  product.name.toLowerCase().includes('shirt');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Fit Selector (for shirts) */}
      {isShirt && (
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-3">
            Fit
          </label>
          <div className="space-y-2">
            {fitOptions.map((fit) => (
              <label key={fit.value} className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  name="fit"
                  value={fit.value}
                  checked={selectedFit === fit.value}
                  onChange={() => onFitSelect?.(fit.value)}
                  className="mt-0.5 w-4 h-4 text-burgundy-600 border-gray-300 focus:ring-burgundy-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {fit.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {fit.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-900">
            Size
          </label>
          {isShirt && (
            <button
              onClick={() => setShowMeasurements(!showMeasurements)}
              className="text-xs text-burgundy-600 hover:text-burgundy-500"
            >
              {showMeasurements ? 'Hide' : 'Show'} Measurements
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {standardSizes.map((size) => (
            <motion.button
              key={size}
              onClick={() => onSizeSelect?.(size)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-3 px-2 text-sm font-medium rounded-lg border transition-all ${
                selectedSize === size
                  ? 'border-burgundy-500 bg-burgundy-500 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {size}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detailed Measurements (for shirts) */}
      {isShirt && showMeasurements && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 border-t pt-4"
        >
          {/* Neck Size */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Neck Size (Optional)
            </label>
            <div className="grid grid-cols-6 gap-2">
              {neckSizes.map((neck) => (
                <button
                  key={neck}
                  className="py-2 px-2 text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                >
                  {neck}
                </button>
              ))}
            </div>
          </div>

          {/* Sleeve Length */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Sleeve Length (Optional)
            </label>
            <div className="grid grid-cols-6 gap-2">
              {sleeveSizes.map((sleeve) => (
                <button
                  key={sleeve}
                  className="py-2 px-2 text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                >
                  {sleeve}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Size Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Size Chart</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-1">Size</th>
                <th className="text-left py-2 px-1">Chest</th>
                <th className="text-left py-2 px-1">Length</th>
                {isShirt && <th className="text-left py-2 px-1">Sleeve</th>}
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr><td className="py-1 px-1">S</td><td>34-36"</td><td>27"</td>{isShirt && <td>32-33"</td>}</tr>
              <tr><td className="py-1 px-1">M</td><td>38-40"</td><td>28"</td>{isShirt && <td>33-34"</td>}</tr>
              <tr><td className="py-1 px-1">L</td><td>42-44"</td><td>29"</td>{isShirt && <td>34-35"</td>}</tr>
              <tr><td className="py-1 px-1">XL</td><td>46-48"</td><td>30"</td>{isShirt && <td>35-36"</td>}</tr>
              <tr><td className="py-1 px-1">XXL</td><td>50-52"</td><td>31"</td>{isShirt && <td>36-37"</td>}</tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fit Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Fit Tips
            </h4>
            <p className="text-sm text-gray-600">
              {selectedFit === 'slim' 
                ? "Slim fit is cut closer to the body for a modern, tailored look. Size up if you prefer more room."
                : "Classic fit provides comfortable room through the chest and waist for all-day wear."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Selected Size Summary */}
      {selectedSize && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-900">
                Selected: {selectedFit ? `${selectedFit} fit, ` : ''}{selectedSize}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StandardSizingModule;