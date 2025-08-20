'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Users, Calculator, Sparkles, Calendar, TrendingUp, ShoppingBag, Star, Play, Video } from 'lucide-react';
import { Product } from '@/lib/types';
import Link from 'next/link';

interface School {
  id: string;
  name: string;
  location: string;
  promDate: Date;
  colors: string[];
  studentCount: number;
}

interface PromPackage {
  id: string;
  name: string;
  description: string;
  products: Product[];
  basePrice: number;
  image: string;
  features: string[];
}

interface GroupDiscount {
  minSize: number;
  discount: number;
  description: string;
}

interface PromHubProps {
  schools: School[];
  packages: PromPackage[];
  popularProducts: Product[];
  onSchoolSelect: (school: School) => void;
  onPackageSelect: (pkg: PromPackage, groupSize: number) => void;
  onAddToCart: (products: Product[]) => void;
}

export function PromHub({ 
  schools, 
  packages, 
  popularProducts,
  onSchoolSelect, 
  onPackageSelect,
  onAddToCart 
}: PromHubProps) {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [groupSize, setGroupSize] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<PromPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'schools' | 'packages' | 'calculator'>('schools');

  const groupDiscounts: GroupDiscount[] = [
    { minSize: 1, discount: 0, description: 'Individual rental' },
    { minSize: 3, discount: 10, description: 'Small group savings' },
    { minSize: 5, discount: 15, description: 'Squad discount' },
    { minSize: 10, discount: 20, description: 'Class group rate' },
    { minSize: 20, discount: 25, description: 'Maximum savings!' },
  ];

  const getCurrentDiscount = () => {
    return groupDiscounts
      .filter(d => groupSize >= d.minSize)
      .sort((a, b) => b.discount - a.discount)[0];
  };

  const calculateDiscountedPrice = (basePrice: number) => {
    const discount = getCurrentDiscount();
    return basePrice * (1 - discount.discount / 100);
  };

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    onSchoolSelect(school);
    setActiveTab('packages');
  };

  const upcomingProms = schools
    .filter(s => new Date(s.promDate) > new Date())
    .sort((a, b) => new Date(a.promDate).getTime() - new Date(b.promDate).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <GraduationCap className="w-10 h-10 text-gold" />
          <h1 className="text-4xl font-serif">Prom Central 2024</h1>
          <Sparkles className="w-10 h-10 text-gold" />
        </motion.div>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Look your best on prom night with our exclusive packages and group discounts. 
          Find your school, build your group, and save big!
        </p>
        
        {/* TikTok-Style Video Inspiration */}
        <Link href="/prom/videos">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <Play className="w-6 h-6" />
            <span>Get Inspired</span>
            <Video className="w-6 h-6" />
          </motion.div>
        </Link>
        <p className="text-sm text-gray-500 mt-2">
          Swipe through TikTok-style videos for prom inspiration
        </p>
      </div>

      <div className="bg-gradient-to-r from-gold to-gold/80 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-black">
            <h3 className="text-2xl font-bold mb-1">Group Discount Calculator</h3>
            <p className="text-black/70">The more friends, the more you save!</p>
          </div>
          <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-1">Group Size</label>
              <input
                type="number"
                min="1"
                max="50"
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                className="w-24 px-3 py-2 rounded border-0 text-center font-bold text-xl"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-black/70">Your Discount</p>
              <p className="text-3xl font-bold text-black">{getCurrentDiscount().discount}% OFF</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b">
        {(['schools', 'packages', 'calculator'] as const).map((tab) => {
          const icons = {
            schools: GraduationCap,
            packages: ShoppingBag,
            calculator: Calculator,
          };
          const Icon = icons[tab];
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-gold text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === 'schools' && (
        <div>
          <div className="mb-8">
            <h3 className="text-2xl font-serif mb-4">Find Your School</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schools.map((school, index) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSchoolSelect(school)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold mb-1">{school.name}</h4>
                        <p className="text-sm text-gray-600">{school.location}</p>
                      </div>
                      <GraduationCap className="w-8 h-8 text-gold group-hover:scale-110 transition-transform" />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">
                        {new Date(school.promDate).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {school.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{school.studentCount} students</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-3 text-center group-hover:bg-gold/10 transition-colors">
                    <p className="text-sm font-medium text-gold">View Packages →</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Upcoming Proms
            </h3>
            <div className="space-y-3">
              {upcomingProms.map((school) => {
                const daysUntil = Math.ceil((new Date(school.promDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={school.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-gray-600">{school.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(school.promDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">{daysUntil} days</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'packages' && (
        <div>
          {selectedSchool && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Selected School</p>
              <h3 className="text-xl font-semibold">{selectedSchool.name}</h3>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-gold text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {pkg.name}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>

                  <div className="space-y-2 mb-4">
                    {pkg.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-gold flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">
                        ${(calculateDiscountedPrice(pkg.basePrice) / 100).toFixed(2)}
                      </span>
                      {getCurrentDiscount().discount > 0 && (
                        <span className="text-lg text-gray-500 line-through">
                          ${(pkg.basePrice / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {groupSize > 1 && (
                      <p className="text-sm text-green-600 mt-1">
                        {getCurrentDiscount().discount}% group discount applied!
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedPackage(pkg);
                      onPackageSelect(pkg, groupSize);
                    }}
                    className="w-full bg-gold hover:bg-gold/90 text-black px-4 py-2 rounded-sm font-semibold transition-colors"
                  >
                    Select Package
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-serif mb-6">Popular Prom Picks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                  onClick={() => onAddToCart([product])}
                >
                  <div className="aspect-square relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                    <p className="text-lg font-bold">${(product.price / 100).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-black to-gray-800 p-8 text-white">
              <h3 className="text-2xl font-serif mb-2">Group Savings Calculator</h3>
              <p className="text-white/80">See how much your squad can save together!</p>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-4">How many in your group?</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${(groupSize / 30) * 100}%, #E5E7EB ${(groupSize / 30) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>1</span>
                  <span>15</span>
                  <span>30</span>
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-6xl font-bold text-gold mb-2">{groupSize}</p>
                <p className="text-gray-600">People in your group</p>
              </div>

              <div className="space-y-3 mb-8">
                {groupDiscounts.map((discount) => (
                  <div
                    key={discount.minSize}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      groupSize >= discount.minSize
                        ? 'border-gold bg-gold/10'
                        : 'border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{discount.minSize}+ People</p>
                        <p className="text-sm text-gray-600">{discount.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gold">{discount.discount}%</p>
                        <p className="text-sm text-gray-600">Discount</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold mb-4">Example Savings</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Classic Tux Package</span>
                    <div className="text-right">
                      <span className="text-gray-500 line-through mr-2">$199</span>
                      <span className="font-bold">${(calculateDiscountedPrice(19900) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Package</span>
                    <div className="text-right">
                      <span className="text-gray-500 line-through mr-2">$299</span>
                      <span className="font-bold">${(calculateDiscountedPrice(29900) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Group Savings</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${((19900 * groupSize * getCurrentDiscount().discount / 100) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPackage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-serif mb-4">Package Selected!</h3>
              <p className="text-gray-600 mb-6">
                {selectedPackage.name} has been selected for your group of {groupSize}.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span>Package Price</span>
                  <span>${(selectedPackage.basePrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Group Discount</span>
                  <span>-{getCurrentDiscount().discount}%</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Final Price</span>
                  <span>${(calculateDiscountedPrice(selectedPackage.basePrice) / 100).toFixed(2)}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onAddToCart(selectedPackage.products);
                  setSelectedPackage(null);
                }}
                className="w-full bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-sm font-semibold transition-colors"
              >
                Continue to Checkout
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}