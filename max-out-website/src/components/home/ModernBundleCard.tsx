'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useSimpleCart } from '@/hooks/useSimpleCart';

interface BundleProduct {
  name: string;
  image: string;
  color?: string;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  totalPrice: number;
  originalPrice: number;
  savings: number;
  suit: BundleProduct;
  shirt: BundleProduct;
  tie: BundleProduct;
  modelImage: string;
  slug: string;
}

interface ModernBundleCardProps {
  bundle: Bundle;
}

export function ModernBundleCard({ bundle }: ModernBundleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useSimpleCart();

  const handleQuickShop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add bundle to cart with proper metadata
    addItem({
      id: bundle.id,
      name: bundle.name,
      price: bundle.totalPrice * 100, // Convert to cents
      image: bundle.modelImage,
      quantity: 1,
      category: 'bundle',
      stripePriceId: 'price_1RpvQqCHc12x7sCzfRrWStZb' // Default bundle price ID
    });
  };

  return (
    <Link href={`/bundles/${bundle.slug}`}>
      <div 
        className="relative bg-white border border-gray-200 overflow-hidden transition-all duration-500 hover:border-burgundy hover:shadow-2xl cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              // Single Model/Product View (Default State)
              <motion.div
                key="model"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-full"
              >
                <Image
                  src={bundle.modelImage}
                  alt={bundle.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            ) : (
              // 3-Product Grid (Hover State)
              <motion.div
                key="grid"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="h-full relative"
              >
                {/* Main grid layout */}
                <div className="grid grid-cols-2 h-full">
                  {/* Left side - Suit takes up full height */}
                  <div className="relative bg-white">
                    <Image
                      src={bundle.suit.image}
                      alt={bundle.suit.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-white/90 backdrop-blur text-black text-xs px-2 py-1 text-center font-medium">
                        {bundle.suit.name}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Shirt and Tie stacked */}
                  <div className="grid grid-rows-2">
                    {/* Shirt */}
                    <div className="relative bg-white">
                      <Image
                        src={bundle.shirt.image}
                        alt={bundle.shirt.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-white/90 backdrop-blur text-black text-xs px-2 py-1 text-center font-medium">
                          {bundle.shirt.name}
                        </div>
                      </div>
                    </div>
                    
                    {/* Tie */}
                    <div className="relative bg-white">
                      <Image
                        src={bundle.tie.image}
                        alt={bundle.tie.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-white/90 backdrop-blur text-black text-xs px-2 py-1 text-center font-medium">
                          {bundle.tie.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Shop Button Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <Button 
                    onClick={handleQuickShop}
                    className="w-full bg-black text-white hover:bg-gray-800 font-semibold shadow-lg"
                    size="sm"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Quick Add Bundle
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Bundle Info - Compressed spacing */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-serif font-semibold line-clamp-1">{bundle.name}</h3>
            <div className="text-right">
              <div className="text-burgundy font-bold">${bundle.totalPrice}</div>
              <div className="text-xs text-gray-500 line-through">${bundle.originalPrice}</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bundle.description}</p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-green-600 font-medium">
              Save ${bundle.savings}
            </div>
            <span className="text-xs text-burgundy font-semibold group-hover:underline flex items-center">
              View Details
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}