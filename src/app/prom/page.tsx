'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PromHub } from '@/components/prom/PromHub';
import { Product } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { VideoPlayer } from '@/components/video/VideoPlayer';

// Mock schools data
const mockSchools = [
  {
    id: 's1',
    name: 'Lincoln High School',
    location: 'Detroit, MI',
    promDate: new Date('2024-05-15'),
    colors: ['#003366', '#FFD700'],
    studentCount: 450,
  },
  {
    id: 's2',
    name: 'Roosevelt Academy',
    location: 'Southfield, MI',
    promDate: new Date('2024-05-22'),
    colors: ['#8B0000', '#FFFFFF'],
    studentCount: 380,
  },
  {
    id: 's3',
    name: 'Jefferson High',
    location: 'Dearborn, MI',
    promDate: new Date('2024-05-29'),
    colors: ['#228B22', '#FFD700'],
    studentCount: 520,
  },
  {
    id: 's4',
    name: 'Washington Prep',
    location: 'Ann Arbor, MI',
    promDate: new Date('2024-06-05'),
    colors: ['#4B0082', '#C0C0C0'],
    studentCount: 410,
  },
];

// Mock prom packages
const mockPackages = [
  {
    id: 'p1',
    name: 'Classic Package',
    description: 'Everything you need for a timeless prom look',
    basePrice: 19900,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/a85d3138-06a6-4cf1-57bc-342ccc3f2300/public',
    features: [
      'Classic Black Tuxedo',
      'White Dress Shirt',
      'Black Bow Tie',
      'Pocket Square',
      'Free Alterations',
    ],
    products: [
      {
        id: 'pp1',
        sku: 'PROM-001',
        name: 'Classic Black Tuxedo',
        price: 19900,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/e5f26504-4bf5-434a-e115-fab5edaa0b00/public'],
        category: 'suits' as const,
        stock: { '40R': 20 },
        variants: [],
      },
    ],
  },
  {
    id: 'p2',
    name: 'Premium Package',
    description: 'Stand out with premium fabrics and accessories',
    basePrice: 29900,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/e3c3e87e-6d09-467a-a2f6-91133592ec00/public',
    features: [
      'Designer Tuxedo',
      'Premium Dress Shirt',
      'Silk Bow Tie & Cummerbund',
      'Cufflinks & Studs',
      'Pocket Square',
      'Free Rush Alterations',
    ],
    products: [
      {
        id: 'pp2',
        sku: 'PROM-002',
        name: 'Designer Navy Tuxedo',
        price: 29900,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/e5f26504-4bf5-434a-e115-fab5edaa0b00/public'],
        category: 'suits' as const,
        stock: { '40R': 15 },
        variants: [],
      },
    ],
  },
  {
    id: 'p3',
    name: 'Trendsetter Package',
    description: 'Make a statement with the latest styles',
    basePrice: 34900,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/25a93d0c-f420-4581-9d4e-a7616d71b700/public',
    features: [
      'Fashion-Forward Suit',
      'Patterned Shirt',
      'Unique Accessories',
      'Statement Shoes',
      'Personal Styling Session',
      'Priority Alterations',
    ],
    products: [
      {
        id: 'pp3',
        sku: 'PROM-003',
        name: 'Burgundy Velvet Blazer Set',
        price: 34900,
        images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/e5f26504-4bf5-434a-e115-fab5edaa0b00/public'],
        category: 'suits' as const,
        stock: { '40R': 10 },
        variants: [],
      },
    ],
  },
];

// Mock popular products
const mockPopularProducts: Product[] = [
  {
    id: 'pop1',
    sku: 'ACC-001',
    name: 'Gold Bow Tie Set',
    price: 4900,
    images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/15f54e02-470e-440e-ef72-75bf3e79b400/public'],
    category: 'accessories',
    stock: { 'OS': 50 },
    variants: [],
  },
  {
    id: 'pop2',
    sku: 'ACC-002',
    name: 'Silver Cufflinks',
    price: 3900,
    images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/3a52e2df-c817-46b2-6a35-bed7ca57ea00/public'],
    category: 'accessories',
    stock: { 'OS': 40 },
    variants: [],
  },
  {
    id: 'pop3',
    sku: 'SHO-001',
    name: 'Patent Leather Dress Shoes',
    price: 12900,
    images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/a88c55f3-0bec-4188-0a44-fe4f5c567700/public'],
    category: 'shoes',
    stock: { '10': 15, '11': 15, '12': 15 },
    variants: [],
  },
  {
    id: 'pop4',
    sku: 'ACC-003',
    name: 'Suspenders Set',
    price: 2900,
    images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/aca98635-b699-4bf1-3b8a-2ac3cae2d900/public'],
    category: 'accessories',
    stock: { 'OS': 30 },
    variants: [],
  },
];

export default function PromPage() {
  const [selectedSchool, setSelectedSchool] = useState(null);

  const handleSchoolSelect = (school: any) => {

  };

  const handlePackageSelect = (pkg: any, groupSize: number) => {

  };

  const handleAddToCart = (products: Product[]) => {

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-purple-200/30 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>

            <Link 
              href="/prom/guides" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <BookOpen className="h-4 w-4" />
              Style Guides
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section with Video */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <VideoPlayer
            videoId="6003e03beafc379e3f4fb5b81b703b84"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-600/50 to-indigo-900/80" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-white">
          <div className="text-center px-6 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-2 mb-12"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-16 bg-purple-400" />
                <p className="text-purple-300 text-sm tracking-[0.4em] uppercase font-medium">Make Your Mark</p>
                <div className="h-px w-16 bg-purple-400" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-9xl font-light mb-8 leading-[0.85]"
            >
              Prom
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mt-2 font-normal italic">
                Central
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl lg:text-3xl mb-16 font-light max-w-5xl mx-auto leading-relaxed text-gray-100"
            >
              Stand out on your special night with our curated prom collections, 
              school-specific packages, and exclusive group discounts
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <button className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                Find Your School
              </button>
              <button className="px-12 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-purple-600 rounded-lg transition-all duration-300">
                Browse Packages
              </button>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <div className="flex flex-col items-center gap-3 animate-bounce">
            <span className="text-xs tracking-widest uppercase font-medium">Explore</span>
            <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-8">Why Choose Prom Central?</h2>
            <div className="w-24 h-px bg-purple-300 mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We make prom planning effortless with everything you need in one elegant experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                emoji: '🎓',
                title: 'School Partnerships',
                description: 'Official partnerships with local schools for coordinated group looks and exclusive pricing',
                color: 'from-purple-500 to-purple-600',
                hoverColor: 'group-hover:text-purple-600'
              },
              {
                emoji: '✨',
                title: 'Trending Styles',
                description: 'Stay current with the latest prom trends and social media-worthy looks that photograph beautifully',
                color: 'from-blue-500 to-blue-600',
                hoverColor: 'group-hover:text-blue-600'
              },
              {
                emoji: '💰',
                title: 'Group Savings',
                description: 'Save up to 30% when you coordinate with friends - the bigger the group, the bigger the savings',
                color: 'from-indigo-500 to-indigo-600',
                hoverColor: 'group-hover:text-indigo-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className={`w-24 h-24 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                  <span className="text-4xl">{feature.emoji}</span>
                </div>
                <h3 className={`font-light text-2xl font-semibold mb-4 transition-colors ${feature.hoverColor}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prom Hub */}
      <PromHub
        schools={mockSchools}
        packages={mockPackages}
        popularProducts={mockPopularProducts}
        onSchoolSelect={handleSchoolSelect}
        onPackageSelect={handlePackageSelect}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}