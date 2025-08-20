'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Shirt } from 'lucide-react';
import { dressShirtProducts } from '@/lib/products/dressShirtProducts';

export default function DressShirtsCollectionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Premium Dress Shirts
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Elevate your wardrobe with our collection of premium dress shirts. 
              Available in 17 colors with both Slim and Classic fits.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex flex-wrap justify-center gap-4 text-sm"
            >
              <div className="flex items-center space-x-2">
                <Shirt className="w-5 h-5 text-blue-600" />
                <span className="font-medium">17 Colors</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">2 Fits: Slim & Classic</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-green-600">$39.99 Each</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fit Comparison */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your Fit</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Slim Cut</h3>
              <p className="text-gray-600 mb-4">
                Modern tailored fit that follows the natural lines of the body. 
                Perfect for a contemporary, streamlined look.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Tapered through the body</li>
                <li>• Narrower sleeves</li>
                <li>• Sizes: S, M, L, XL, XXL</li>
                <li>• Best for: Modern professional settings</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Classic Fit</h3>
              <p className="text-gray-600 mb-4">
                Traditional relaxed fit with generous room through the body and arms. 
                Ideal for all-day comfort.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Relaxed through chest and waist</li>
                <li>• Fuller cut in the body</li>
                <li>• Neck sizes: 15" - 22"</li>
                <li>• Best for: Traditional settings & comfort</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Colors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Available Colors</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {dressShirtProducts.colors.map((color, index) => (
              <motion.div
                key={color.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/collections/dress-shirts/${color.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src={color.imageUrl}
                      alt={`${color.name} Dress Shirt`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Color swatch */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full shadow-lg border-2 border-white" 
                         style={{ backgroundColor: color.hex }} />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white rounded-full p-4 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <ArrowRight className="w-6 h-6 text-gray-900" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h3 className="font-medium text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {color.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      $39.99
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Size Guide CTA */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help Finding Your Size?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our comprehensive size guide helps you find the perfect fit. 
            Whether you prefer the modern Slim Cut or traditional Classic Fit, 
            we have the right size for you.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            View Size Guide
          </button>
        </div>
      </section>
    </div>
  );
}