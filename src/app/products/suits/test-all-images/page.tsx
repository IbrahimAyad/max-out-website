'use client';

import { useState } from 'react';
import Image from 'next/image';
import { suitImages } from '@/lib/data/suitImages';

export default function TestAllSuitImages() {
  const [selectedColor, setSelectedColor] = useState<string>('navy');
  
  const suitColors = Object.keys(suitImages);
  const currentImages = suitImages[selectedColor as keyof typeof suitImages];
  
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">All Suit Images Test</h1>
      
      {/* Color Selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Suit Color:</h2>
        <div className="flex flex-wrap gap-2">
          {suitColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 rounded-md transition-all ${
                selectedColor === color
                  ? 'bg-black text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {color.charAt(0).toUpperCase() + color.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1).replace(/([A-Z])/g, ' $1')} Suit - {currentImages.gallery.length} Images
          </h3>
          <p className="text-sm text-gray-600 mb-4">Main Image: {currentImages.main}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentImages.gallery.map((imageUrl, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={`${selectedColor} suit - View ${index + 1}`}
                  width={400}
                  height={533}
                  className="object-cover w-full h-full"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="flex items-center justify-center h-full text-red-500 text-sm p-4 text-center">Image not found:<br/>${imageUrl.split('/').pop()}</div>`;
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 truncate">{imageUrl.split('/').pop()}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Image Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {Object.entries(suitImages).map(([color, images]) => (
            <div key={color}>
              <span className="font-medium">{color}:</span> {images.gallery.length} images
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Links */}
      <div className="mt-8 space-y-2">
        <a href="/products/suits" className="block text-blue-600 hover:underline">
          → View Suits Collection Page
        </a>
        <a href={`/products/suits/${suitImages[selectedColor as keyof typeof suitImages].productId || 'prod_SlQuqaI2IR6FRm'}`} className="block text-blue-600 hover:underline">
          → View {selectedColor} Suit Product Page
        </a>
      </div>
    </div>
  );
}