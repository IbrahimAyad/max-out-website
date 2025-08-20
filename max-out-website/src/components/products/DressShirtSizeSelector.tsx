'use client';

import React, { useState, useEffect } from 'react';
import { isSleeveLengthAvailable } from '@/lib/products/dressShirtProducts';

interface DressShirtSizeSelectorProps {
  selectedFit: string;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  fits: Record<string, any>;
}

export default function DressShirtSizeSelector({ 
  selectedFit, 
  selectedSize, 
  onSizeChange, 
  fits 
}: DressShirtSizeSelectorProps) {
  const [selectedNeck, setSelectedNeck] = useState('');
  const [selectedSleeve, setSelectedSleeve] = useState('');

  // Reset selections when fit changes
  useEffect(() => {
    setSelectedNeck('');
    setSelectedSleeve('');
    onSizeChange('');
  }, [selectedFit, onSizeChange]);

  // Update the combined size when neck or sleeve changes (for classic fit)
  useEffect(() => {
    if (selectedFit === 'classic' && selectedNeck && selectedSleeve) {
      onSizeChange(`${selectedNeck} / ${selectedSleeve}`);
    }
  }, [selectedNeck, selectedSleeve, selectedFit, onSizeChange]);

  if (selectedFit === 'slim') {
    // Slim fit: Simple size selection
    return (
      <div>
        <h4 className="font-medium mb-3">Select Size</h4>
        <div className="grid grid-cols-5 gap-3">
          {fits.slim.sizes.map((size: any) => (
            <button
              key={size.id}
              onClick={() => onSizeChange(size.label)}
              className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                selectedSize === size.label
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="text-lg">{size.label}</div>
              <div className="text-xs text-gray-500 mt-1">{size.neck}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Classic fit: Neck size + Sleeve length selection
  return (
    <div className="space-y-6">
      {/* Neck Size Selection */}
      <div>
        <h4 className="font-medium mb-3">1. Select Neck Size</h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {fits.classic.neckSizes.map((neck: string) => (
            <button
              key={neck}
              onClick={() => setSelectedNeck(neck)}
              className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                selectedNeck === neck
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {neck}
            </button>
          ))}
        </div>
      </div>

      {/* Sleeve Length Selection */}
      {selectedNeck && (
        <div>
          <h4 className="font-medium mb-3">2. Select Sleeve Length</h4>
          <div className="grid grid-cols-3 gap-3">
            {fits.classic.sleeveLengths.map((sleeve: any) => {
              const isAvailable = isSleeveLengthAvailable(selectedNeck, sleeve.id);
              
              return (
                <button
                  key={sleeve.id}
                  onClick={() => isAvailable && setSelectedSleeve(sleeve.id)}
                  disabled={!isAvailable}
                  className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                    !isAvailable
                      ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                      : selectedSleeve === sleeve.id
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {sleeve.label}
                  {!isAvailable && (
                    <span className="block text-xs mt-1">Not available</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Guide Note */}
      {selectedNeck && selectedSleeve && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Selected Size:</strong> {selectedNeck} neck / {selectedSleeve} sleeve
          </p>
        </div>
      )}
    </div>
  );
}