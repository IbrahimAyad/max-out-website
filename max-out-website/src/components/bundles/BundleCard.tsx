'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingBag, TrendingUp, Tag, Sparkles } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface BundleCardProps {
  bundle: any; // Changed to any to support multiple bundle types
  onQuickView: () => void;
  featured?: boolean;
}

export default function BundleCard({ bundle, onQuickView, featured = false }: BundleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    // Add bundle logic - would add all three items with bundle pricing
    addItem({
      id: bundle.id,
      name: bundle.name,
      price: bundle.bundlePrice,
      image: bundle.imageUrl,
      quantity: 1,
      category: 'bundle',
      metadata: {
        suit: bundle.suit,
        shirt: bundle.shirt,
        tie: bundle.tie,
        pocketSquare: bundle.pocketSquare,
        originalPrice: bundle.originalPrice,
        savings: bundle.savings
      }
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border ${
        featured ? 'border-2 border-gold' : 'border-gray-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {bundle.trending && (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </span>
        )}
        {bundle.savings > 100 && (
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            Save ${Math.round(bundle.savings)}
          </span>
        )}
        {bundle.aiScore && bundle.aiScore >= 95 && (
          <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Pick
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorited(!isFavorited)}
        className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${
            isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
          }`}
        />
      </button>

      {/* Image Container */}
      <Link href={`/bundles/${bundle.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <Image
          src={bundle.imageUrl}
          alt={bundle.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView();
            }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </motion.div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {bundle.category.replace('-', ' ')}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-xl mb-2 line-clamp-1">
          {bundle.name}
        </h3>

        {/* Combination */}
        <div className="text-base text-gray-600 mb-3">
          <p className="line-clamp-1">
            {bundle.suit.color} • {bundle.shirt.color} • {bundle.tie ? bundle.tie.color : bundle.pocketSquare ? bundle.pocketSquare.color + ' PS' : ''}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">${bundle.bundlePrice}</span>
            <span className="text-base text-gray-400 line-through">${bundle.originalPrice}</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <Tag className="w-4 h-4" />
            <span className="text-sm font-medium">-{Math.round((bundle.savings / bundle.originalPrice) * 100)}%</span>
          </div>
        </div>

        {/* Occasions */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bundle.occasions.slice(0, 2).map((occasion) => (
            <span
              key={occasion}
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium"
            >
              {occasion}
            </span>
          ))}
          {bundle.occasions.length > 2 && (
            <span className="text-sm text-gray-500">
              +{bundle.occasions.length - 2} more
            </span>
          )}
        </div>

        {/* Quick Add Button (Mobile) */}
        <button
          onClick={handleAddToCart}
          className="md:hidden w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}