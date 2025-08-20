'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp, Tag } from 'lucide-react';
import { bundleProductsWithImages } from '@/lib/products/bundleProductsWithImages';
import { Button } from '@/components/ui/button';

export function TrendingBundles() {
  // Get the top 3 trending bundles
  const trendingBundles = bundleProductsWithImages.bundles
    .filter(bundle => bundle.trending)
    .slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-red-500 mb-4">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Trending Now</span>
            <TrendingUp className="h-5 w-5" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif mb-6">
            Curated Style
            <span className="text-gold"> Bundles</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expertly matched suit, shirt, and tie combinations. Save up to 15% when you buy the complete look.
          </p>
        </div>

        {/* Trending Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {trendingBundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/bundles/${bundle.id}`}>
                <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={bundle.imageUrl}
                      alt={bundle.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Trending
                      </span>
                      {bundle.aiScore && bundle.aiScore >= 95 && (
                        <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                          AI Pick {bundle.aiScore}%
                        </span>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-white text-sm mb-3 line-clamp-2">
                          {bundle.description}
                        </p>
                        <span className="inline-flex items-center text-white font-semibold">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      {bundle.category.replace('-', ' ')}
                    </p>
                    <h3 className="text-xl font-semibold mb-3">{bundle.name}</h3>
                    
                    {/* Color Combination */}
                    <p className="text-gray-600 mb-4">
                      {bundle.suit.color} • {bundle.shirt.color} • {bundle.tie.color}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">${bundle.bundlePrice}</span>
                        <span className="text-base text-gray-400 line-through">${bundle.originalPrice}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm font-medium">Save ${bundle.savings}</span>
                      </div>
                    </div>

                    {/* Occasions */}
                    <div className="flex flex-wrap gap-2">
                      {bundle.occasions.slice(0, 2).map((occasion) => (
                        <span
                          key={occasion}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                          {occasion}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link href="/bundles">
            <Button 
              size="lg" 
              className="bg-black hover:bg-gray-800 text-white px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              View All 30 Bundles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            Or <Link href="/custom-suits" className="text-black underline font-semibold">create your own custom bundle</Link>
          </p>
        </div>
      </div>
    </section>
  );
}