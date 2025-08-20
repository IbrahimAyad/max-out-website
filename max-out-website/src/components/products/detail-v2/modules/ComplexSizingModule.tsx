'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ProductModuleProps } from '../types';

const ComplexSizingModule: React.FC<ProductModuleProps> = ({
  product,
  selectedSize,
  onSizeSelect,
  className = ''
}) => {
  const [selectedLength, setSelectedLength] = useState<'Short' | 'Regular' | 'Long'>('Regular');
  const [selectedSuitType, setSelectedSuitType] = useState<'2-piece' | '3-piece'>('2-piece');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Suit sizing grid data
  const suitSizes = {
    Short: {
      label: "Short (5'4\" - 5'7\")",
      range: "5'4\" - 5'7\"",
      sizes: ['34S', '36S', '38S', '40S', '42S', '44S', '46S', '48S', '50S']
    },
    Regular: {
      label: "Regular (5'8\" - 6'1\")",
      range: "5'8\" - 6'1\"", 
      sizes: ['34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R']
    },
    Long: {
      label: "Long (6'2\"+)",
      range: "6'2\"+",
      sizes: ['38L', '40L', '42L', '44L', '46L', '48L', '50L', '52L', '54L']
    }
  };

  const handleSizeSelect = (size: string) => {
    onSizeSelect?.(size);
  };

  const handleLengthChange = (length: 'Short' | 'Regular' | 'Long') => {
    setSelectedLength(length);
    // Clear selected size when changing length
    onSizeSelect?.('');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-burgundy-50 to-gold-50 border border-burgundy-200 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-burgundy-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              AI Size Recommendation
            </h4>
            <p className="text-sm text-gray-600">
              Based on your measurements, we recommend <span className="font-semibold text-burgundy-600">42R</span> for the best fit.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Suit Type Toggle */}
      <div>
        <label className="text-sm font-medium text-gray-900 block mb-3">
          Suit Type
        </label>
        <div className="flex space-x-2">
          {(['2-piece', '3-piece'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedSuitType(type)}
              className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                selectedSuitType === type
                  ? 'border-burgundy-500 bg-burgundy-50 text-burgundy-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <span className="font-medium">{type}</span>
              <span className="text-xs block mt-1">
                {type === '2-piece' ? 'Jacket & Pants' : 'Jacket, Pants & Vest'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Length Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-900">
            Length
          </label>
          <button
            onClick={() => setShowSizeGuide(true)}
            className="text-xs text-burgundy-600 hover:text-burgundy-500 flex items-center space-x-1"
          >
            <InformationCircleIcon className="w-4 h-4" />
            <span>Size Guide</span>
          </button>
        </div>
        
        <div className="space-y-2">
          {(Object.keys(suitSizes) as Array<keyof typeof suitSizes>).map((length) => (
            <button
              key={length}
              onClick={() => handleLengthChange(length)}
              className={`w-full py-3 px-4 text-left rounded-lg border transition-all ${
                selectedLength === length
                  ? 'border-burgundy-500 bg-burgundy-50 text-burgundy-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">{length}</div>
              <div className="text-sm text-gray-500">{suitSizes[length].range}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Size Grid */}
      <div>
        <label className="text-sm font-medium text-gray-900 block mb-3">
          Size ({selectedLength})
        </label>
        
        <div className="grid grid-cols-3 gap-2">
          {suitSizes[selectedLength].sizes.map((size) => (
            <motion.button
              key={size}
              onClick={() => handleSizeSelect(size)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
        
        <p className="text-xs text-gray-500 mt-2">
          First number is chest size, letter indicates jacket length
        </p>
      </div>

      {/* Selected Size Summary */}
      {selectedSize && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
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
                Selected: {selectedSuitType} {selectedSize}
              </p>
              <p className="text-xs text-green-700">
                Perfect for heights {suitSizes[selectedLength].range}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Suit Size Guide
                </h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">How to Measure</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Chest: Measure around the fullest part of your chest</li>
                    <li>• Waist: Measure around your natural waistline</li>
                    <li>• Height: Stand straight against a wall</li>
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Size Chart</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Size</th>
                          <th className="text-left py-2">Chest (in)</th>
                          <th className="text-left py-2">Waist (in)</th>
                          <th className="text-left py-2">Height</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        <tr><td className="py-1">38R</td><td>38-39</td><td>32-33</td><td>5'8" - 6'1"</td></tr>
                        <tr><td className="py-1">40R</td><td>40-41</td><td>34-35</td><td>5'8" - 6'1"</td></tr>
                        <tr><td className="py-1">42R</td><td>42-43</td><td>36-37</td><td>5'8" - 6'1"</td></tr>
                        <tr><td className="py-1">44R</td><td>44-45</td><td>38-39</td><td>5'8" - 6'1"</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplexSizingModule;