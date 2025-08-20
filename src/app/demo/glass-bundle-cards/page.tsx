'use client';

import { useState } from 'react';
import { GlassMorphBundleGrid } from '@/components/home/GlassMorphBundleGrid';
import { GlassMorphBundleCard } from '@/components/home/GlassMorphBundleCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Sample bundles with all the data
const sampleBundles = [
  {
    id: 'bundle-1',
    name: 'Executive Power Bundle',
    description: 'Navy suit, white shirt, burgundy tie - perfect for boardroom dominance',
    totalPrice: 229.99,
    originalPrice: 269.99,
    savings: 40,
    suit: {
      name: 'Navy Suit',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png'
    },
    shirt: {
      name: 'White Shirt',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg'
    },
    tie: {
      name: 'Burgundy Tie',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg'
    },
    modelImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png',
    slug: 'executive-power',
    rating: 4.9,
    views: 342
  },
  {
    id: 'bundle-2',
    name: 'Wedding Classic',
    description: 'Charcoal suit, light blue shirt, silver tie - timeless elegance',
    totalPrice: 249.99,
    originalPrice: 299.99,
    savings: 50,
    suit: {
      name: 'Charcoal Suit',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-blue-silver.png'
    },
    shirt: {
      name: 'Light Blue Shirt',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light-Blue-Dress-Shirt.jpg'
    },
    tie: {
      name: 'Silver Tie',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/silver.jpg'
    },
    modelImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-blue-silver.png',
    slug: 'wedding-classic',
    rating: 4.8,
    views: 287
  },
  {
    id: 'bundle-3',
    name: 'Power Player Premium',
    description: 'Navy 3-piece suit, white shirt, red tie - command the room',
    totalPrice: 249.99,
    originalPrice: 299.99,
    savings: 50,
    suit: {
      name: 'Navy 3-Piece Suit',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-3p-white-red.png'
    },
    shirt: {
      name: 'White Shirt',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg'
    },
    tie: {
      name: 'Red Tie',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/red.jpg'
    },
    modelImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-3p-white-red.png',
    slug: 'power-player',
    rating: 4.7,
    views: 198
  },
  {
    id: 'bundle-4',
    name: 'Triple Black Signature',
    description: 'Black suit, black shirt, black tie - bold fashion statement for evening events',
    totalPrice: 229.99,
    originalPrice: 269.99,
    savings: 40,
    suit: {
      name: 'Black Suit',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png'
    },
    shirt: {
      name: 'Black Shirt',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Black-Dress-Shirt.jpg'
    },
    tie: {
      name: 'Black Tie',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/black.jpg'
    },
    modelImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png',
    slug: 'triple-black',
    rating: 4.6,
    views: 412
  }
];

export default function GlassBundleCardsDemo() {
  const [showGrid, setShowGrid] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Glass Morphism Bundle Cards</h1>
              <p className="text-sm text-gray-400">Premium card design with component preview</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowGrid(!showGrid)}
            variant="outline"
            className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
          >
            {showGrid ? <Eye className="w-4 h-4 mr-2" /> : <Layers className="w-4 h-4 mr-2" />}
            {showGrid ? 'Single View' : 'Grid View'}
          </Button>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-gradient-to-r from-amber-900/20 via-yellow-900/20 to-amber-900/20 px-6 py-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Enhanced Bundle Card Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Glass morphism design with interactive component previews and cleaner information hierarchy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-amber-400" />,
                title: 'Glass Morphism',
                description: 'Translucent backgrounds with beautiful blur effects'
              },
              {
                icon: '🖼️',
                title: 'Component Preview',
                description: 'Hover to see individual suit, shirt, and tie images'
              },
              {
                icon: '✨',
                title: 'Clean Layout',
                description: 'Less text clutter, focus on visuals and key information'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Section */}
      {showGrid ? (
        <GlassMorphBundleGrid bundles={sampleBundles} />
      ) : (
        <section className="py-20">
          <div className="container-main">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-amber-400 mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-widest uppercase">Single Card Demo</span>
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Interactive Bundle Card
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Hover over the card to see component previews on the left. 
                Hover over each component to see it on the model.
              </p>
            </div>

            <div className="flex justify-center">
              <GlassMorphBundleCard bundle={sampleBundles[3]} index={0} />
            </div>

            {/* Comparison notes */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-6">Design Improvements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                  <h4 className="font-semibold text-green-400 mb-3">✓ New Glass Morphism Design</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Visual component previews on hover</li>
                    <li>• Interactive image switching</li>
                    <li>• Clean, modern glass effect</li>
                    <li>• Floating mini previews at bottom</li>
                    <li>• Subtle animations and transitions</li>
                    <li>• Better visual hierarchy</li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-500/30">
                  <h4 className="font-semibold text-gray-400 mb-3">Previous Design</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Solid backgrounds</li>
                    <li>• Text-heavy descriptions</li>
                    <li>• No component visibility</li>
                    <li>• Less interactive</li>
                    <li>• Standard card layout</li>
                    <li>• More cluttered information</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}