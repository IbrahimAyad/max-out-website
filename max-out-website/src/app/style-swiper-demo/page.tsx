'use client';

import { useState } from 'react';
import { StyleSwiper } from '@/components/style/StyleSwiper';
import { EnhancedStyleSwiper } from '@/components/style/EnhancedStyleSwiper';
import { Product } from '@/lib/types';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

// Mock products for demo
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Navy Blue Three-Piece Suit',
    description: 'Classic elegance meets modern tailoring',
    price: 89900,
    category: 'suits',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Navy'],
    tags: ['formal', 'business', 'wedding'],
    inStock: true
  },
  {
    id: '2',
    name: 'Charcoal Grey Tuxedo',
    description: 'Sophisticated black-tie elegance',
    price: 129900,
    category: 'tuxedos',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
    sizes: ['38', '40', '42'],
    colors: ['Charcoal'],
    tags: ['formal', 'wedding', 'black-tie'],
    inStock: true
  },
  {
    id: '3',
    name: 'Light Blue Dress Shirt',
    description: 'Crisp cotton for any occasion',
    price: 12900,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Light Blue'],
    tags: ['business', 'casual'],
    inStock: true
  },
  {
    id: '4',
    name: 'Burgundy Velvet Blazer',
    description: 'Make a statement at any event',
    price: 59900,
    category: 'blazers',
    images: ['https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=800'],
    sizes: ['38', '40', '42'],
    colors: ['Burgundy'],
    tags: ['formal', 'party', 'wedding'],
    inStock: true
  },
  {
    id: '5',
    name: 'Black Silk Bow Tie',
    description: 'The perfect finishing touch',
    price: 7900,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1558040351-0f4537e0a52b?w=800'],
    sizes: ['One Size'],
    colors: ['Black'],
    tags: ['formal', 'wedding', 'black-tie'],
    inStock: true
  }
];

export default function StyleSwiperDemoPage() {
  const [version, setVersion] = useState<'original' | 'enhanced'>('original');
  const [swipeData, setSwipeData] = useState<any[]>([]);
  const [completedProfiles, setCompletedProfiles] = useState<any[]>([]);

  const handleSwipe = (product: Product, direction: 'left' | 'right', velocity?: number) => {
    setSwipeData(prev => [...prev, {
      product: product.name,
      direction,
      velocity,
      timestamp: Date.now()
    }]);
  };

  const handleComplete = (likedProducts: Product[], analytics?: any) => {
    setCompletedProfiles(prev => [...prev, { likedProducts, analytics, version }]);
  };

  const resetDemo = () => {
    setSwipeData([]);
    setCompletedProfiles([]);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4">Style Swiper Comparison</h1>
          <p className="text-gray-600 mb-8">Experience the difference between our original and enhanced style discovery</p>
          
          {/* Version Toggle */}
          <div className="inline-flex bg-white rounded-full shadow-lg p-1">
            <button
              onClick={() => setVersion('original')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                version === 'original' 
                  ? 'bg-amber-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setVersion('enhanced')}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                version === 'enhanced' 
                  ? 'bg-amber-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Enhanced <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Swiper Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-serif mb-2">
                {version === 'original' ? 'Original Style Swiper' : 'Enhanced Style Swiper'}
              </h2>
              <p className="text-gray-600">
                {version === 'original' 
                  ? 'Basic swipe interactions with simple animations'
                  : 'Advanced gestures, haptics, and rich animations'
                }
              </p>
            </div>
            
            <div key={version}>
              {version === 'original' ? (
                <StyleSwiper
                  products={mockProducts}
                  onSwipe={handleSwipe}
                  onComplete={handleComplete}
                />
              ) : (
                <EnhancedStyleSwiper
                  products={mockProducts}
                  onSwipe={handleSwipe}
                  onComplete={handleComplete}
                  enableHaptics={true}
                  preloadImages={true}
                />
              )}
            </div>
          </div>

          {/* Features & Analytics */}
          <div className="space-y-6">
            {/* Feature Comparison */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-serif mb-4">Feature Comparison</h3>
              
              <div className="space-y-3">
                <FeatureRow 
                  feature="Swipe Threshold" 
                  original="100px fixed" 
                  enhanced="50px + velocity detection"
                  isEnhanced={version === 'enhanced'}
                />
                <FeatureRow 
                  feature="Animations" 
                  original="Basic spring" 
                  enhanced="Advanced transforms + overlays"
                  isEnhanced={version === 'enhanced'}
                />
                <FeatureRow 
                  feature="Haptic Feedback" 
                  original="None" 
                  enhanced="Multi-pattern haptics"
                  isEnhanced={version === 'enhanced'}
                />
                <FeatureRow 
                  feature="Gesture Support" 
                  original="Drag + buttons" 
                  enhanced="Drag + velocity + super like"
                  isEnhanced={version === 'enhanced'}
                />
                <FeatureRow 
                  feature="Visual Feedback" 
                  original="Exit animation only" 
                  enhanced="Real-time color overlays"
                  isEnhanced={version === 'enhanced'}
                />
                <FeatureRow 
                  feature="Analytics" 
                  original="Basic completion" 
                  enhanced="Detailed swipe analytics"
                  isEnhanced={version === 'enhanced'}
                />
                <FeatureRow 
                  feature="Undo Support" 
                  original="Previous button" 
                  enhanced="Smart undo with history"
                  isEnhanced={version === 'enhanced'}
                />
                <FeatureRow 
                  feature="Performance" 
                  original="Standard" 
                  enhanced="Image preloading + optimization"
                  isEnhanced={version === 'enhanced'}
                />
              </div>
            </div>

            {/* Live Swipe Data */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-serif mb-4">Live Swipe Data</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {swipeData.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Start swiping to see data</p>
                ) : (
                  swipeData.slice(-5).reverse().map((data, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm font-medium">{data.product}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${data.direction === 'right' ? 'text-green-600' : 'text-red-600'}`}>
                          {data.direction === 'right' ? 'Liked' : 'Passed'}
                        </span>
                        {data.velocity && (
                          <span className="text-xs text-gray-500">
                            {Math.abs(data.velocity).toFixed(0)}px/s
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-amber-50 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-serif mb-4">Try These Actions</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5" />
                  <span>Swipe slowly to see color overlays (Enhanced)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5" />
                  <span>Try fast swipes for velocity detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5" />
                  <span>Use the ⚡ button for super likes (Enhanced)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5" />
                  <span>Try the undo button to go back</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5" />
                  <span>Complete the swiper to see analytics</span>
                </li>
              </ul>
              
              <button
                onClick={resetDemo}
                className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>

        {/* Completed Profiles */}
        {completedProfiles.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-serif mb-6">Completed Profiles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {completedProfiles.map((profile, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">
                    {profile.version === 'enhanced' ? 'Enhanced' : 'Original'} Swiper Results
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Liked {profile.likedProducts.length} items
                  </p>
                  {profile.analytics && (
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>Total swipes: {profile.analytics.totalSwipes}</p>
                      <p>Avg swipe time: {(profile.analytics.averageSwipeTime / 1000).toFixed(1)}s</p>
                      <p>Undo count: {profile.analytics.undoCount}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureRow({ feature, original, enhanced, isEnhanced }: {
  feature: string;
  original: string;
  enhanced: string;
  isEnhanced: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b">
      <span className="font-medium text-sm">{feature}</span>
      <div className="text-sm text-right">
        <span className={isEnhanced ? 'text-gray-400' : 'text-gray-900'}>
          {original}
        </span>
        {isEnhanced && (
          <>
            <ArrowRight className="w-3 h-3 inline mx-1 text-amber-600" />
            <span className="text-amber-600 font-medium">{enhanced}</span>
          </>
        )}
      </div>
    </div>
  );
}