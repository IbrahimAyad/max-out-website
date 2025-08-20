'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { TuxedoProduct } from '@/lib/products/tuxedoProducts';

interface TuxedoCardProps {
  tuxedo: TuxedoProduct;
}

export default function TuxedoCard({ tuxedo }: TuxedoCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      href={`/products/tuxedos/${tuxedo.id}`}
      className="group"
    >
      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={imageError ? '/placeholder-suit.jpg' : tuxedo.image}
          alt={tuxedo.name}
          width={300}
          height={400}
          className={`object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          priority={false}
        />
      </div>
      <h3 className="font-medium text-lg mb-1">{tuxedo.name}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="font-semibold">${tuxedo.price}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Free Shipping</p>
      <div className="mt-2">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">2-Piece Formal Tuxedo</span>
      </div>
    </Link>
  );
}