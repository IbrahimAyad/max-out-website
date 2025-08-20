'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Sparkles, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BundleComponent {
  name: string;
  image: string;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  totalPrice: number;
  originalPrice: number;
  savings: number;
  modelImage: string;
  slug: string;
  rating?: number;
  views?: number;
  suit?: BundleComponent;
  shirt?: BundleComponent;
  tie?: BundleComponent;
}

interface GlassMorphBundleCardProps {
  bundle: Bundle;
  index?: number;
}

export function GlassMorphBundleCard({ bundle, index = 0 }: GlassMorphBundleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(bundle.modelImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImage(bundle.modelImage);
      }}
      className="relative w-full max-w-[380px] h-[520px] group"
    >
      {/* Main card with glass morphism */}
      <div className={cn(
        "relative w-full h-full rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-900/40",
        "backdrop-blur-xl border border-white/10",
        "shadow-2xl transition-all duration-500",
        "hover:shadow-[0_20px_60px_rgba(212,175,55,0.3)]",
        "hover:border-amber-500/30"
      )}>
        
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src={activeImage}
            alt={bundle.name}
            fill
            className="object-cover object-center transition-all duration-700"
            sizes="(max-width: 768px) 380px, 380px"
            priority={index < 3}
          />
          {/* Gradient overlays for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/95" />
        </div>

        {/* Top section - Savings badge and rating */}
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start">
            {/* Animated savings badge */}
            <motion.div
              animate={{ 
                y: isHovered ? -5 : 0,
                scale: isHovered ? 1.05 : 1
              }}
              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
            >
              Save ${bundle.savings}
            </motion.div>

            {/* Rating */}
            {bundle.rating && (
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-400 font-semibold text-sm">{bundle.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Component images preview - shows on hover */}
        <AnimatePresence>
          {isHovered && bundle.suit && bundle.shirt && bundle.tie && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-6 top-24 z-20 flex flex-col gap-3"
            >
              {[bundle.suit, bundle.shirt, bundle.tie].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/95 backdrop-blur-md rounded-lg p-2 shadow-xl border border-white/50 cursor-pointer hover:scale-105 transition-transform"
                  onMouseEnter={() => setActiveImage(item.image)}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom content section */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
          {/* Glass morphism content container */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-white/10">
            {/* Title and description */}
            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              {bundle.name}
            </h3>
            <p className="text-gray-200 text-sm mb-4 line-clamp-2 leading-relaxed">
              {bundle.description}
            </p>

            {/* Price and CTA section */}
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-400">
                  ${bundle.totalPrice}
                </div>
                <div className="text-sm text-gray-400 line-through">
                  ${bundle.originalPrice}
                </div>
              </div>

              <Link href={`/bundles/${bundle.slug}`}>
                <Button 
                  className={cn(
                    "bg-gradient-to-r from-amber-500 to-yellow-500",
                    "hover:from-amber-600 hover:to-yellow-600",
                    "text-black font-semibold px-6",
                    "shadow-lg hover:shadow-xl",
                    "transition-all duration-300",
                    "group/btn"
                  )}
                >
                  View Bundle
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Bundle components mini preview */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Includes:</span>
                  <div className="flex -space-x-2">
                    {[bundle.suit, bundle.shirt, bundle.tie].filter(Boolean).map((item, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 overflow-hidden"
                      >
                        <Image
                          src={item!.image}
                          alt=""
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* View count */}
                {bundle.views && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs">{bundle.views}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hover effects - subtle glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(212,175,55,0.1) 0%, transparent 70%)'
          }}
        />
      </div>
    </motion.div>
  );
}