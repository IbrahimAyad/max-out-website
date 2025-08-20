'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Heart, Share2, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SizeBotIntegration } from '@/components/products/SizeBotIntegration';

export default function SizeBotProductDemo() {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState('Navy');

  const sizes = ['36S', '38S', '38R', '40R', '40L', '42R', '42L', '44R', '46R', '48R'];
  const colors = ['Navy', 'Charcoal', 'Black', 'Grey'];

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src="https://kct-menswear.s3.us-east-2.amazonaws.com/products/suits/navy-suit-1.jpg"
                alt="Navy Suit"
                fill
                className="object-cover"
              />
              <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={`https://kct-menswear.s3.us-east-2.amazonaws.com/products/suits/navy-suit-${i}.jpg`}
                    alt={`Navy Suit ${i}`}
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-serif text-gray-900 mb-2">
                Premium Navy Wool Suit
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                  <span className="ml-2 text-gray-600">(124 reviews)</span>
                </div>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">$699</span>
                <span className="text-xl text-gray-500 line-through">$899</span>
                <span className="text-burgundy font-medium">Save 22%</span>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedColor === color
                        ? 'border-burgundy bg-burgundy/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Size Bot Integration */}
            <SizeBotIntegration
              productType="suit"
              selectedSize={selectedSize}
              onSizeSelect={setSelectedSize}
            />

            {/* Traditional Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Or select size manually
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-lg border-2 transition-all font-medium ${
                      selectedSize === size
                        ? 'border-burgundy bg-burgundy text-white'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-burgundy hover:bg-burgundy-700 text-white"
                disabled={!selectedSize}
              >
                {selectedSize ? `Add to Cart - Size ${selectedSize}` : 'Select a Size'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
              >
                Book In-Store Fitting
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500">Orders over $500</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">Quality Guarantee</p>
                <p className="text-xs text-gray-500">Premium materials</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-500">30-day policy</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                Crafted from premium Super 120s wool, this navy suit epitomizes timeless elegance. 
                The half-canvas construction ensures excellent drape and longevity, while the classic 
                notch lapel and two-button closure create a versatile silhouette perfect for both 
                business and special occasions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}