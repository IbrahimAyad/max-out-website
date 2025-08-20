'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle,
  BarChart3, Clock, Zap, RefreshCw, Settings, Download,
  Package, Users, Calendar, Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dynamicPricing, PriceRecommendation, TrendAnalysis, PricingContext } from '@/lib/services/dynamicPricing';

interface DynamicPricingDashboardProps {
  productIds?: string[];
  autoRefresh?: boolean;
  className?: string;
}

interface PricingInsight {
  productId: string;
  productName: string;
  currentPrice: number;
  recommendation: PriceRecommendation;
  trendAnalysis: TrendAnalysis;
  status: 'optimal' | 'adjustment-needed' | 'review-required';
}

export function DynamicPricingDashboard({
  productIds = [],
  autoRefresh = true,
  className = ""
}: DynamicPricingDashboardProps) {
  const [insights, setInsights] = useState<PricingInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [sortBy, setSortBy] = useState<'impact' | 'trend' | 'adjustment'>('impact');

  useEffect(() => {
    loadPricingData();

    if (autoRefresh) {
      const interval = setInterval(loadPricingData, 5 * 60 * 1000); // Refresh every 5 minutes
      return () => clearInterval(interval);
    }
  }, [productIds, autoRefresh]);

  const loadPricingData = async () => {
    setLoading(true);
    try {
      // Mock data - in production this would fetch from your product database
      const mockProducts = [
        {
          id: 'suit-navy-1',
          name: 'Navy Business Suit',
          currentPrice: 599,
          context: {
            productId: 'suit-navy-1',
            basePrice: 599,
            currentInventory: 45,
            salesVelocity: 2.3,
            seasonality: 'year-round' as const,
            competitorPrices: [549, 625, 679, 595],
            customerSegment: 'premium' as const,
            timeOfYear: new Date(),
            trendScore: 78
          }
        },
        {
          id: 'shirt-white-1',
          name: 'White Dress Shirt',
          currentPrice: 89,
          context: {
            productId: 'shirt-white-1',
            basePrice: 89,
            currentInventory: 120,
            salesVelocity: 5.1,
            seasonality: 'year-round' as const,
            competitorPrices: [75, 95, 85, 92],
            customerSegment: 'mid-market' as const,
            timeOfYear: new Date(),
            trendScore: 65
          }
        },
        {
          id: 'tie-silk-1',
          name: 'Silk Pattern Tie',
          currentPrice: 65,
          context: {
            productId: 'tie-silk-1',
            basePrice: 65,
            currentInventory: 8,
            salesVelocity: 1.2,
            seasonality: 'fall' as const,
            competitorPrices: [55, 70, 68],
            customerSegment: 'premium' as const,
            timeOfYear: new Date(),
            trendScore: 85
          }
        }
      ];

      const insightsData: PricingInsight[] = [];

      for (const product of mockProducts) {
        const recommendation = await dynamicPricing.calculateOptimalPrice(product.context);
        const trendAnalysis = await dynamicPricing.analyzeTrend(product.id, product.context);

        const status = Math.abs(recommendation.adjustmentPercentage) > 10 
          ? 'adjustment-needed'
          : Math.abs(recommendation.adjustmentPercentage) > 5
            ? 'review-required'
            : 'optimal';

        insightsData.push({
          productId: product.id,
          productName: product.name,
          currentPrice: product.currentPrice,
          recommendation,
          trendAnalysis,
          status
        });
      }

      setInsights(insightsData);
      setLastUpdated(new Date());
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const getSortedInsights = () => {
    return [...insights].sort((a, b) => {
      switch (sortBy) {
        case 'impact':
          return Math.abs(b.recommendation.adjustmentPercentage) - Math.abs(a.recommendation.adjustmentPercentage);
        case 'trend':
          return b.trendAnalysis.trendScore - a.trendAnalysis.trendScore;
        case 'adjustment':
          return b.recommendation.adjustmentPercentage - a.recommendation.adjustmentPercentage;
        default:
          return 0;
      }
    });
  };

  const getStatusColor = (status: PricingInsight['status']) => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'review-required': return 'text-yellow-600 bg-yellow-100';
      case 'adjustment-needed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: PricingInsight['status']) => {
    switch (status) {
      case 'optimal': return <Target className="w-4 h-4" />;
      case 'review-required': return <Clock className="w-4 h-4" />;
      case 'adjustment-needed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (direction: TrendAnalysis['trendDirection']) => {
    switch (direction) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const calculateTotalImpact = () => {
    return insights.reduce((total, insight) => {
      const priceChange = insight.recommendation.recommendedPrice - insight.currentPrice;
      return total + priceChange;
    }, 0);
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dynamic Pricing Dashboard</h2>
              <p className="text-sm text-gray-600">
                AI-powered pricing optimization using Fashion-CLIP trend analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadPricingData}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {insights.length}
            </div>
            <div className="text-sm text-gray-600">Products Analyzed</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${calculateTotalImpact().toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Potential Revenue Impact</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {insights.filter(i => i.status === 'adjustment-needed').length}
            </div>
            <div className="text-sm text-gray-600">Need Adjustment</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {lastUpdated?.toLocaleTimeString() || '--'}
            </div>
            <div className="text-sm text-gray-600">Last Updated</div>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="impact">Price Impact</option>
              <option value="trend">Trend Score</option>
              <option value="adjustment">Adjustment %</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Timeframe:</span>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {(['24h', '7d', '30d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedTimeframe(period)}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${
                    selectedTimeframe === period
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Insights */}
      <div className="space-y-4">
        {getSortedInsights().map((insight, index) => (
          <motion.div
            key={insight.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">{insight.productName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(insight.status)}`}>
                        {getStatusIcon(insight.status)}
                        <span className="ml-1">{insight.status.replace('-', ' ')}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(insight.trendAnalysis.trendDirection)}
                        <span className="text-sm text-gray-600">
                          {insight.trendAnalysis.trendScore}/100 trend
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-gray-900">
                      ${insight.recommendation.recommendedPrice.toFixed(2)}
                    </span>
                    <span className={`text-sm font-medium ${
                      insight.recommendation.adjustmentPercentage > 0 
                        ? 'text-green-600' 
                        : insight.recommendation.adjustmentPercentage < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}>
                      {insight.recommendation.adjustmentPercentage > 0 ? '+' : ''}
                      {insight.recommendation.adjustmentPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Current: ${insight.currentPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Pricing Factors */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Trend</div>
                  <div className={`text-sm font-medium ${
                    insight.recommendation.factors.trendAdjustment > 0 ? 'text-green-600' : 
                    insight.recommendation.factors.trendAdjustment < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {insight.recommendation.factors.trendAdjustment > 0 ? '+' : ''}
                    {(insight.recommendation.factors.trendAdjustment * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Inventory</div>
                  <div className={`text-sm font-medium ${
                    insight.recommendation.factors.inventoryAdjustment > 0 ? 'text-green-600' : 
                    insight.recommendation.factors.inventoryAdjustment < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {insight.recommendation.factors.inventoryAdjustment > 0 ? '+' : ''}
                    {(insight.recommendation.factors.inventoryAdjustment * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Competition</div>
                  <div className={`text-sm font-medium ${
                    insight.recommendation.factors.competitionAdjustment > 0 ? 'text-green-600' : 
                    insight.recommendation.factors.competitionAdjustment < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {insight.recommendation.factors.competitionAdjustment > 0 ? '+' : ''}
                    {(insight.recommendation.factors.competitionAdjustment * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Seasonal</div>
                  <div className={`text-sm font-medium ${
                    insight.recommendation.factors.seasonalAdjustment > 0 ? 'text-green-600' : 
                    insight.recommendation.factors.seasonalAdjustment < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {insight.recommendation.factors.seasonalAdjustment > 0 ? '+' : ''}
                    {(insight.recommendation.factors.seasonalAdjustment * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Confidence</div>
                  <div className="text-sm font-medium text-blue-600">
                    {Math.round(insight.recommendation.confidence * 100)}%
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              {insight.recommendation.reasoning.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">AI Reasoning</span>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {insight.recommendation.reasoning.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-600 mt-0.5">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-gold hover:bg-gold/90 text-black"
                  disabled={Math.abs(insight.recommendation.adjustmentPercentage) < 1}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Apply Pricing
                </Button>

                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>

                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Review
                </Button>

                <div className="ml-auto text-xs text-gray-500">
                  Valid until {insight.recommendation.validUntil.toLocaleDateString()}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {insights.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">Add products to start dynamic pricing analysis.</p>
        </Card>
      )}
    </div>
  );
}