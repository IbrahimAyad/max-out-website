'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { seasonalChampions, weddingTrends2026, popularCombinations } from '@/lib/data/knowledgeBank/wedding-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard, AnimatedCounter } from '@/components/ui/micro-interactions';
import { 
  Calendar,
  TrendingUp,
  Award,
  Star,
  Sparkles,
  ThumbsUp,
  Shirt,
  Users,
  BarChart3,
  Zap,
  Info
} from 'lucide-react';

interface SeasonalWeddingGuideProps {
  selectedSeason?: string;
  onSelectCombination?: (combination: any) => void;
}

export function SeasonalWeddingGuide({ selectedSeason, onSelectCombination }: SeasonalWeddingGuideProps) {
  const [activeSeason, setActiveSeason] = useState(selectedSeason || 'spring');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showTrends, setShowTrends] = useState(false);

  const seasons = ['spring', 'summer', 'fall', 'winter'];
  const years = ['2023', '2024', '2025', '2026'];

  const seasonEmojis: Record<string, string> = {
    spring: '🌸',
    summer: '☀️',
    fall: '🍂',
    winter: '❄️'
  };

  const seasonColors: Record<string, string> = {
    spring: 'from-pink-100 to-green-100',
    summer: 'from-blue-100 to-yellow-100',
    fall: 'from-orange-100 to-red-100',
    winter: 'from-blue-100 to-purple-100'
  };

  const getSeasonData = (): any => {
    if (selectedYear === '2026') {
      return weddingTrends2026[activeSeason as keyof typeof weddingTrends2026];
    }
    
    const seasonData = seasonalChampions[activeSeason as keyof typeof seasonalChampions];
    const yearKey = selectedYear as '2023' | '2024' | '2025';
    const yearData = seasonData?.[yearKey];
    
    return yearData;
  };

  const currentData = getSeasonData();

  // Helper functions to safely access data
  const getSuitColor = () => {
    if (!currentData) return '';
    if ('champion' in currentData) return currentData.champion?.suit || '';
    if ('predicted' in currentData) return currentData.predicted?.suit || '';
    return '';
  };

  const getShirtColor = () => {
    if (!currentData) return '';
    if ('champion' in currentData) return currentData.champion?.shirt || '';
    if ('predicted' in currentData) return currentData.predicted?.shirt || '';
    return '';
  };

  const getTieColor = () => {
    if (!currentData) return '';
    if ('champion' in currentData) return currentData.champion?.tie || '';
    if ('predicted' in currentData) return currentData.predicted?.tie || '';
    return '';
  };

  const getPopularityScore = () => {
    if (!currentData) return 0;
    if ('champion' in currentData) return currentData.champion?.popularity || 0;
    if ('predicted' in currentData) return currentData.predicted?.confidence || 0;
    return 0;
  };

  const getFabric = () => {
    if (!currentData) return 'Premium Blend';
    if ('champion' in currentData && currentData.champion) {
      return (currentData.champion as any).fabric || 'Premium Blend';
    }
    if ('predicted' in currentData && currentData.predicted) {
      return (currentData.predicted as any).fabricInnovation || 'Premium Blend';
    }
    return 'Premium Blend';
  };

  const getNote = () => {
    if (!currentData) return '';
    if ('champion' in currentData && currentData.champion) {
      return (currentData.champion as any).note || '';
    }
    if ('predicted' in currentData && currentData.predicted) {
      const predicted = currentData.predicted as any;
      if (predicted.luxuryMaterials) {
        return `Features ${predicted.luxuryMaterials}`;
      }
    }
    return '';
  };

  const hasSocialMentions = () => {
    return currentData && 'champion' in currentData && currentData.champion && (currentData.champion as any).socialMentions;
  };

  const hasConversionRate = () => {
    return currentData && 'champion' in currentData && currentData.champion && (currentData.champion as any).conversionRate;
  };

  const hasSustainabilityFocus = () => {
    return selectedYear === '2026' && currentData && 'predicted' in currentData && currentData.predicted && (currentData.predicted as any).sustainabilityFocus;
  };

  return (
    <div className="space-y-6">
      {/* Season Selector */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" />
          Select Wedding Season
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {seasons.map((season) => (
            <InteractiveCard
              key={season}
              className={`p-4 cursor-pointer transition-all ${
                activeSeason === season ? 'ring-2 ring-gold shadow-lg' : ''
              }`}
              onClick={() => setActiveSeason(season)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{seasonEmojis[season]}</div>
                <h4 className="font-semibold capitalize">{season}</h4>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </Card>

      {/* Year Selector */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold" />
          Trend Year Analysis
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {years.map((year) => (
            <InteractiveCard
              key={year}
              className={`p-3 cursor-pointer transition-all ${
                selectedYear === year ? 'ring-2 ring-gold shadow-lg' : ''
              }`}
              onClick={() => setSelectedYear(year)}
            >
              <div className="text-center">
                <h4 className="font-semibold">{year}</h4>
                {year === '2026' && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    Predicted
                  </Badge>
                )}
              </div>
            </InteractiveCard>
          ))}
        </div>
      </Card>

      {/* Seasonal Champion Display */}
      {currentData && (
        <motion.div
          key={`${activeSeason}-${selectedYear}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${seasonColors[activeSeason]} rounded-2xl p-8`}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-serif mb-2">
              {activeSeason.charAt(0).toUpperCase() + activeSeason.slice(1)} {selectedYear} Champion
            </h2>
            {selectedYear === '2026' && currentData && 'predicted' in currentData && (
              <Badge className="bg-purple-600 text-white">
                AI Prediction • {(currentData as any).predicted.confidence}% Confidence
              </Badge>
            )}
          </div>

          {/* Champion Combination */}
          <Card className="p-6 bg-white/90 backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <Award className="w-6 h-6 text-gold" />
                  {getSuitColor()} Suit
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shirt className="w-3 h-3" />
                    {getShirtColor()} Shirt
                  </Badge>
                  <Badge variant="outline">
                    🎀 {getTieColor()} Tie
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gold">
                  <AnimatedCounter 
                    value={getPopularityScore()} 
                  />%
                </div>
                <p className="text-sm text-gray-600">Popularity Score</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-gold" />
                <p className="text-sm text-gray-600">Fabric Choice</p>
                <p className="font-semibold">
                  {getFabric()}
                </p>
              </div>
              
              {hasSocialMentions() && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Social Mentions</p>
                  <p className="font-semibold">
                    {(currentData && 'champion' in currentData && currentData.champion && (currentData.champion as any).socialMentions || 0).toLocaleString()}
                  </p>
                </div>
              )}

              {hasConversionRate() && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="font-semibold">{currentData && 'champion' in currentData && currentData.champion ? (currentData.champion as any).conversionRate : ''}</p>
                </div>
              )}

              {hasSustainabilityFocus() && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-gray-600">Eco-Friendly</p>
                  <p className="font-semibold">Sustainable</p>
                </div>
              )}
            </div>

            {/* Special Notes */}
            {getNote() && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>
                    {getNote()}
                  </span>
                </p>
              </div>
            )}
          </Card>

          {/* Runner Up */}
          {currentData && 'runnerUp' in currentData && currentData.runnerUp && (
            <Card className="mt-4 p-4 bg-white/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Runner Up</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {(currentData as any).runnerUp.suit}
                    </Badge>
                    <span className="text-gray-500">+</span>
                    <Badge variant="outline" className="text-xs">
                      {(currentData as any).runnerUp.shirt}
                    </Badge>
                    <span className="text-gray-500">+</span>
                    <Badge variant="outline" className="text-xs">
                      {(currentData as any).runnerUp.tie}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{(currentData as any).runnerUp.popularity}%</p>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      )}

      {/* All-Time Classics */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-gold" />
          All-Time Classic Combinations
        </h3>
        <div className="space-y-4">
          {popularCombinations.allTimeClassics.map((combo, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:border-gold transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{combo.combination}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {combo.occasions.map((occasion) => (
                      <Badge key={occasion} variant="outline" className="text-xs">
                        {occasion}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">{combo.popularity}%</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {combo.failureRate} failure rate
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Trending Combinations */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Trending Combinations (2023-2025)
        </h3>
        <div className="space-y-4">
          {popularCombinations.trendingCombinations.map((combo, index) => (
            <div
              key={index}
              className="p-4 border border-green-200 bg-green-50 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{combo.combination}</h4>
                  <p className="text-sm text-gray-600 mt-1">{combo.bestFor}</p>
                  <Badge className="mt-2 bg-green-600 text-white">
                    {combo.growth} Growth
                  </Badge>
                </div>
                <div className="text-right">
                  <Badge variant="outline">
                    Peak: {combo.seasonalPeak}
                  </Badge>
                  {combo.luxuryScore && (
                    <p className="text-sm mt-1">
                      Luxury Score: {combo.luxuryScore}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}