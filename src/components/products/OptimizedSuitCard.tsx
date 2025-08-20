'use client';

import Link from 'next/link';
import { useState } from 'react';
import OptimizedImage from '../ui/OptimizedImage';

interface OptimizedSuitCardProps {
  suit: {
    id: string;
    name: string;
    color: string;
    twoPiecePrice: number;
    threePiecePrice: number;
    image: string;
  };
}

export default function OptimizedSuitCard({ suit }: OptimizedSuitCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/products/suits/${suit.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
        <OptimizedImage
          src={suit.image}
          alt={suit.name}
          preset="card"
          lazy
          className={`w-full h-full transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          fallbackSrc="/placeholder-suit.jpg"
        />
        
        {/* Quick view overlay on hover */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <span className="bg-white text-black px-4 py-2 rounded-md font-medium transform transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-2'
          }">
            Quick View
          </span>
        </div>
      </div>
      
      <h3 className="font-medium text-lg mb-1 group-hover:text-gray-700 transition-colors">
        {suit.name}
      </h3>
      
      <div className="flex items-baseline space-x-2">
        <span className="text-sm text-gray-600">From</span>
        <span className="font-semibold">${suit.twoPiecePrice}</span>
      </div>
      
      <div className="mt-2 flex space-x-2">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">2-Piece</span>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">3-Piece</span>
      </div>
    </Link>
  );
}