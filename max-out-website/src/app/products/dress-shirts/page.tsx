'use client';

import { useState, useEffect } from 'react';
import { getAllCoreProducts } from '@/lib/config/coreProducts';
import { Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DressShirtsPage() {
  const [shirts, setShirts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all core products and filter for dress shirts
    const coreProducts = getAllCoreProducts();
    const shirtProducts = coreProducts.filter(p => p.category === 'shirts');
    
    // Use the dress shirt products with their images
    const shirtData = shirtProducts.map(shirt => ({
      ...shirt,
      image: shirt.image || 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg',
      displayName: shirt.name.replace(' Dress Shirt', ''),
    }));

    setShirts(shirtData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-burgundy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Premium Dress Shirts</h1>
            <p className="text-xl mb-6">Crisp, refined shirts in classic and slim fits</p>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="font-semibold">$69.99</span> per shirt
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="font-semibold">2 Fits Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Filter by:</span>
              <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                Fit <ChevronDown className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                Color <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="text-gray-600">
              Showing {shirts.length} products
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shirts.map((shirt) => (
            <Link
              key={shirt.id}
              href={`/products/dress-shirts/${shirt.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-80 bg-gray-100">
                  <Image
                    src={shirt.image}
                    alt={shirt.displayName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{shirt.displayName}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-burgundy">
                      ${(shirt.price / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>• Classic & Slim Fit Available</p>
                    <p>• Sizes: 14.5" - 18" Neck</p>
                  </div>
                  <button className="w-full bg-burgundy text-white py-3 rounded-lg hover:bg-burgundy-700 transition-colors font-medium">
                    Select Options
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">About Our Dress Shirts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Made from high-quality cotton blends for comfort and durability</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Perfect Fit</h3>
              <p className="text-gray-600">Available in Classic and Slim fits to suit your preference</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Custom Colors</h3>
              <p className="text-gray-600">Choose any color to match your style and occasion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}