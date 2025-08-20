'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { tieProducts } from '@/lib/products/tieProducts';

export default function TiesCollectionPage() {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Premium Ties & Bowties Collection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Explore our extensive collection of silk ties and bowties in over 30 colors. 
              Available in Classic, Skinny, Slim, and Bowtie styles.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Bundle Promotion Banner */}
      <section className="bg-blue-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-medium">
            🎉 Bundle & Save: Buy 4 Get 1 Free | Buy 6 Get 2 Free | Buy 8 Get 3 Free
          </p>
        </div>
      </section>

      {/* Colors Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Choose Your Color
            </h2>
            <p className="text-gray-600">
              Click any color to explore all available styles
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {tieProducts.colors.map((color, index) => (
              <motion.div
                key={color.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <Link
                  href={`/collections/ties/${color.id}-collection`}
                  className="group block relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                  onMouseEnter={() => setHoveredColor(color.id)}
                  onMouseLeave={() => setHoveredColor(null)}
                >
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={color.imageUrl}
                      alt={color.displayName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.66vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-medium text-sm">{color.name}</h3>
                    <p className="text-xs opacity-90">4 Styles Available</p>
                  </div>

                  {/* Color indicator */}
                  <div 
                    className="absolute top-3 right-3 w-8 h-8 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: color.hex }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">30+ Colors</h3>
              <p className="text-gray-600">
                From classic navy to vibrant coral, find the perfect color for any occasion
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">4 Styles</h3>
              <p className="text-gray-600">
                Classic (3.5"), Skinny (2.75"), Slim (2.25"), and Pre-tied Bowties
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Bundle Savings</h3>
              <p className="text-gray-600">
                Save up to 27% with our mix & match bundle deals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide Preview */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Tie Style Guide</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="w-16 h-32 bg-gray-700 mx-auto rounded" />
                </div>
                <h3 className="font-bold">Classic</h3>
                <p className="text-sm text-gray-600">3.5" width</p>
                <p className="text-xs mt-1">Traditional formal</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="w-12 h-32 bg-gray-700 mx-auto rounded" />
                </div>
                <h3 className="font-bold">Skinny</h3>
                <p className="text-sm text-gray-600">2.75" width</p>
                <p className="text-xs mt-1">Modern professional</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="w-8 h-32 bg-gray-700 mx-auto rounded" />
                </div>
                <h3 className="font-bold">Slim</h3>
                <p className="text-sm text-gray-600">2.25" width</p>
                <p className="text-xs mt-1">Fashion-forward</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="w-20 h-12 bg-gray-700 mx-auto rounded-full" />
                </div>
                <h3 className="font-bold">Bowtie</h3>
                <p className="text-sm text-gray-600">Adjustable</p>
                <p className="text-xs mt-1">Black-tie events</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}