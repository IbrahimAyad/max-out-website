'use client';

import { useState } from 'react';
import { Ruler, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernSizeBot } from '@/components/sizing/ModernSizeBot';

interface SizeBotIntegrationProps {
  productType?: 'suit' | 'shirt' | 'tuxedo';
  selectedSize?: string;
  onSizeSelect: (size: string) => void;
}

export function SizeBotIntegration({ 
  productType = 'suit',
  selectedSize,
  onSizeSelect 
}: SizeBotIntegrationProps) {
  const [showSizeBot, setShowSizeBot] = useState(false);
  const [aiRecommendedSize, setAiRecommendedSize] = useState<string | null>(null);

  const handleSizeRecommendation = (recommendation: any) => {
    setAiRecommendedSize(recommendation.primarySize);
    onSizeSelect(recommendation.primarySize);
    setShowSizeBot(false);
  };

  return (
    <>
      {/* Size Selection Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Select Size</h3>
          <button
            onClick={() => setShowSizeBot(true)}
            className="text-sm text-burgundy hover:text-burgundy-700 flex items-center gap-1.5 font-medium"
          >
            <Ruler className="h-4 w-4" />
            Find My Size
          </button>
        </div>

        {/* AI Recommendation Badge */}
        {aiRecommendedSize && (
          <div className="bg-gradient-to-r from-burgundy/10 to-gold/10 border border-burgundy/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="bg-burgundy text-white text-xs font-bold px-2 py-1 rounded">
                AI
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Recommended size: {aiRecommendedSize}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Based on your measurements
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Size Bot Button - Alternative Design */}
        <Button
          onClick={() => setShowSizeBot(true)}
          variant="outline"
          className="w-full group hover:border-burgundy hover:text-burgundy transition-all"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-burgundy to-gold p-0.5 group-hover:scale-110 transition-transform">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Ruler className="h-5 w-5 text-burgundy" />
              </div>
            </div>
            <div className="text-left">
              <p className="font-semibold">AI Size Finder</p>
              <p className="text-xs text-gray-500">Get perfect fit in 30 seconds</p>
            </div>
          </div>
        </Button>

        {/* Inline Size Bot - Compact Version */}
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-burgundy/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Not sure about your size?
                  </span>
                </div>
                <span className="text-burgundy text-sm group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </div>
            </div>
          </summary>
          <div className="mt-2">
            <ModernSizeBot
              productType={productType}
              onSizeSelected={handleSizeRecommendation}
              isModal={false}
              compact={true}
            />
          </div>
        </details>
      </div>

      {/* Modal Version */}
      {showSizeBot && (
        <ModernSizeBot
          productType={productType}
          onSizeSelected={handleSizeRecommendation}
          onClose={() => setShowSizeBot(false)}
          isModal={true}
        />
      )}
    </>
  );
}