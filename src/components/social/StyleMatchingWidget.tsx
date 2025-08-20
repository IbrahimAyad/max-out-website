'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Heart, TrendingUp, Star, Eye, ShoppingBag,
  ChevronRight, Sparkles, UserCheck, Badge
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { socialStyleMatching, StyleMatch, SocialProof } from '@/lib/services/socialStyleMatching';

interface StyleMatchingWidgetProps {
  productId?: string;
  customerId?: string;
  className?: string;
}

export function StyleMatchingWidget({ 
  productId, 
  customerId, 
  className = "" 
}: StyleMatchingWidgetProps) {
  const [socialProof, setSocialProof] = useState<SocialProof | null>(null);
  const [styleMatches, setStyleMatches] = useState<StyleMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'social' | 'similar'>('social');

  useEffect(() => {
    loadData();
  }, [productId, customerId]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (productId) {
        const proof = await socialStyleMatching.getProductSocialProof(productId);
        setSocialProof(proof);
      }

      if (customerId) {
        const matches = await socialStyleMatching.findSimilarCustomers(customerId, 8);
        setStyleMatches(matches);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('social')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'social'
              ? 'border-gold text-gold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Social Proof
        </button>
        <button
          onClick={() => setActiveTab('similar')}
          className={`ml-6 pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'similar'
              ? 'border-gold text-gold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          Similar Taste
        </button>
      </div>

      {/* Social Proof Tab */}
      {activeTab === 'social' && socialProof && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-gold" />
            <h3 className="font-semibold text-gray-900">Social Proof</h3>
          </div>

          {/* Customer Count */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-blue-900">
                {socialProof.totalCustomersWithSimilarStyle} customers
              </div>
              <div className="text-sm text-blue-700">
                with similar style preferences love this
              </div>
            </div>
          </div>

          {/* Recent Purchases */}
          {socialProof.recentPurchases.map((purchase, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-green-900">
                    {purchase.customerCount} recent purchases
                  </div>
                  <div className="text-sm text-green-700 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {purchase.averageRating}/5 rating
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Style Influencers */}
          {socialProof.styleInfluencers.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Badge className="w-4 h-4 text-purple-600" />
                Style Influencers Who Bought This
              </h4>
              <div className="space-y-2">
                {socialProof.styleInfluencers.slice(0, 3).map((influencer, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Style Expert</div>
                      <div className="text-xs text-gray-600">
                        {influencer.styleScore}/100 style score
                      </div>
                    </div>
                    <div className="text-xs text-purple-600 font-medium">
                      {influencer.preferredStyles.slice(0, 2).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Similar Customers Tab */}
      {activeTab === 'similar' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-gold" />
            <h3 className="font-semibold text-gray-900">Customers Like You</h3>
          </div>

          {styleMatches.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No similar customers found yet.</p>
              <p className="text-sm mt-1">Browse more to build your style profile!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {styleMatches.slice(0, 4).map((match, index) => (
                <motion.div
                  key={match.customer.customerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {Math.round(match.similarityScore * 100)}% style match
                        </div>
                        <div className="text-xs text-gray-600">
                          Style score: {match.customer.styleScore}/100
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="mt-2">
                    <div className="text-xs text-gray-700">
                      {match.recommendationReason}
                    </div>
                    {match.commonPreferences.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {match.commonPreferences.slice(0, 3).map((pref, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {pref}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {styleMatches.length > 4 && (
                <Button variant="outline" className="w-full text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All {styleMatches.length} Similar Customers
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full text-sm"
          onClick={() => {
            // Could navigate to full social features page

          }}
        >
          <Users className="w-4 h-4 mr-2" />
          Explore Social Features
        </Button>
      </div>
    </Card>
  );
}