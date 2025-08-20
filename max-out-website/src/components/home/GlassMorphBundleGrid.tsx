'use client';

import { GlassMorphBundleCard } from './GlassMorphBundleCard';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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
  suit?: { name: string; image: string };
  shirt?: { name: string; image: string };
  tie?: { name: string; image: string };
}

interface GlassMorphBundleGridProps {
  bundles: Bundle[];
  title?: string;
  subtitle?: string;
}

export function GlassMorphBundleGrid({ 
  bundles, 
  title = "Premium Bundle Collection",
  subtitle = "Expertly curated outfits with exclusive savings"
}: GlassMorphBundleGridProps) {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      
      {/* Ambient lighting effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-burgundy/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container-main">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-amber-400 mb-4"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Curated Collections</span>
            <Sparkles className="w-5 h-5" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif text-white mb-3"
          >
            {title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Bundle cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {bundles.map((bundle, index) => (
            <GlassMorphBundleCard
              key={bundle.id}
              bundle={{
                ...bundle,
                views: bundle.views || Math.floor(Math.random() * 500) + 100
              }}
              index={index}
            />
          ))}
        </div>

        {/* Optional: Comparison with old design */}
        {bundles.length === 0 && (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-400">No bundles available</p>
          </div>
        )}
      </div>
    </section>
  );
}