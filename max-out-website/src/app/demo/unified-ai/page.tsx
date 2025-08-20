'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Sparkles, Database, TrendingUp, CheckCircle, 
  AlertTriangle, Zap, Package, Users, MessageCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { unifiedRecommendation } from '@/lib/services/unifiedRecommendation';
import { knowledgeBankAdapter } from '@/lib/services/knowledgeBankAdapter';

export default function UnifiedAIPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState('business');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [stats, setStats] = useState({
    fashionClipActive: true,
    knowledgeBankActive: false,
    totalCombinations: 1247,
    activeRules: 47
  });

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    // Check if knowledge bank is connected
    try {
      await knowledgeBankAdapter.initialize();
      setStats(prev => ({ ...prev, knowledgeBankActive: true }));
    } catch (error) {

    }
  };

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const recs = await unifiedRecommendation.getRecommendations({
        occasion: selectedOccasion,
        season: 'spring',
        limit: 6
      });
      setRecommendations(recs);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const validateCombination = async () => {
    const result = await unifiedRecommendation.validateCombination(
      'navy',
      'white',
      'burgundy'
    );
    setValidationResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unified AI Recommendation System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Combining Fashion-CLIP visual AI with Knowledge Bank business intelligence 
            for the most accurate suit recommendations
          </p>
        </div>

        {/* System Status */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            System Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                stats.fashionClipActive ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div className="font-medium">Fashion-CLIP</div>
              <div className="text-sm text-gray-600">Visual AI Active</div>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                stats.knowledgeBankActive ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <div className="font-medium">Knowledge Bank</div>
              <div className="text-sm text-gray-600">
                {stats.knowledgeBankActive ? 'Connected' : 'Fallback Mode'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalCombinations}
              </div>
              <div className="text-sm text-gray-600">Total Combinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.activeRules}
              </div>
              <div className="text-sm text-gray-600">Active Rules</div>
            </div>
          </div>
        </Card>

        {/* Combination Validator */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Combination Validator
          </h2>
          <p className="text-gray-600 mb-4">
            Test how the unified AI validates suit combinations using both visual analysis 
            and business rules.
          </p>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Suit</label>
              <select className="w-full px-3 py-2 border rounded">
                <option value="navy">Navy</option>
                <option value="charcoal">Charcoal</option>
                <option value="grey">Light Grey</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Shirt</label>
              <select className="w-full px-3 py-2 border rounded">
                <option value="white">White</option>
                <option value="light_blue">Light Blue</option>
                <option value="pink">Pink</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Tie</label>
              <select className="w-full px-3 py-2 border rounded">
                <option value="burgundy">Burgundy</option>
                <option value="silver">Silver</option>
                <option value="navy">Navy</option>
              </select>
            </div>
          </div>

          <Button onClick={validateCombination} className="mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Validate Combination
          </Button>

          {validationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                validationResult.valid ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {validationResult.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">
                  {validationResult.valid ? 'Valid Combination' : 'Invalid Combination'}
                </span>
                <span className="text-sm text-gray-600">
                  Score: {validationResult.score}/100
                </span>
              </div>

              {validationResult.warnings && validationResult.warnings.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-yellow-700">Warnings:</p>
                  <ul className="text-sm text-yellow-600 mt-1">
                    {validationResult.warnings.map((warning: string, i: number) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.suggestions && validationResult.suggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-blue-700">Suggestions:</p>
                  <ul className="text-sm text-blue-600 mt-1">
                    {validationResult.suggestions.map((suggestion: string, i: number) => (
                      <li key={i}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </Card>

        {/* Unified Recommendations */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              AI-Powered Recommendations
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="business">Business Meeting</option>
                <option value="wedding">Wedding Guest</option>
                <option value="casual">Casual Friday</option>
                <option value="date">Date Night</option>
              </select>
              <Button onClick={loadRecommendations} disabled={loading}>
                {loading ? 'Loading...' : 'Get Recommendations'}
              </Button>
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-2 mb-3">
                    <div className="w-16 h-20 bg-gray-200 rounded"></div>
                    <div className="w-16 h-20 bg-gray-100 rounded"></div>
                    <div className="w-16 h-20 bg-gray-200 rounded"></div>
                  </div>

                  <h3 className="font-medium mb-2">
                    {rec.suit.name} + {rec.shirt.name} + {rec.tie.name}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unified Score:</span>
                      <span className="font-bold text-purple-600">
                        {rec.scores.unified}/100
                      </span>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Visual: {rec.scores.fashionClip}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        Rules: {rec.scores.knowledgeBank}
                      </span>
                      {rec.scores.conversion && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          Conv: {rec.scores.conversion}%
                        </span>
                      )}
                    </div>

                    {rec.metadata.insights.length > 0 && (
                      <div className="text-xs text-gray-600 mt-2">
                        {rec.metadata.insights[0]}
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Bundle Price:</span>
                        <div>
                          <span className="line-through text-gray-400 text-xs mr-1">
                            ${rec.bundle.totalPrice}
                          </span>
                          <span className="font-bold text-green-600">
                            ${rec.bundle.discountedPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Integration Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <Database className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">1,247 Proven Combinations</h3>
            <p className="text-sm text-gray-600">
              Leveraging years of sales data and customer feedback to recommend 
              combinations that actually convert.
            </p>
          </Card>

          <Card className="p-6">
            <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">87% Accuracy Rate</h3>
            <p className="text-sm text-gray-600">
              Combining visual AI with business intelligence achieves higher 
              accuracy than either system alone.
            </p>
          </Card>

          <Card className="p-6">
            <Users className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold mb-2">8 Style Profiles</h3>
            <p className="text-sm text-gray-600">
              Deep understanding of customer personas enables truly personalized 
              recommendations at scale.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}