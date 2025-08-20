'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, TrendingUp, Eye, Clock, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  trending?: 'up' | 'down' | 'stable';
  views?: number;
  recentlyViewed?: number;
  hotness?: number; // 0-100 scale
}

interface VelocityGridProps {
  products: Product[];
}

export function VelocityGrid({ products }: VelocityGridProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [animatedMetrics, setAnimatedMetrics] = useState<Record<number, number>>({});
  
  // Simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      setAnimatedMetrics(prev => ({
        ...prev,
        [randomProduct.id]: (prev[randomProduct.id] || 0) + Math.floor(Math.random() * 3) + 1
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [products]);

  // Calculate parallax offset based on scroll
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPopularityBar = (product: Product) => {
    const basePopularity = product.hotness || 50;
    const liveBoost = animatedMetrics[product.id] || 0;
    const total = Math.min(basePopularity + liveBoost * 2, 100);
    
    return (
      <div className="absolute top-2 right-2 z-20">
        <div className="bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-red-500" />
            <span className="text-xs font-bold text-gray-700">{total}%</span>
          </div>
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500"
              initial={{ width: `${basePopularity}%` }}
              animate={{ width: `${total}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    );
  };

  const getViewerCount = (product: Product) => {
    const baseViews = product.recentlyViewed || Math.floor(Math.random() * 50) + 10;
    const liveViews = animatedMetrics[product.id] || 0;
    
    return (
      <AnimatePresence>
        {hoveredProduct === product.id && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-2 left-2 right-2 z-30"
          >
            <div className="bg-black/80 backdrop-blur text-white rounded-lg p-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{baseViews + liveViews} viewing now</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>2m ago</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-burgundy via-transparent to-gold animate-gradient-shift" />
      </div>

      {/* Product Grid with parallax rows */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 relative">
        {products.map((product, index) => {
          const row = Math.floor(index / 6);
          const parallaxOffset = row % 2 === 0 ? scrollY * 0.02 : -scrollY * 0.02;
          
          return (
            <motion.div
              key={product.id}
              className="group relative"
              style={{
                transform: `translateY(${parallaxOffset}px)`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link href={`/products/${product.id}`}>
                <div className="bg-white border border-gray-100 overflow-hidden hover:border-burgundy transition-all duration-200 hover:shadow-xl relative">
                  {/* Trending indicator animation */}
                  {product.trending === 'up' && (
                    <motion.div
                      className="absolute top-2 left-2 z-20"
                      animate={{
                        y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Hot
                      </div>
                    </motion.div>
                  )}

                  {/* Popularity bar */}
                  {getPopularityBar(product)}

                  {/* Product image with hover effect */}
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 16vw"
                    />
                    
                    {/* Hover overlay with quick add */}
                    <motion.div
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      whileHover={{ backdropFilter: "blur(2px)" }}
                    >
                      <Button 
                        size="sm" 
                        className="bg-white text-black hover:bg-gray-100 transform scale-90 group-hover:scale-100 transition-transform"
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Quick Add
                      </Button>
                    </motion.div>

                    {/* Hot product flame indicator */}
                    {product.hotness && product.hotness > 80 && (
                      <motion.div
                        className="absolute top-2 right-2"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      >
                        <Flame className="w-5 h-5 text-orange-500 drop-shadow-lg" />
                      </motion.div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="p-2">
                    <h4 className="text-sm font-medium truncate">{product.name}</h4>
                    <p className="text-xs text-gray-600 truncate">{product.category}</p>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm font-bold text-burgundy">${product.price}</div>
                      
                      {/* Live activity indicator */}
                      {animatedMetrics[product.id] && animatedMetrics[product.id] > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-0.5"
                        >
                          {[...Array(Math.min(3, Math.floor(animatedMetrics[product.id] / 3)))].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 h-1 bg-red-500 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                              }}
                              transition={{
                                duration: 1,
                                delay: i * 0.2,
                                repeat: Infinity,
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Viewer count tooltip */}
                  {getViewerCount(product)}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Live activity feed */}
      <div className="mt-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full"
        >
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600">
              {Object.keys(animatedMetrics).length} customers shopping now
            </span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-red-500" />
            <span className="text-xs text-gray-600">
              Trending items updated live
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}