'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertCircle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FashionAnalysis } from '@/lib/ai/fashion-analyzer';

interface FashionAnalysisCardProps {
  analysis: FashionAnalysis;
  className?: string;
  onClose?: () => void;
}

export function FashionAnalysisCard({ analysis, className, onClose }: FashionAnalysisCardProps) {
  const formalityColors = {
    'casual': 'bg-blue-100 text-blue-800',
    'business-casual': 'bg-amber-100 text-amber-800',
    'formal': 'bg-purple-100 text-purple-800',
    'black-tie': 'bg-gray-900 text-white'
  };

  const styleScoreColor = 
    analysis.styleScore >= 0.8 ? 'text-green-600' :
    analysis.styleScore >= 0.6 ? 'text-amber-600' :
    'text-red-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'bg-white rounded-xl shadow-lg overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold">AI Fashion Analysis</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Category</p>
            <p className="font-medium capitalize">{analysis.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Style Score</p>
            <div className="flex items-center gap-2">
              <TrendingUp className={cn("w-4 h-4", styleScoreColor)} />
              <span className={cn("font-medium", styleScoreColor)}>
                {(analysis.styleScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Style & Formality */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Style Profile</p>
          <div className="flex flex-wrap gap-2">
            {analysis.style.map((style) => (
              <span
                key={style}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {style}
              </span>
            ))}
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                formalityColors[analysis.formality]
              )}
            >
              {analysis.formality}
            </span>
          </div>
        </div>

        {/* Colors */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Color Palette</p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: analysis.colors.primary }}
                title="Primary color"
              />
              {analysis.colors.secondary.slice(0, 3).map((color, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                  title={`Secondary color ${idx + 1}`}
                />
              ))}
            </div>
            {analysis.pattern && (
              <span className="text-sm text-gray-600 ml-2">
                Pattern: {analysis.pattern}
              </span>
            )}
          </div>
        </div>

        {/* Occasions & Seasons */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Best For</p>
            <div className="space-y-1">
              {analysis.occasions.slice(0, 3).map((occasion) => (
                <div key={occasion} className="flex items-center gap-1 text-sm">
                  <Check className="w-3 h-3 text-green-500" />
                  <span className="capitalize">{occasion.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Seasons</p>
            <div className="flex flex-wrap gap-1">
              {analysis.season.map((season) => (
                <span
                  key={season}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs capitalize"
                >
                  {season}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {analysis.recommendations && (
          <>
            {/* Complementary Items */}
            {analysis.recommendations.complementaryItems.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Pairs Well With</p>
                <div className="space-y-2">
                  {analysis.recommendations.complementaryItems.slice(0, 3).map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                    >
                      <Check className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium capitalize">
                          {item.style} {item.category}
                        </p>
                        <p className="text-xs text-gray-600">{item.reason}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Styling Tips */}
            {analysis.recommendations.stylingTips.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Styling Tips</p>
                <div className="space-y-2">
                  {analysis.recommendations.stylingTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Avoid Combinations */}
            {analysis.recommendations.avoidCombinations.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Style Cautions</p>
                <div className="space-y-1">
                  {analysis.recommendations.avoidCombinations.map((avoid, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-red-700">
                      <X className="w-3 h-3" />
                      <span>{avoid}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}