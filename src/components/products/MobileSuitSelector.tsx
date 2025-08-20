'use client';

import { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';

interface MobileSuitSelectorProps {
  onSizeSelect: (size: string) => void;
  onStyleSelect: (style: 'twoPiece' | 'threePiece') => void;
  selectedSize: string;
  selectedStyle: 'twoPiece' | 'threePiece';
}

export default function MobileSuitSelector({
  onSizeSelect,
  onStyleSelect,
  selectedSize,
  selectedStyle,
}: MobileSuitSelectorProps) {
  const [showSizeSheet, setShowSizeSheet] = useState(false);
  const [showStyleSheet, setShowStyleSheet] = useState(false);
  
  const sizes = {
    'Short (5\'4" - 5\'7")': ['34S', '36S', '38S', '40S', '42S', '44S', '46S', '48S', '50S'],
    'Regular (5\'8" - 6\'1")': ['34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R'],
    'Long (6\'2" +)': ['38L', '40L', '42L', '44L', '46L', '48L', '50L', '52L', '54L'],
  };
  
  return (
    <>
      {/* Style Selector */}
      <button
        onClick={() => setShowStyleSheet(true)}
        className="w-full p-4 bg-gray-50 rounded-lg flex items-center justify-between mb-3"
      >
        <div className="text-left">
          <p className="text-sm text-gray-600">Style</p>
          <p className="font-medium">
            {selectedStyle === 'twoPiece' ? '2-Piece Suit' : '3-Piece Suit'}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </button>
      
      {/* Size Selector */}
      <button
        onClick={() => setShowSizeSheet(true)}
        className="w-full p-4 bg-gray-50 rounded-lg flex items-center justify-between"
      >
        <div className="text-left">
          <p className="text-sm text-gray-600">Size</p>
          <p className="font-medium">{selectedSize || 'Select Size'}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </button>
      
      {/* Style Bottom Sheet */}
      {showStyleSheet && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowStyleSheet(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-semibold mb-4">Select Style</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  onStyleSelect('twoPiece');
                  setShowStyleSheet(false);
                }}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedStyle === 'twoPiece'
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">2-Piece Suit</p>
                    <p className="text-sm text-gray-600">Jacket & Pants</p>
                    <p className="font-semibold mt-1">$179.99</p>
                  </div>
                  {selectedStyle === 'twoPiece' && <Check className="h-5 w-5" />}
                </div>
              </button>
              
              <button
                onClick={() => {
                  onStyleSelect('threePiece');
                  setShowStyleSheet(false);
                }}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedStyle === 'threePiece'
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">3-Piece Suit</p>
                    <p className="text-sm text-gray-600">Jacket, Vest & Pants</p>
                    <p className="font-semibold mt-1">$199.99</p>
                  </div>
                  {selectedStyle === 'threePiece' && <Check className="h-5 w-5" />}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Size Bottom Sheet */}
      {showSizeSheet && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSizeSheet(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-semibold mb-4">Select Size</h3>
            
            {Object.entries(sizes).map(([category, sizeList]) => (
              <div key={category} className="mb-6">
                <p className="text-sm font-medium text-gray-600 mb-3">{category}</p>
                <div className="grid grid-cols-3 gap-2">
                  {sizeList.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        onSizeSelect(size);
                        setShowSizeSheet(false);
                      }}
                      className={`p-3 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setShowSizeSheet(false)}
              className="w-full mt-4 p-4 bg-gray-100 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}