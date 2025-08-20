'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Package, DollarSign, MessageCircle, Sparkles, 
  TrendingUp, Target, ShoppingBag, Heart, Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StyleMatchingWidget } from '@/components/social/StyleMatchingWidget';
import { SmartBundleCard } from '@/components/bundles/SmartBundleCard';
import { DynamicPricingDashboard } from '@/components/pricing/DynamicPricingDashboard';
import { PersonalStylistChat } from '@/components/chat/PersonalStylistChat';

export default function AdvancedCommercePage() {
  const [activeDemo, setActiveDemo] = useState<'social' | 'bundles' | 'pricing' | 'chat'>('social');
  const [chatMinimized, setChatMinimized] = useState(true);

  const demoSections = [
    {
      id: 'social' as const,
      title: 'Social Style Matching',
      description: 'Connect customers with similar style preferences for social proof and recommendations',
      icon: Users,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'bundles' as const,
      title: 'Smart Bundles',
      description: 'AI-generated outfit bundles with Fashion-CLIP compatibility scoring',
      icon: Package,
      color: 'from-green-500 to-blue-600'
    },
    {
      id: 'pricing' as const,
      title: 'Dynamic Pricing',
      description: 'Trend-based pricing optimization using Fashion-CLIP analysis',
      icon: DollarSign,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'chat' as const,
      title: 'Personal Stylist Chat',
      description: 'AI stylist powered by Fashion-CLIP for personalized style advice',
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const mockBundles = [
    {
      id: 'bundle-1',
      name: 'Professional Business Bundle',
      description: 'Complete professional outfit curated by AI for perfect style harmony',
      items: [
        {
          product: {
            id: 'suit-1',
            name: 'Navy Business Suit',
            category: 'suit' as const,
            price: 599,
            imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public',
            colors: ['navy'],
            tags: ['business', 'formal'],
            inStock: true
          },
          compatibilityScore: 0.95,
          reasoning: 'Core professional piece',
          isCore: true
        },
        {
          product: {
            id: 'shirt-1',
            name: 'White Dress Shirt',
            category: 'shirt' as const,
            price: 89,
            imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/shirt-white/public',
            colors: ['white'],
            tags: ['business', 'formal'],
            inStock: true
          },
          compatibilityScore: 0.92,
          reasoning: 'Perfect complement to navy suit',
          isCore: false
        },
        {
          product: {
            id: 'tie-1',
            name: 'Silk Pattern Tie',
            category: 'tie' as const,
            price: 65,
            imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/tie-pattern/public',
            colors: ['blue', 'gold'],
            tags: ['business', 'formal'],
            inStock: true
          },
          compatibilityScore: 0.88,
          reasoning: 'Adds sophisticated pattern while maintaining professionalism',
          isCore: false
        }
      ],
      totalPrice: 753,
      bundlePrice: 678,
      discount: 75,
      discountPercentage: 10,
      compatibility: {
        overall: 0.92,
        color: 0.90,
        style: 0.95,
        occasion: 0.90
      },
      occasions: ['business', 'formal'],
      seasonality: ['year-round'],
      targetCustomer: {
        style: ['professional', 'classic'],
        fit: 'slim',
        priceRange: 'premium'
      },
      createdAt: new Date(),
      fashionClipScore: 0.92
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Commerce Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of e-commerce with AI-powered features that revolutionize 
              how customers discover, shop, and style themselves.
            </p>
          </div>

          {/* Feature Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {demoSections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer transition-all ${
                      activeDemo === section.id 
                        ? 'ring-2 ring-blue-500 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setActiveDemo(section.id)}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${section.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Social Style Matching Demo */}
          {activeDemo === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Social Style Matching</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Connect customers with similar style preferences to build trust through social proof 
                  and provide personalized recommendations based on like-minded shoppers.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Social Proof</h3>
                  <StyleMatchingWidget 
                    productId="suit-navy-1"
                    className="mb-6"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Style Matches</h3>
                  <StyleMatchingWidget 
                    customerId="customer-123"
                  />
                </div>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Key Features
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Style Profile Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Fashion-CLIP analyzes customer preferences, purchase history, and uploaded images 
                      to create detailed style profiles.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Similarity Matching</h4>
                    <p className="text-sm text-gray-600">
                      Advanced algorithms find customers with similar tastes to provide 
                      authentic social proof and recommendations.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Privacy Protection</h4>
                    <p className="text-sm text-gray-600">
                      All customer data is anonymized while maintaining the effectiveness 
                      of style matching and recommendations.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Smart Bundles Demo */}
          {activeDemo === 'bundles' && (
            <motion.div
              key="bundles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Smart Bundles</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  AI-generated outfit bundles that use Fashion-CLIP to ensure perfect style harmony, 
                  color coordination, and occasion appropriateness.
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <SmartBundleCard
                  bundle={mockBundles[0]}
                  showCompatibilityDetails={true}
                  onAddToCart={() => alert('Bundle added to cart!')}
                  onViewDetails={() => alert('Viewing bundle details')}
                  onSaveBundle={() => alert('Bundle saved to wishlist!')}
                />
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  AI Bundle Creation Process
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Analyze Core Item</h4>
                    <p className="text-sm text-gray-600">
                      Fashion-CLIP analyzes the main product's style, color, and occasion
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Find Complements</h4>
                    <p className="text-sm text-gray-600">
                      Identify products that create harmony in style, color, and fit
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Score Compatibility</h4>
                    <p className="text-sm text-gray-600">
                      Rate how well items work together using multiple factors
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-orange-600 font-bold">4</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Optimize Bundle</h4>
                    <p className="text-sm text-gray-600">
                      Create the perfect combination with dynamic pricing
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Dynamic Pricing Demo */}
          {activeDemo === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Dynamic Pricing</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Intelligent pricing optimization that adapts to fashion trends, inventory levels, 
                  and market conditions using Fashion-CLIP trend analysis.
                </p>
              </div>

              <DynamicPricingDashboard 
                productIds={['suit-navy-1', 'shirt-white-1', 'tie-silk-1']}
                autoRefresh={false}
              />
            </motion.div>
          )}

          {/* Personal Stylist Chat Demo */}
          {activeDemo === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Personal Stylist Chat</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  An AI-powered personal stylist that understands visual preferences through Fashion-CLIP 
                  and provides personalized style advice, outfit recommendations, and shopping guidance.
                </p>
              </div>

              <Card className="p-8 max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Try the Personal Stylist</h3>
                  <p className="text-gray-600">
                    Click the chat button in the bottom right to start a conversation with your AI stylist.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Style Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Upload photos to get instant Fashion-CLIP analysis of your style preferences
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Personalized Advice</h4>
                    <p className="text-sm text-gray-600">
                      Get outfit recommendations tailored to your lifestyle and preferences
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Smart Shopping</h4>
                    <p className="text-sm text-gray-600">
                      Discover products that match your style and build complete wardrobes
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button 
                    onClick={() => setChatMinimized(false)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Styling Session
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Personal Stylist Chat Component */}
      <PersonalStylistChat
        customerId="demo-customer"
        customerName="Demo User"
        isMinimized={chatMinimized}
        onMinimize={() => setChatMinimized(true)}
        onMaximize={() => setChatMinimized(false)}
      />
    </div>
  );
}