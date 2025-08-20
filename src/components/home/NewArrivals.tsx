'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample new arrivals data - in a real app this would come from your API/database
const newArrivals = [
  {
    id: 1,
    name: "Navy Premium Wool Suit",
    price: 795,
    originalPrice: 895,
    image: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public",
    category: "Suits",
    isNew: true,
    daysOld: 2
  },
  {
    id: 2,
    name: "Burgundy Silk Tie Collection",
    price: 45,
    originalPrice: 65,
    image: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/aa23aaf9-ea00-430e-4436-15b8ad71db00/public",
    category: "Accessories",
    isNew: true,
    daysOld: 1
  },
  {
    id: 3,
    name: "Modern Slim Fit Tuxedo",
    price: 1195,
    originalPrice: 1395,
    image: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/e5f26504-4bf5-434a-e115-fab5edaa0b00/public",
    category: "Formal Wear",
    isNew: true,
    daysOld: 3
  },
  {
    id: 4,
    name: "Italian Cotton Dress Shirts",
    price: 95,
    originalPrice: 125,
    image: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public",
    category: "Shirts",
    isNew: true,
    daysOld: 5
  }
];

export function NewArrivals() {
  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-burgundy rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container-main relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-burgundy mb-6"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Just Arrived</span>
            <Sparkles className="h-5 w-5" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif mb-6 leading-tight"
          >
            New Arrivals
            <span className="text-gold block mt-2">Fresh & Sophisticated</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the latest additions to our curated collection. Each piece carefully selected 
            for the modern gentleman who values timeless elegance with contemporary flair.
          </motion.p>
        </div>

        {/* New Arrivals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {newArrivals.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gold/30">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* New Badge */}
                  {item.isNew && (
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-burgundy text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        NEW
                      </span>
                      {item.daysOld <= 3 && (
                        <span className="bg-black/80 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.daysOld}d ago
                        </span>
                      )}
                    </div>
                  )}

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white text-black border-white hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Quick View
                    </Button>
                  </div>

                  {/* Sale Badge */}
                  {item.originalPrice > item.price && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        SALE
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      {item.category}
                    </p>
                    <span className="text-xs text-burgundy font-semibold">
                      ⭐ Premium
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-burgundy transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                    {item.originalPrice > item.price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                          -${item.originalPrice - item.price}
                        </span>
                      </>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full bg-gray-900 hover:bg-burgundy text-white transition-all duration-300 group-hover:scale-105"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif mb-4 text-gray-900">
              Explore Our Complete Collection
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              From business essentials to black-tie elegance, discover over 500+ premium pieces 
              crafted for the discerning gentleman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-burgundy hover:bg-burgundy-700 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Shop All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products?filter=new">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:border-burgundy hover:text-burgundy px-10 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  View All New Items
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Free shipping on orders over $500 • 30-day returns • Expert alterations included
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}