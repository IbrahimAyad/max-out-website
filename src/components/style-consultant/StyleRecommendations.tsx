'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, Save, Share2, Heart, ArrowRight, Check, TrendingUp, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { StyleProfile } from './StyleQuiz';
import { useCart } from '@/hooks/useCart';
import { trackEvent } from '@/components/analytics/PostHogProvider';

interface StyleRecommendation {
  id: string;
  type: 'complete-look' | 'suit' | 'shirt' | 'tie' | 'accessory';
  name: string;
  description: string;
  products: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    color?: string;
    size?: string;
  }[];
  totalPrice: number;
  savings?: number;
  styleScore: number;
  reasoning: string;
  tags: string[];
  aiInsights: string[];
}

interface StyleRecommendationsProps {
  profile: StyleProfile;
  onClose?: () => void;
  onStartOver?: () => void;
}

// Generate recommendations based on profile
function generateRecommendations(profile: StyleProfile): StyleRecommendation[] {
  // This would normally call an AI API, but for now we'll use smart logic
  const recommendations: StyleRecommendation[] = [];
  
  // Generate based on occasion and style
  if (profile.occasion === 'wedding') {
    if (profile.style === 'classic') {
      recommendations.push({
        id: 'wedding-classic-1',
        type: 'complete-look',
        name: 'The Timeless Gentleman',
        description: 'Perfect for wedding guest or groomsman',
        products: [
          {
            id: 'suit-navy-2p',
            name: 'Navy 2-Piece Suit',
            price: 299.99,
            image: 'https://cdn.kctmenswear.com/products/suits/navy/main.png',
            category: 'suit',
            color: 'navy'
          },
          {
            id: 'shirt-white',
            name: 'Crisp White Dress Shirt',
            price: 69.99,
            image: 'https://cdn.kctmenswear.com/products/shirts/white/main.png',
            category: 'shirt',
            color: 'white'
          },
          {
            id: 'tie-burgundy',
            name: 'Burgundy Silk Tie',
            price: 29.99,
            image: 'https://cdn.kctmenswear.com/products/ties/burgundy/main.png',
            category: 'tie',
            color: 'burgundy'
          }
        ],
        totalPrice: 399.97,
        savings: 50,
        styleScore: 95,
        reasoning: 'Navy and burgundy create a sophisticated contrast perfect for weddings. The classic cut ensures timeless elegance.',
        tags: ['wedding-appropriate', 'photogenic', 'versatile'],
        aiInsights: [
          'This combination photographs beautifully in both indoor and outdoor settings',
          'The burgundy tie adds just enough color without being overpowering',
          'You can rewear this suit for business meetings after the wedding'
        ]
      });
    } else if (profile.style === 'modern') {
      recommendations.push({
        id: 'wedding-modern-1',
        type: 'complete-look',
        name: 'The Contemporary Charmer',
        description: 'Modern elegance for special occasions',
        products: [
          {
            id: 'suit-charcoal-3p',
            name: 'Charcoal 3-Piece Suit',
            price: 349.99,
            image: 'https://cdn.kctmenswear.com/products/suits/charcoal-3piece/main.png',
            category: 'suit',
            color: 'charcoal'
          },
          {
            id: 'shirt-light-blue',
            name: 'Light Blue Dress Shirt',
            price: 69.99,
            image: 'https://cdn.kctmenswear.com/products/shirts/light-blue/main.png',
            category: 'shirt',
            color: 'light-blue'
          },
          {
            id: 'tie-silver',
            name: 'Silver Geometric Tie',
            price: 29.99,
            image: 'https://cdn.kctmenswear.com/products/ties/silver/main.png',
            category: 'tie',
            color: 'silver'
          }
        ],
        totalPrice: 449.97,
        savings: 60,
        styleScore: 92,
        reasoning: 'The charcoal suit with light blue creates a fresh, modern look. The vest adds sophistication.',
        tags: ['modern-cut', 'versatile', 'statement-making'],
        aiInsights: [
          'The 3-piece option lets you remove the jacket for the reception',
          'Light blue complements most wedding color schemes',
          'This look works for both day and evening weddings'
        ]
      });
    }
  } else if (profile.occasion === 'prom') {
    recommendations.push({
      id: 'prom-bold-1',
      type: 'complete-look',
      name: 'The Prom King',
      description: 'Stand out on your special night',
      products: [
        {
          id: 'tuxedo-black',
          name: 'Black Tuxedo',
          price: 279.99,
          image: 'https://cdn.kctmenswear.com/products/tuxedos/black/main.png',
          category: 'suit',
          color: 'black'
        },
        {
          id: 'shirt-black',
          name: 'Black Dress Shirt',
          price: 69.99,
          image: 'https://cdn.kctmenswear.com/products/shirts/black/main.png',
          category: 'shirt',
          color: 'black'
        },
        {
          id: 'bowtie-black',
          name: 'Black Silk Bow Tie',
          price: 25.99,
          image: 'https://cdn.kctmenswear.com/products/bowties/black/main.png',
          category: 'tie',
          color: 'black'
        }
      ],
      totalPrice: 375.97,
      savings: 45,
      styleScore: 98,
      reasoning: 'All-black creates a bold, sophisticated statement perfect for prom photos and dancing.',
      tags: ['prom-ready', 'photogenic', 'confident'],
      aiInsights: [
        'Monochromatic black is trending for formal events',
        'This look pairs perfectly with any corsage color',
        'The tuxedo jacket can be removed for comfortable dancing'
      ]
    });
  }
  
  // Add alternative recommendations
  recommendations.push({
    id: 'alt-1',
    type: 'suit',
    name: 'Alternative: Light Grey Option',
    description: 'A softer, more unique choice',
    products: [
      {
        id: 'suit-light-grey',
        name: 'Light Grey Suit',
        price: 299.99,
        image: 'https://cdn.kctmenswear.com/products/suits/light-grey/main.png',
        category: 'suit',
        color: 'light-grey'
      }
    ],
    totalPrice: 299.99,
    styleScore: 88,
    reasoning: 'Light grey offers a fresh alternative to traditional dark suits.',
    tags: ['unique', 'summer-appropriate', 'versatile'],
    aiInsights: [
      'Perfect for outdoor and daytime events',
      'Pairs well with pastel shirts and ties',
      'Less common choice makes you memorable'
    ]
  });
  
  return recommendations;
}

export default function StyleRecommendations({ profile, onClose, onStartOver }: StyleRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [selectedRec, setSelectedRec] = useState<StyleRecommendation | null>(null);
  const [savedLooks, setSavedLooks] = useState<string[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Generate AI recommendations based on profile
    const recs = generateRecommendations(profile);
    setRecommendations(recs);
    setSelectedRec(recs[0]);
    
    // Track AI recommendation usage
    trackEvent.useAIRecommendation('style-consultant');
  }, [profile]);

  const handleAddToCart = (recommendation: StyleRecommendation) => {
    recommendation.products.forEach(product => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: product.size || 'M',
        color: product.color
      });
    });
    
    // Track conversion
    trackEvent.addToCart(
      { 
        id: recommendation.id, 
        name: recommendation.name, 
        price: recommendation.totalPrice,
        category: 'complete-look'
      }, 
      recommendation.products.length
    );
  };

  const handleSaveLook = (recId: string) => {
    setSavedLooks(prev => 
      prev.includes(recId) 
        ? prev.filter(id => id !== recId)
        : [...prev, recId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-burgundy" />
              </div>
              <div>
                <h2 className="text-xl font-serif">Your Personalized Style Recommendations</h2>
                <p className="text-sm text-gray-600">
                  Based on your {profile.occasion} {profile.style} style preference
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onStartOver}>
                Start Over
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recommendations List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold mb-4">AI Curated Looks</h3>
            
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedRec(rec)}
                className={cn(
                  "p-4 rounded-xl border-2 cursor-pointer transition-all",
                  selectedRec?.id === rec.id 
                    ? "border-burgundy bg-burgundy/5" 
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{rec.name}</h4>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-burgundy">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-semibold">{rec.styleScore}%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold">${rec.totalPrice.toFixed(2)}</span>
                  {rec.savings && (
                    <span className="text-green-600">Save ${rec.savings}</span>
                  )}
                  <span className="text-gray-500">{rec.products.length} items</span>
                </div>
                
                <div className="flex gap-1 mt-2">
                  {rec.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected Recommendation Detail */}
          {selectedRec && (
            <div className="lg:col-span-2">
              <motion.div
                key={selectedRec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                {/* Style Score and Title */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-serif mb-2">{selectedRec.name}</h3>
                    <p className="text-gray-600">{selectedRec.description}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-burgundy to-gold flex items-center justify-center text-white">
                      <div>
                        <div className="text-2xl font-bold">{selectedRec.styleScore}</div>
                        <div className="text-xs">Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-white rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-burgundy" />
                    <h4 className="font-semibold">AI Style Analysis</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{selectedRec.reasoning}</p>
                  
                  <div className="space-y-2">
                    {selectedRec.aiInsights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {selectedRec.products.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl p-4">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h5 className="font-semibold text-sm">{product.name}</h5>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <p className="font-semibold mt-1">${product.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAddToCart(selectedRec)}
                    size="lg"
                    className="flex-1 bg-burgundy hover:bg-burgundy-700 text-white gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add Complete Look to Cart
                  </Button>
                  
                  <Button
                    onClick={() => handleSaveLook(selectedRec.id)}
                    size="lg"
                    variant="outline"
                    className="gap-2"
                  >
                    {savedLooks.includes(selectedRec.id) ? (
                      <>
                        <Heart className="w-4 h-4 fill-current text-burgundy" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        Save Look
                      </>
                    )}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>

                {/* Price Summary */}
                <div className="bg-burgundy/5 rounded-xl p-4 mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total for complete look</p>
                      <p className="text-2xl font-bold">${selectedRec.totalPrice.toFixed(2)}</p>
                      {selectedRec.savings && (
                        <p className="text-sm text-green-600">You save ${selectedRec.savings}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Style Match</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-burgundy" />
                        <span className="font-semibold text-burgundy">{selectedRec.styleScore}% Match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}