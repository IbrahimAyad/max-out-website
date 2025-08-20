'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductModuleProps } from '../types';

const BundleBuilderModule: React.FC<ProductModuleProps> = ({
  product,
  selectedColor,
  onColorSelect,
  className = ''
}) => {
  const [bundleMode, setBundleMode] = useState<'single' | 'bundle'>('single');
  const [selectedTier, setSelectedTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier1');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Bundle pricing tiers
  const bundleTiers = [
    {
      id: 'tier1',
      name: 'Buy 4 Get 1 Free',
      description: '5 items total',
      price: 99.97,
      originalPrice: 124.96,
      savings: 24.99,
      items: 5,
      free: 1,
      popular: false
    },
    {
      id: 'tier2', 
      name: 'Buy 6 Get 2 Free',
      description: '8 items total',
      price: 149.96,
      originalPrice: 199.94,
      savings: 49.98,
      items: 8,
      free: 2,
      popular: true
    },
    {
      id: 'tier3',
      name: 'Buy 8 Get 3 Free',
      description: '11 items total',
      price: 199.95,
      originalPrice: 274.93,
      savings: 74.98,
      items: 11,
      free: 3,
      popular: false
    }
  ];

  // Available colors (8x10 grid = 80 colors)
  const colorOptions = [
    // Row 1 - Neutrals
    { name: 'Black', hex: '#000000', popular: true },
    { name: 'Navy', hex: '#1e3a5f', popular: true },
    { name: 'Charcoal', hex: '#36454f', popular: true },
    { name: 'Dark Brown', hex: '#654321', popular: false },
    { name: 'Burgundy', hex: '#800020', popular: true },
    { name: 'Forest Green', hex: '#228B22', popular: false },
    { name: 'Royal Blue', hex: '#4169E1', popular: true },
    { name: 'White', hex: '#FFFFFF', popular: true },
    
    // Row 2 - Blues
    { name: 'Light Blue', hex: '#87CEEB', popular: true },
    { name: 'Powder Blue', hex: '#B0E0E6', popular: false },
    { name: 'Steel Blue', hex: '#4682B4', popular: false },
    { name: 'Midnight Blue', hex: '#191970', popular: true },
    { name: 'Teal', hex: '#008080', popular: false },
    { name: 'Turquoise', hex: '#40E0D0', popular: false },
    { name: 'Aqua', hex: '#00FFFF', popular: false },
    { name: 'Sky Blue', hex: '#87CEEB', popular: false },

    // Row 3 - Reds & Pinks  
    { name: 'Red', hex: '#FF0000', popular: true },
    { name: 'Crimson', hex: '#DC143C', popular: false },
    { name: 'Maroon', hex: '#800000', popular: false },
    { name: 'Pink', hex: '#FFC0CB', popular: true },
    { name: 'Rose', hex: '#FF007F', popular: false },
    { name: 'Coral', hex: '#FF7F50', popular: true },
    { name: 'Salmon', hex: '#FA8072', popular: false },
    { name: 'Hot Pink', hex: '#FF69B4', popular: false },

    // Row 4 - Purples
    { name: 'Purple', hex: '#800080', popular: true },
    { name: 'Lavender', hex: '#E6E6FA', popular: true },
    { name: 'Violet', hex: '#EE82EE', popular: false },
    { name: 'Indigo', hex: '#4B0082', popular: false },
    { name: 'Plum', hex: '#DDA0DD', popular: false },
    { name: 'Orchid', hex: '#DA70D6', popular: false },
    { name: 'Magenta', hex: '#FF00FF', popular: false },
    { name: 'Fuchsia', hex: '#FF00FF', popular: false },

    // Row 5 - Yellows & Golds
    { name: 'Gold', hex: '#FFD700', popular: true },
    { name: 'Yellow', hex: '#FFFF00', popular: true },
    { name: 'Mustard', hex: '#FFDB58', popular: true },
    { name: 'Cream', hex: '#FFFDD0', popular: false },
    { name: 'Champagne', hex: '#F7E7CE', popular: false },
    { name: 'Beige', hex: '#F5F5DC', popular: false },
    { name: 'Ivory', hex: '#FFFFF0', popular: false },
    { name: 'Khaki', hex: '#F0E68C', popular: false },

    // Add more rows to reach 80 colors...
    // This is a sample - you would continue with more color variations
  ];

  const handleColorSelect = (colorName: string) => {
    if (bundleMode === 'single') {
      onColorSelect?.(colorName);
    } else {
      const maxColors = bundleTiers.find(t => t.id === selectedTier)?.items || 5;
      if (selectedColors.includes(colorName)) {
        setSelectedColors(selectedColors.filter(c => c !== colorName));
      } else if (selectedColors.length < maxColors) {
        setSelectedColors([...selectedColors, colorName]);
      }
    }
  };

  const getProgressPercentage = () => {
    const maxColors = bundleTiers.find(t => t.id === selectedTier)?.items || 5;
    return (selectedColors.length / maxColors) * 100;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Bundle Toggle */}
      <div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBundleMode('single')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              bundleMode === 'single'
                ? 'bg-white text-burgundy-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Single Item
          </button>
          <button
            onClick={() => setBundleMode('bundle')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              bundleMode === 'bundle'
                ? 'bg-white text-burgundy-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bundle & Save
          </button>
        </div>
      </div>

      {/* Bundle Tiers */}
      <AnimatePresence>
        {bundleMode === 'bundle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-gray-900">Choose Your Bundle</h4>
            
            {bundleTiers.map((tier) => (
              <motion.div
                key={tier.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTier(tier.id as any)}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedTier === tier.id
                    ? 'border-burgundy-500 bg-burgundy-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${tier.popular ? 'ring-2 ring-gold-400 ring-opacity-50' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-2 left-4">
                    <span className="bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded">
                      POPULAR
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-semibold text-gray-900">{tier.name}</h5>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedTier === tier.id
                          ? 'border-burgundy-500 bg-burgundy-500'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {selectedTier === tier.id && (
                          <svg className="w-3 h-3 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      Save ${tier.savings.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${tier.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ${tier.originalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator for Bundle Mode */}
      {bundleMode === 'bundle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              Select Colors ({selectedColors.length}/{bundleTiers.find(t => t.id === selectedTier)?.items})
            </span>
            <span className="text-xs text-gray-500">
              {bundleTiers.find(t => t.id === selectedTier)?.free} FREE
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              className="bg-gradient-to-r from-burgundy-500 to-gold-500 h-2 rounded-full transition-all duration-300"
            />
          </div>
        </motion.div>
      )}

      {/* Color Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900">
            {bundleMode === 'single' ? 'Select Color' : 'Choose Your Colors'}
          </h4>
          <button className="text-xs text-burgundy-600 hover:text-burgundy-500">
            View all 80+ colors
          </button>
        </div>
        
        <div className="grid grid-cols-8 gap-2">
          {colorOptions.slice(0, 32).map((color) => {
            const isSelected = bundleMode === 'single' 
              ? selectedColor === color.name
              : selectedColors.includes(color.name);
              
            return (
              <motion.button
                key={color.name}
                onClick={() => handleColorSelect(color.name)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                  isSelected
                    ? 'border-burgundy-500 ring-2 ring-burgundy-200'
                    : 'border-gray-300 hover:border-gray-400'
                } ${color.popular ? 'ring-1 ring-gold-300' : ''}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className={`w-4 h-4 ${
                      color.hex === '#FFFFFF' || color.hex === '#FFFDD0' || color.hex === '#FFFFF0' 
                        ? 'text-gray-800' : 'text-white'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {color.popular && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-500 rounded-full border border-white" />
                )}
              </motion.button>
            );
          })}
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Popular colors are marked with a gold dot
        </p>
      </div>

      {/* Selected Colors Summary */}
      {bundleMode === 'bundle' && selectedColors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-green-900 mb-1">
                Bundle Progress: {selectedColors.length}/{bundleTiers.find(t => t.id === selectedTier)?.items}
              </h5>
              <div className="flex flex-wrap gap-1">
                {selectedColors.map((colorName) => {
                  const color = colorOptions.find(c => c.name === colorName);
                  return (
                    <div key={colorName} className="flex items-center space-x-1 bg-white rounded px-2 py-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: color?.hex }}
                      />
                      <span className="text-xs text-gray-700">{colorName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bundle Benefits */}
      {bundleMode === 'bundle' && (
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gold-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Bundle Benefits
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mix and match any colors</li>
                <li>• Free shipping on all bundles</li>
                <li>• 60-day satisfaction guarantee</li>
                <li>• Perfect for special events</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleBuilderModule;