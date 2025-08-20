"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import { Sparkles, Package, TrendingUp, ShoppingBag, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/lib/hooks/useCart";
import { AIProductCard } from "@/components/products/AIProductCard";
import { motion, AnimatePresence } from "framer-motion";

interface AICartRecommendationsProps {
  cartItems: any[];
  userStyle?: string;
}

export function AICartRecommendations({ cartItems, userStyle }: AICartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [bundleSuggestions, setBundleSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'complete' | 'bundles' | 'trending'>('complete');
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (cartItems.length === 0) return;
      
      setLoading(true);
      try {
        // Get product IDs from cart
        const productIds = cartItems.map(item => item.productId).join(',');
        const categories = [...new Set(cartItems.map(item => item.product?.category).filter(Boolean))];
        
        // Fetch multiple types of recommendations in parallel
        const [completeTheLook, bundles, trending] = await Promise.all([
          // Complete the Look - based on cart items
          fetch(`/api/recommendations?type=complete_the_look&productIds=${productIds}&limit=6`)
            .then(res => res.ok ? res.json() : { recommendations: [] }),
          
          // Smart Bundle Suggestions
          fetch('/api/ai/outfit-recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              categories: categories,
              priceRange: { min: 100, max: 500 },
              occasion: 'business', // Could be dynamic based on cart content
              limit: 3
            })
          }).then(res => res.ok ? res.json() : { outfits: [] }),
          
          // Trending items that complement cart
          fetch(`/api/recommendations/trending?excludeIds=${productIds}&limit=4`)
            .then(res => res.ok ? res.json() : { recommendations: [] })
        ]);
        
        setRecommendations(completeTheLook.recommendations || []);
        setBundleSuggestions(bundles.outfits || bundles.recommendations || []);
        
        // Add trending items to recommendations if needed
        if (trending.recommendations) {
          setRecommendations(prev => [...prev, ...trending.recommendations].slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [cartItems]);

  const handleAddToCart = async (product: Product, size: string) => {
    setAddingToCart(product.id);
    try {
      await addToCart(product, size);
      // Show success animation or toast
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const calculateBundleSavings = (bundle: any) => {
    const totalPrice = bundle.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0;
    const bundlePrice = bundle.price || totalPrice * 0.85; // 15% discount if no bundle price
    return {
      total: totalPrice,
      bundlePrice: bundlePrice,
      savings: totalPrice - bundlePrice,
      percentage: Math.round(((totalPrice - bundlePrice) / totalPrice) * 100)
    };
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-burgundy border-t-transparent" />
          <span className="ml-3 text-gray-600">Finding perfect matches...</span>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0 && bundleSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="py-12 border-t border-gray-200">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-burgundy mb-4">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-widest uppercase">AI Recommendations</span>
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-3xl font-serif mb-4">Complete Your Look</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our AI has analyzed your cart and found these perfect matches
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedTab('complete')}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            selectedTab === 'complete'
              ? 'bg-burgundy text-white shadow-lg'
              : 'bg-white border-2 border-gray-200 hover:border-burgundy text-gray-700'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Complete the Look
        </button>
        <button
          onClick={() => setSelectedTab('bundles')}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            selectedTab === 'bundles'
              ? 'bg-burgundy text-white shadow-lg'
              : 'bg-white border-2 border-gray-200 hover:border-burgundy text-gray-700'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Smart Bundles
        </button>
        <button
          onClick={() => setSelectedTab('trending')}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            selectedTab === 'trending'
              ? 'bg-burgundy text-white shadow-lg'
              : 'bg-white border-2 border-gray-200 hover:border-burgundy text-gray-700'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Trending Now
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Complete the Look Tab */}
        {selectedTab === 'complete' && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {recommendations.slice(0, 8).map((rec, index) => (
              <div key={index} className="relative">
                {rec.product ? (
                  <AIProductCard
                    product={{
                      ...rec.product,
                      ai_score: rec.score,
                      recommendation_reason: rec.reason,
                      style_match: rec.style_match,
                      is_ai_pick: true
                    }}
                    userStyle={userStyle}
                  />
                ) : (
                  <Card className="p-4 hover:shadow-xl transition-shadow">
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4" />
                    <h3 className="font-medium text-sm line-clamp-2">Loading...</h3>
                  </Card>
                )}
                
                {/* AI Match Badge */}
                {rec.score && rec.score > 0.8 && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      {Math.round(rec.score * 100)}% Match
                    </div>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Smart Bundles Tab */}
        {selectedTab === 'bundles' && bundleSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {bundleSuggestions.map((bundle, index) => {
              const pricing = calculateBundleSavings(bundle);
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all">
                  {/* Bundle Header */}
                  <div className="bg-gradient-to-r from-burgundy to-burgundy-700 text-white p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg">{bundle.name || 'Perfect Match Bundle'}</h3>
                      {pricing.percentage > 0 && (
                        <div className="bg-white/20 backdrop-blur px-2 py-1 rounded">
                          <span className="text-xs font-bold">SAVE {pricing.percentage}%</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-white/90">{bundle.description || 'Curated for your style'}</p>
                  </div>

                  {/* Bundle Items */}
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {bundle.items?.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="aspect-square bg-gray-100 rounded overflow-hidden">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bundle Items List */}
                    <div className="space-y-2 mb-4">
                      {bundle.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-gray-500">{formatPrice(item.price || 0)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="border-t pt-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 line-through">{formatPrice(pricing.total)}</span>
                        <span className="text-2xl font-bold text-burgundy">{formatPrice(pricing.bundlePrice)}</span>
                      </div>
                      {pricing.savings > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          You save {formatPrice(pricing.savings)}
                        </p>
                      )}
                    </div>

                    {/* Add Bundle Button */}
                    <Button
                      className="w-full bg-burgundy hover:bg-burgundy-700 text-white"
                      onClick={() => {
                        // Handle bundle add to cart
                        console.log('Add bundle:', bundle);
                      }}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add Bundle to Cart
                    </Button>
                  </div>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Trending Tab */}
        {selectedTab === 'trending' && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Trending Banner */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Trending with your items</h3>
              </div>
              <p className="text-sm text-gray-600">
                Other customers who bought similar items also loved these
              </p>
            </div>

            {/* Trending Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations
                .filter(rec => rec.trending_score && rec.trending_score > 0.7)
                .slice(0, 4)
                .map((rec, index) => (
                  <AIProductCard
                    key={index}
                    product={{
                      ...rec.product,
                      trending_score: rec.trending_score,
                      is_trending: true,
                      recommendation_reason: "Trending with your style"
                    }}
                    userStyle={userStyle}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600 mb-4">
          <Sparkles className="w-4 h-4 inline mr-1 text-purple-600" />
          AI recommendations update in real-time based on your selections
        </p>
        <Button
          variant="outline"
          className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
          onClick={() => window.location.href = '/products'}
        >
          Explore More Recommendations
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}