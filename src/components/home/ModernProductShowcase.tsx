'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  href: string;
}

interface ModernProductShowcaseProps {
  products?: Product[];
}

export function ModernProductShowcase({ products = [] }: ModernProductShowcaseProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <div className="container-main">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="font-serif text-5xl md:text-6xl font-light mb-6 tracking-tight">
          Featured Pieces
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
          Handpicked selections from our latest collection.
          Each piece embodies our commitment to exceptional craftsmanship.
        </p>
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
        {(products || []).map((product, index) => (
          <motion.div
            key={product.id}
            className="group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <Link href={product.href}>
              <div className="relative">
                {/* Product Image */}
                <div className="aspect-[3/4] relative overflow-hidden bg-gray-50 mb-6">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  
                  {/* Subtle overlay on hover */}
                  <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`} />
                </div>

                {/* Product Info */}
                <div className="text-center space-y-2">
                  <motion.h3 
                    className="font-serif text-xl md:text-2xl font-light text-gray-900 transition-colors duration-300 group-hover:text-burgundy"
                    animate={{ 
                      y: hoveredProduct === product.id ? -2 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {product.name}
                  </motion.h3>
                  
                  <motion.div 
                    className="space-y-1"
                    animate={{ 
                      opacity: hoveredProduct === product.id ? 1 : 0.8 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {product.originalPrice ? (
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-lg font-medium text-burgundy">
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-medium text-gray-900">
                        ${product.price}
                      </span>
                    )}
                  </motion.div>

                  {/* Hover CTA */}
                  <motion.div
                    className="pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: hoveredProduct === product.id ? 1 : 0,
                      y: hoveredProduct === product.id ? 0 : 10
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm font-medium text-gray-600 border-b border-gray-300 pb-0.5 transition-colors duration-300 group-hover:text-burgundy group-hover:border-burgundy">
                      View Details
                    </span>
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-20"
      >
        <Link href="/products">
          <motion.button 
            className="group px-8 py-4 bg-transparent border border-gray-300 text-gray-700 hover:border-black hover:text-black transition-all duration-300 font-medium tracking-wide"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Full Collection
            <svg 
              className="w-4 h-4 ml-2 inline transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}