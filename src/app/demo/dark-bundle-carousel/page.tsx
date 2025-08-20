'use client';

import { EnhancedDarkBundleCarousel } from '@/components/home/EnhancedDarkBundleCarousel';
import { BundleCarouselTheater } from '@/components/home/BundleCarouselTheater';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Enhanced bundle data with all new properties for demo
const enhancedBundles = [
  {
    id: 'enhanced-bundle-1',
    name: 'Executive Power Bundle',
    description: 'Navy suit, white shirt, burgundy tie - perfect for boardroom dominance and client meetings',
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
    featured: true,
    popularity: 95,
    rating: 4.9,
    trending: true,
    aiScore: 98
  },
  {
    id: 'enhanced-bundle-2',
    name: 'Wedding Classic Bundle',
    description: 'Charcoal suit, light blue shirt, silver tie - timeless wedding elegance',
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
    popularity: 88,
    rating: 4.8,
    limitedStock: true
  },
  {
    id: 'enhanced-bundle-3',
    name: 'Power Player Premium',
    description: 'Navy 3-piece suit, white shirt, red tie - command the room with executive presence',
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
    popularity: 92,
    rating: 4.7,
    trending: true
  },
  {
    id: 'enhanced-bundle-4',
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
    popularity: 90,
    rating: 4.6,
    aiScore: 95
  },
  {
    id: 'enhanced-bundle-5',
    name: 'Rose Gold Elegance',
    description: 'Light grey suit, pink shirt, navy tie - modern sophistication meets classic style',
    totalPrice: 219.99,
    originalPrice: 259.99,
    savings: 40,
    suit: {
      name: 'Light Grey Suit',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/grey-pink-navy.png'
    },
    shirt: {
      name: 'Pink Shirt',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light%20Pink-Dress-Shirt.jpg'
    },
    tie: {
      name: 'Navy Tie',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/navy.jpg'
    },
    modelImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/grey-pink-navy.png',
    slug: 'rose-gold-elegance',
    popularity: 85,
    rating: 4.8,
    trending: true,
    limitedStock: true
  }
];

export default function DarkBundleCarouselDemo() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Dark Bundle Carousel</h1>
              <p className="text-sm text-gray-600">Premium dark mode with luxurious interactions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={showComparison ? "default" : "outline"}
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              {showComparison ? 'Show Dark Only' : 'Compare Versions'}
            </Button>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Premium Dark Mode Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Experience the luxury of sophisticated dark design with enhanced interactivity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Moon className="w-6 h-6" />,
                title: 'Dark Luxury Theme',
                description: 'Rich charcoal backgrounds with gold/burgundy accents'
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Glass Morphism',
                description: 'Translucent surfaces with backdrop blur effects'
              },
              {
                icon: '🎭',
                title: '3D Transforms',
                description: 'Cards rotate and tilt with mouse movement'
              },
              {
                icon: '✨',
                title: 'Ambient Particles',
                description: 'Floating animations and premium micro-interactions'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Dark Mode Carousel */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gray-900 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Enhanced Dark Mode Version
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Premium Bundle Carousel Experience
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hover over cards to see 3D effects, parallax movement, and quick-view components. 
              The carousel features ambient particles, glass morphism, and smooth momentum scrolling.
            </p>
          </div>

          <EnhancedDarkBundleCarousel 
            bundles={enhancedBundles} 
            autoPlay={true}
            showParticles={true}
          />
        </div>
      </section>

      {/* Comparison Section */}
      {showComparison && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sun className="w-4 h-4" />
                Original Light Mode Version
                <Sun className="w-4 h-4" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Original Bundle Carousel
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Compare with the original light mode implementation to see the enhanced features and premium feel.
              </p>
            </div>

            <BundleCarouselTheater bundles={enhancedBundles.slice(0, 4)} />
          </div>
        </section>
      )}

      {/* Technical Details */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Enhanced Features Implementation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Visual Enhancements</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Glass morphism cards with backdrop blur</li>
                <li>• Ambient particle system with floating animations</li>
                <li>• Dynamic gradient backgrounds that change with bundles</li>
                <li>• Premium gold/burgundy color scheme</li>
                <li>• Smooth 3D perspective transforms</li>
                <li>• Layered lighting effects and shadows</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Interactive Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Mouse-tracking parallax effects</li>
                <li>• Card rotation and tilt on hover</li>
                <li>• Quick-view component previews</li>
                <li>• Momentum-based scrolling</li>
                <li>• Progressive blur for depth perception</li>
                <li>• Touch-friendly mobile gestures</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Premium Information Display</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Floating "Bundle of the Week" badges</li>
                <li>• Trending indicators with flame icons</li>
                <li>• Limited stock alerts</li>
                <li>• Star ratings and popularity scores</li>
                <li>• AI recommendation scores</li>
                <li>• Animated savings badges</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Performance & Accessibility</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• GPU-optimized CSS transforms</li>
                <li>• Lazy loading for optimal performance</li>
                <li>• Reduced motion support</li>
                <li>• High contrast mode compatibility</li>
                <li>• Screen reader friendly</li>
                <li>• Keyboard navigation support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Implementation Guide</h2>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">To integrate the enhanced carousel:</h3>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div className="mb-2">// Replace the existing BundleCarouselTheater import</div>
              <div className="text-white">import {'{ EnhancedDarkBundleCarousel }'} from '@/components/home/EnhancedDarkBundleCarousel';</div>
              <div className="mt-4 mb-2">// Update the component usage</div>
              <div className="text-white">
                {'<EnhancedDarkBundleCarousel'}<br/>
                {'  bundles={featuredBundles}'}<br/>
                {'  autoPlay={true}'}<br/>
                {'  showParticles={true}'}<br/>
                {'/>'}
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The enhanced carousel includes all premium features like glass morphism, 
                3D transforms, particle effects, and luxury theming. It's fully responsive and maintains 
                the KCT brand identity with gold and burgundy accents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}