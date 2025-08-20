'use client';

import React from 'react';
import { Tag, TrendingUp, Award, Crown } from 'lucide-react';
import { PricingTier } from '@/lib/products/enhanced/types';

interface PricingTierDisplayProps {
  pricingTiers: PricingTier[];
  currentPrice: number;
  className?: string;
  displayMode?: 'compact' | 'detailed' | 'chart';
  showAllTiers?: boolean;
}

export function PricingTierDisplay({
  pricingTiers,
  currentPrice,
  className = '',
  displayMode = 'compact',
  showAllTiers = false
}: PricingTierDisplayProps) {

  // Find current tier
  const currentTier = pricingTiers.find(tier => 
    currentPrice >= tier.price_range.min && currentPrice <= tier.price_range.max
  );

  // Sort tiers by tier_id
  const sortedTiers = [...pricingTiers].sort((a, b) => a.tier_id - b.tier_id);

  // Get tier icon
  const getTierIcon = (tierId: number) => {
    if (tierId <= 5) return <Tag size={16} className="text-gray-500" />;
    if (tierId <= 10) return <TrendingUp size={16} className="text-blue-500" />;
    if (tierId <= 15) return <Award size={16} className="text-purple-500" />;
    return <Crown size={16} className="text-yellow-500" />;
  };

  // Get tier color scheme
  const getTierColors = (tierId: number, isCurrent: boolean = false) => {
    let baseColors = '';
    
    if (tierId <= 5) {
      baseColors = 'from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    } else if (tierId <= 10) {
      baseColors = 'from-blue-100 to-blue-200 text-blue-800 border-blue-300';
    } else if (tierId <= 15) {
      baseColors = 'from-purple-100 to-purple-200 text-purple-800 border-purple-300';
    } else {
      baseColors = 'from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
    }

    if (isCurrent) {
      return `bg-gradient-to-br ${baseColors} border-2 shadow-md`;
    }
    
    return `bg-gradient-to-br ${baseColors} border opacity-70 hover:opacity-100`;
  };

  if (!pricingTiers || pricingTiers.length === 0) {
    return null;
  }

  // Compact Mode - Show only current tier
  if (displayMode === 'compact' && currentTier) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getTierColors(currentTier.tier_id, true)} ${className}`}>
        {getTierIcon(currentTier.tier_id)}
        <span>{currentTier.tier_name}</span>
        <span className="text-xs opacity-75">
          Tier {currentTier.tier_id}
        </span>
      </div>
    );
  }

  // Detailed Mode - Show current tier with description
  if (displayMode === 'detailed' && currentTier) {
    return (
      <div className={`p-4 rounded-lg border-2 ${getTierColors(currentTier.tier_id, true)} ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          {getTierIcon(currentTier.tier_id)}
          <div>
            <h3 className="font-semibold">{currentTier.tier_name}</h3>
            <p className="text-sm opacity-75">Tier {currentTier.tier_id} of {pricingTiers.length}</p>
          </div>
        </div>
        
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Price Range:</span> 
            ${currentTier.price_range.min} - ${currentTier.price_range.max}
          </p>
          {currentTier.description && (
            <p>
              <span className="font-medium">Description:</span> 
              {currentTier.description}
            </p>
          )}
          {currentTier.target_segment && (
            <p>
              <span className="font-medium">Target:</span> 
              {currentTier.target_segment}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Chart Mode - Show all tiers or filtered selection
  if (displayMode === 'chart') {
    const tiersToShow = showAllTiers ? sortedTiers : sortedTiers.slice(0, 8);

    return (
      <div className={`space-y-3 ${className}`}>
        <h4 className="font-semibold text-gray-900">Pricing Tiers</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tiersToShow.map((tier) => {
            const isCurrent = tier.tier_id === currentTier?.tier_id;
            
            return (
              <div
                key={tier.tier_id}
                className={`p-3 rounded-lg transition-all duration-200 ${getTierColors(tier.tier_id, isCurrent)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getTierIcon(tier.tier_id)}
                  <span className="text-xs font-medium">Tier {tier.tier_id}</span>
                </div>
                
                <div className="text-sm">
                  <p className="font-semibold truncate">{tier.tier_name}</p>
                  <p className="text-xs opacity-75">
                    ${tier.price_range.min} - ${tier.price_range.max}
                  </p>
                </div>

                {isCurrent && (
                  <div className="mt-1">
                    <span className="text-xs bg-white/50 px-1 py-0.5 rounded">
                      Current
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!showAllTiers && sortedTiers.length > 8 && (
          <p className="text-xs text-gray-500 text-center">
            Showing 8 of {sortedTiers.length} tiers
          </p>
        )}
      </div>
    );
  }

  return null;
}

// Simplified tier badge for use in cards
interface TierBadgeProps {
  tier: PricingTier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TierBadge({ tier, size = 'sm', className = '' }: TierBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const getTierIcon = () => {
    if (tier.tier_id <= 5) return <Tag size={12} />;
    if (tier.tier_id <= 10) return <TrendingUp size={12} />;
    if (tier.tier_id <= 15) return <Award size={12} />;
    return <Crown size={12} />;
  };

  const getTierColors = () => {
    if (tier.tier_id <= 5) return 'bg-gray-100 text-gray-800 border-gray-300';
    if (tier.tier_id <= 10) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (tier.tier_id <= 15) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses[size]} ${getTierColors()} ${className}`}>
      {getTierIcon()}
      {tier.tier_name}
    </span>
  );
}

// Tier progression component - shows where product sits in overall range
interface TierProgressionProps {
  pricingTiers: PricingTier[];
  currentPrice: number;
  className?: string;
}

export function TierProgression({ pricingTiers, currentPrice, className = '' }: TierProgressionProps) {
  const sortedTiers = [...pricingTiers].sort((a, b) => a.tier_id - b.tier_id);
  const currentTier = sortedTiers.find(tier => 
    currentPrice >= tier.price_range.min && currentPrice <= tier.price_range.max
  );

  if (!currentTier) return null;

  const totalTiers = sortedTiers.length;
  const currentPosition = currentTier.tier_id;
  const progressPercentage = (currentPosition / totalTiers) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span>Value Tier</span>
        <span>Premium Tier</span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-purple-500 rounded-full shadow-sm"
          style={{ left: `calc(${progressPercentage}% - 8px)` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-600">
        <span>Tier 1</span>
        <span className="font-medium text-purple-600">
          {currentTier.tier_name} (Tier {currentPosition})
        </span>
        <span>Tier {totalTiers}</span>
      </div>
    </div>
  );
}