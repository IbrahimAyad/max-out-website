'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, TrendingUp, Package, Star, Users, Zap,
  Calendar, Award, ShoppingCart, Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SmartBundleCard } from '@/components/bundles/SmartBundleCard';
import { knowledgeBankBundles } from '@/lib/services/knowledgeBankBundles';
import { SmartBundle } from '@/lib/services/smartBundles';
import { TOP_COMBINATIONS, COMBINATION_CONVERSION_DATA } from '@/lib/data/knowledgeBank/topCombinations';

export default function KnowledgeBankBundlesPage() {
  const [topBundles, setTopBundles] = useState<SmartBundle[]>([]);
  const [trendingBundles, setTrendingBundles] = useState<SmartBundle[]>([]);
  const [seasonalBundles, setSeasonalBundles] = useState<SmartBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'top' | 'trending' | 'seasonal'>('top');

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    setLoading(true);
    try {
      const [top, trending, seasonal] = await Promise.all([
        knowledgeBankBundles.generateTopBundles(),
        knowledgeBankBundles.generateTrendingBundles(),
        knowledgeBankBundles.generateSeasonalBundles('spring')
      ]);

      setTopBundles(top);
      setTrendingBundles(trending);
      setSeasonalBundles(seasonal);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const getCurrentBundles = () => {
    switch (activeTab) {
      case 'trending': return trendingBundles;
      case 'seasonal': return seasonalBundles;
      default: return topBundles;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-gold to-amber-600 rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Knowledge Bank Smart Bundles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-curated outfit combinations backed by data from 10,000+ successful events 
            and proven conversion rates
          </p>
        </div>

        {/* Stats Banner */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">10,000+</div>
              <div className="text-sm text-gray-600">Events Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">87%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">24.3%</div>
              <div className="text-sm text-gray-600">Top Conversion Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">4.8/5</div>
              <div className="text-sm text-gray-600">Avg Customer Rating</div>
            </div>
          </div>
        </Card>

        {/* Bundle Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            <button
              onClick={() => setActiveTab('top')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'top'
                  ? 'bg-gold text-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Top Performers
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'trending'
                  ? 'bg-gold text-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Trending Now
            </button>
            <button
              onClick={() => setActiveTab('seasonal')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'seasonal'
                  ? 'bg-gold text-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Seasonal Favorites
            </button>
          </div>
        </div>

        {/* Bundle Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentBundles().map((bundle, index) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SmartBundleCard
                  bundle={bundle}
                  showCompatibilityDetails={true}
                  onAddToCart={() => alert(`Added ${bundle.name} to cart!`)}
                  onViewDetails={() => alert(`Viewing details for ${bundle.name}`)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Knowledge Bank Info */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">About Our Knowledge Bank</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our AI analyzes thousands of successful outfit combinations, customer preferences, 
              and event photos to recommend the perfect ensemble for any occasion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Real-Time Learning</h3>
              <p className="text-sm text-gray-600">
                Continuously updated with new trends and customer feedback
              </p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Customer-Driven</h3>
              <p className="text-sm text-gray-600">
                Based on real purchases and 5-star reviews
              </p>
            </div>
            <div className="text-center">
              <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Complete Outfits</h3>
              <p className="text-sm text-gray-600">
                Every detail considered from suit to accessories
              </p>
            </div>
          </div>
        </Card>

        {/* Top Combinations Display */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Data-Backed Top Performers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TOP_COMBINATIONS.slice(0, 4).map((combo, index) => (
              <Card key={combo.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{combo.occasion}</h3>
                    <p className="text-sm text-gray-600">{combo.seasonality} Season</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {COMBINATION_CONVERSION_DATA[combo.id] ? 
                      `${(COMBINATION_CONVERSION_DATA[combo.id].conversion_rate * 100).toFixed(1)}% Conv.` : 
                      'N/A'
                    }
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Suit:</span> {combo.primary_suit}</p>
                  <p className="text-sm"><span className="font-medium">Accessories:</span> {combo.accessories?.join(', ') || 'N/A'}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span>👥 {COMBINATION_CONVERSION_DATA[combo.id]?.purchase_count || 0} sold</span>
                    <span>⭐ {COMBINATION_CONVERSION_DATA[combo.id]?.avg_rating || 0}/5</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}