import React from 'react';
import { Check } from 'lucide-react';

interface Bundle {
  name: string;
  description: string;
  price: number;
  quantity: number;
  paidItems: number;
  savings: number;
}

interface TieBundleCalculatorProps {
  selectedBundle: string;
  onBundleChange: (bundle: string) => void;
  bundles: Record<string, Bundle>;
  basePrice: number;
}

export default function TieBundleCalculator({
  selectedBundle,
  onBundleChange,
  bundles,
  basePrice
}: TieBundleCalculatorProps) {
  const currentBundle = bundles[selectedBundle];
  const regularPrice = basePrice * currentBundle.quantity;
  const savings = regularPrice - currentBundle.price;

  return (
    <div className="bg-blue-50 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-blue-900">Bundle Savings Calculator</h3>
      
      {/* Bundle Options */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(bundles).map(([bundleKey, bundle]) => (
          <button
            key={bundleKey}
            onClick={() => onBundleChange(bundleKey)}
            className={`py-3 px-4 rounded-lg font-medium transition-all ${
              selectedBundle === bundleKey
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="text-sm">{bundle.description}</div>
          </button>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-4 border-t border-blue-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">
            Regular Price ({currentBundle.quantity} items):
          </span>
          <span className="text-gray-700 line-through">
            ${regularPrice.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">
            Bundle Price ({currentBundle.paidItems} paid items):
          </span>
          <span className="font-bold text-gray-900">
            ${currentBundle.price.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-blue-200">
          <span className="text-green-700 font-bold">Your Savings:</span>
          <span className="text-green-700 font-bold text-lg">
            ${savings.toFixed(2)} ({currentBundle.savings}%)
          </span>
        </div>
      </div>

      {/* Free Items Indicator */}
      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center">
        <p className="font-medium">
          Get {currentBundle.quantity - currentBundle.paidItems} {currentBundle.quantity - currentBundle.paidItems === 1 ? 'item' : 'items'} with this bundle!
        </p>
      </div>
    </div>
  );
}