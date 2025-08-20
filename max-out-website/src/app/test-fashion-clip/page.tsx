'use client';

import { useState } from 'react';
import { VisualSearch } from '@/components/search/VisualSearch';

export default function TestFashionClip() {
  const [results, setResults] = useState<any[]>([]);
  const [showVisualSearch, setShowVisualSearch] = useState(true);

  const handleResults = (products: any[]) => {
    console.log('Visual search results:', products);
    setResults(products);
    setShowVisualSearch(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Fashion CLIP Visual Search Test</h1>
        
        {!showVisualSearch && (
          <button 
            onClick={() => setShowVisualSearch(true)}
            className="mb-8 px-6 py-3 bg-gold text-black rounded-lg hover:bg-gold/90"
          >
            Open Visual Search
          </button>
        )}

        {showVisualSearch && (
          <VisualSearch
            onResults={handleResults}
            onClose={() => setShowVisualSearch(false)}
          />
        )}

        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Search Results ({results.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((product: any, index: number) => (
                <div key={product.id || index} className="bg-white rounded-lg shadow-lg p-6">
                  <img 
                    src={product.images?.[0] || '/placeholder-product.jpg'} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">SKU: {product.sku}</p>
                  <p className="text-gray-600 mb-2">Category: {product.category}</p>
                  <p className="text-2xl font-bold">${(product.price / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Open Visual Search" button</li>
            <li>Upload an image of clothing (suit, shirt, etc.)</li>
            <li>Optionally add text to refine search (e.g., "navy wedding suit")</li>
            <li>Click "Find Similar Items"</li>
            <li>Check browser console for Fashion CLIP API responses</li>
            <li>Results should show products matching the uploaded image</li>
          </ol>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Open browser DevTools console (F12) to see Fashion CLIP API responses and debug information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}