'use client';

import { fashionClipService } from './fashionClipService';

export interface PricingContext {
  productId: string;
  basePrice: number;
  currentInventory: number;
  salesVelocity: number; // units sold per day
  seasonality: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
  competitorPrices: number[];
  customerSegment: 'budget' | 'mid-market' | 'premium' | 'luxury';
  timeOfYear: Date;
  trendScore: number; // 0-100 based on Fashion-CLIP trend analysis
}

export interface PriceRecommendation {
  recommendedPrice: number;
  originalPrice: number;
  adjustmentPercentage: number;
  confidence: number;
  reasoning: string[];
  factors: {
    trendAdjustment: number;
    inventoryAdjustment: number;
    competitionAdjustment: number;
    seasonalAdjustment: number;
    velocityAdjustment: number;
  };
  validUntil: Date;
  minPrice: number;
  maxPrice: number;
}

export interface TrendAnalysis {
  productId: string;
  trendScore: number;
  trendDirection: 'rising' | 'falling' | 'stable';
  trendVelocity: number; // rate of change
  seasonalPattern: number[];
  competitorAnalysis: {
    averagePrice: number;
    priceRange: [number, number];
    marketPosition: 'below' | 'at' | 'above';
  };
  demandForecast: {
    next7Days: number;
    next30Days: number;
    next90Days: number;
  };
  stylePopularity: {
    currentRank: number;
    trendinessScore: number;
    lifeCycleStage: 'emerging' | 'growing' | 'mature' | 'declining';
  };
}

class DynamicPricingService {
  private readonly MAX_ADJUSTMENT = 0.3; // 30% max price adjustment
  private readonly MIN_MARKUP = 0.1; // 10% minimum markup
  private trendCache: Map<string, TrendAnalysis> = new Map();
  private priceHistory: Map<string, number[]> = new Map();

  /**
   * Calculate optimal price for a product based on various factors
   */
  async calculateOptimalPrice(context: PricingContext): Promise<PriceRecommendation> {
    const trendAnalysis = await this.analyzeTrend(context.productId, context);
    
    let adjustmentFactor = 1.0;
    const factors = {
      trendAdjustment: 0,
      inventoryAdjustment: 0,
      competitionAdjustment: 0,
      seasonalAdjustment: 0,
      velocityAdjustment: 0
    };

    const reasoning: string[] = [];

    // Fashion-CLIP trend adjustment (±15%)
    const trendAdjustment = this.calculateTrendAdjustment(trendAnalysis);
    factors.trendAdjustment = trendAdjustment;
    adjustmentFactor += trendAdjustment;
    
    if (trendAdjustment > 0.05) {
      reasoning.push(`+${Math.round(trendAdjustment * 100)}% for high trend score (${trendAnalysis.trendScore}/100)`);
    } else if (trendAdjustment < -0.05) {
      reasoning.push(`${Math.round(trendAdjustment * 100)}% for declining trend`);
    }

    // Inventory-based adjustment (±20%)
    const inventoryAdjustment = this.calculateInventoryAdjustment(
      context.currentInventory,
      context.salesVelocity
    );
    factors.inventoryAdjustment = inventoryAdjustment;
    adjustmentFactor += inventoryAdjustment;
    
    if (inventoryAdjustment < -0.05) {
      reasoning.push(`${Math.round(inventoryAdjustment * 100)}% to clear excess inventory`);
    } else if (inventoryAdjustment > 0.05) {
      reasoning.push(`+${Math.round(inventoryAdjustment * 100)}% due to low inventory`);
    }

    // Competition-based adjustment (±10%)
    const competitionAdjustment = this.calculateCompetitionAdjustment(
      context.basePrice,
      context.competitorPrices,
      context.customerSegment
    );
    factors.competitionAdjustment = competitionAdjustment;
    adjustmentFactor += competitionAdjustment;
    
    if (Math.abs(competitionAdjustment) > 0.02) {
      const direction = competitionAdjustment > 0 ? 'above' : 'below';
      reasoning.push(`${Math.round(competitionAdjustment * 100)}% to position ${direction} competition`);
    }

    // Seasonal adjustment (±15%)
    const seasonalAdjustment = this.calculateSeasonalAdjustment(
      context.seasonality,
      context.timeOfYear
    );
    factors.seasonalAdjustment = seasonalAdjustment;
    adjustmentFactor += seasonalAdjustment;
    
    if (Math.abs(seasonalAdjustment) > 0.05) {
      reasoning.push(`${Math.round(seasonalAdjustment * 100)}% seasonal adjustment`);
    }

    // Sales velocity adjustment (±10%)
    const velocityAdjustment = this.calculateVelocityAdjustment(
      context.salesVelocity,
      trendAnalysis.demandForecast
    );
    factors.velocityAdjustment = velocityAdjustment;
    adjustmentFactor += velocityAdjustment;

    // Apply limits
    adjustmentFactor = Math.max(
      1 - this.MAX_ADJUSTMENT,
      Math.min(1 + this.MAX_ADJUSTMENT, adjustmentFactor)
    );

    const recommendedPrice = context.basePrice * adjustmentFactor;
    const adjustmentPercentage = (adjustmentFactor - 1) * 100;

    // Calculate confidence based on data quality
    const confidence = this.calculateConfidence(context, trendAnalysis);

    // Set price bounds
    const minPrice = context.basePrice * (1 + this.MIN_MARKUP);
    const maxPrice = context.basePrice * (1 + this.MAX_ADJUSTMENT);

    return {
      recommendedPrice: Math.max(minPrice, Math.min(maxPrice, recommendedPrice)),
      originalPrice: context.basePrice,
      adjustmentPercentage,
      confidence,
      reasoning,
      factors,
      validUntil: this.calculateValidityPeriod(context),
      minPrice,
      maxPrice
    };
  }

  /**
   * Analyze product trend using Fashion-CLIP
   */
  async analyzeTrend(productId: string, context: PricingContext): Promise<TrendAnalysis> {
    const cached = this.trendCache.get(productId);
    if (cached && this.isCacheValid(cached)) {
      return cached;
    }

    // Mock Fashion-CLIP trend analysis
    // In production, this would analyze:
    // - Product image embeddings vs trending styles
    // - Customer upload patterns
    // - Social media style trends
    // - Purchase pattern analysis
    
    const trendScore = this.mockFashionClipTrendScore(context);
    const trendDirection = this.determineTrendDirection(trendScore);
    const trendVelocity = this.calculateTrendVelocity(productId, trendScore);

    const analysis: TrendAnalysis = {
      productId,
      trendScore,
      trendDirection,
      trendVelocity,
      seasonalPattern: this.generateSeasonalPattern(context.seasonality),
      competitorAnalysis: {
        averagePrice: context.competitorPrices.reduce((a, b) => a + b, 0) / context.competitorPrices.length,
        priceRange: [Math.min(...context.competitorPrices), Math.max(...context.competitorPrices)],
        marketPosition: this.determineMarketPosition(context.basePrice, context.competitorPrices)
      },
      demandForecast: this.forecastDemand(context, trendScore),
      stylePopularity: {
        currentRank: Math.floor(Math.random() * 100) + 1,
        trendinessScore: trendScore,
        lifeCycleStage: this.determineLifeCycleStage(trendScore, context.salesVelocity)
      }
    };

    this.trendCache.set(productId, analysis);
    return analysis;
  }

  /**
   * Get pricing recommendations for multiple products
   */
  async getBulkPricingRecommendations(
    contexts: PricingContext[]
  ): Promise<Map<string, PriceRecommendation>> {
    const recommendations = new Map<string, PriceRecommendation>();
    
    // Process in batches to avoid overwhelming the system
    const batchSize = 10;
    for (let i = 0; i < contexts.length; i += batchSize) {
      const batch = contexts.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (context) => {
        const recommendation = await this.calculateOptimalPrice(context);
        return [context.productId, recommendation] as const;
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(([productId, recommendation]) => {
        recommendations.set(productId, recommendation);
      });
    }

    return recommendations;
  }

  /**
   * Monitor price performance and adjust strategies
   */
  async trackPricePerformance(
    productId: string,
    implementedPrice: number,
    salesData: {
      unitsSold: number;
      revenue: number;
      period: number; // days
    }
  ): Promise<{
    performanceScore: number;
    recommendations: string[];
    shouldAdjust: boolean;
  }> {
    const history = this.priceHistory.get(productId) || [];
    history.push(implementedPrice);
    this.priceHistory.set(productId, history.slice(-30)); // Keep last 30 price points

    const expectedVelocity = this.calculateExpectedVelocity(productId);
    const actualVelocity = salesData.unitsSold / salesData.period;
    
    const performanceScore = (actualVelocity / expectedVelocity) * 100;
    const recommendations: string[] = [];
    let shouldAdjust = false;

    if (performanceScore < 70) {
      recommendations.push('Consider price reduction to increase velocity');
      shouldAdjust = true;
    } else if (performanceScore > 130) {
      recommendations.push('Consider price increase due to high demand');
      shouldAdjust = true;
    }

    if (history.length > 5) {
      const priceVolatility = this.calculatePriceVolatility(history);
      if (priceVolatility > 0.15) {
        recommendations.push('Price has been volatile - consider stabilizing');
      }
    }

    return {
      performanceScore,
      recommendations,
      shouldAdjust
    };
  }

  // Private helper methods
  private calculateTrendAdjustment(analysis: TrendAnalysis): number {
    const baseAdjustment = (analysis.trendScore - 50) / 100 * 0.15; // ±15% max
    const velocityBonus = analysis.trendVelocity > 5 ? 0.05 : 0; // Extra 5% for fast-rising trends
    
    return baseAdjustment + velocityBonus;
  }

  private calculateInventoryAdjustment(inventory: number, velocity: number): number {
    const daysOfInventory = velocity > 0 ? inventory / velocity : 999;
    
    if (daysOfInventory > 90) {
      return -0.2; // 20% discount for excess inventory
    } else if (daysOfInventory > 60) {
      return -0.1; // 10% discount
    } else if (daysOfInventory < 14) {
      return 0.15; // 15% premium for low inventory
    } else if (daysOfInventory < 30) {
      return 0.08; // 8% premium
    }
    
    return 0;
  }

  private calculateCompetitionAdjustment(
    basePrice: number,
    competitorPrices: number[],
    segment: PricingContext['customerSegment']
  ): number {
    if (competitorPrices.length === 0) return 0;
    
    const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
    const priceRatio = basePrice / avgCompetitorPrice;
    
    // Different strategies by segment
    switch (segment) {
      case 'luxury':
        // Luxury can be 10-20% above competition
        return priceRatio < 1.1 ? 0.1 : 0;
      
      case 'premium':
        // Premium should be competitive but slightly above
        return priceRatio < 1.05 ? 0.05 : priceRatio > 1.15 ? -0.05 : 0;
      
      case 'mid-market':
        // Mid-market should match competition closely
        return priceRatio < 0.95 ? 0.05 : priceRatio > 1.05 ? -0.05 : 0;
      
      case 'budget':
        // Budget should be below competition
        return priceRatio > 0.9 ? -0.1 : 0;
      
      default:
        return 0;
    }
  }

  private calculateSeasonalAdjustment(
    seasonality: PricingContext['seasonality'],
    timeOfYear: Date
  ): number {
    if (seasonality === 'year-round') return 0;
    
    const month = timeOfYear.getMonth();
    const seasonMap = {
      spring: [2, 3, 4],
      summer: [5, 6, 7],
      fall: [8, 9, 10],
      winter: [11, 0, 1]
    };
    
    const isInSeason = seasonality in seasonMap 
      ? seasonMap[seasonality as keyof typeof seasonMap].includes(month)
      : false;
    const isPreSeason = seasonality in seasonMap
      ? seasonMap[seasonality as keyof typeof seasonMap].includes((month + 11) % 12)
      : false; // Month before
    
    if (isInSeason) {
      return 0.1; // 10% premium during season
    } else if (isPreSeason) {
      return 0.05; // 5% premium pre-season
    } else {
      return -0.15; // 15% discount off-season
    }
  }

  private calculateVelocityAdjustment(
    currentVelocity: number,
    forecast: TrendAnalysis['demandForecast']
  ): number {
    const forecastedVelocity = forecast.next30Days / 30;
    const velocityRatio = forecastedVelocity / Math.max(currentVelocity, 0.1);
    
    if (velocityRatio > 1.5) {
      return 0.1; // 10% increase for high forecasted demand
    } else if (velocityRatio < 0.7) {
      return -0.08; // 8% decrease for low forecasted demand
    }
    
    return 0;
  }

  private calculateConfidence(
    context: PricingContext,
    analysis: TrendAnalysis
  ): number {
    let confidence = 0.5; // Base confidence
    
    // More data = higher confidence
    if (context.competitorPrices.length >= 3) confidence += 0.15;
    if (context.salesVelocity > 0) confidence += 0.15;
    if (analysis.trendScore > 0) confidence += 0.1;
    if (context.currentInventory > 0) confidence += 0.1;
    
    return Math.min(confidence, 0.95); // Cap at 95%
  }

  private calculateValidityPeriod(context: PricingContext): Date {
    const now = new Date();
    let validityDays = 7; // Default 7 days
    
    // Shorter validity for fast-moving items
    if (context.salesVelocity > 5) {
      validityDays = 3;
    } else if (context.salesVelocity < 1) {
      validityDays = 14;
    }
    
    return new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000);
  }

  // Mock methods for demonstration
  private mockFashionClipTrendScore(context: PricingContext): number {
    // This would be replaced with actual Fashion-CLIP analysis
    const baseScore = 50;
    let score = baseScore;
    
    // Simulate trend based on seasonality
    if (context.seasonality !== 'year-round') {
      const isInSeason = this.isCurrentSeason(context.seasonality);
      score += isInSeason ? 20 : -10;
    }
    
    // Add some randomness for demo
    score += (Math.random() - 0.5) * 20;
    
    return Math.max(0, Math.min(100, score));
  }

  private isCurrentSeason(seasonality: PricingContext['seasonality']): boolean {
    const month = new Date().getMonth();
    const seasonMap = {
      spring: [2, 3, 4],
      summer: [5, 6, 7],
      fall: [8, 9, 10],
      winter: [11, 0, 1]
    };
    
    // Handle year-round items (always in season)
    if (seasonality === 'year-round') return true;
    
    return seasonality in seasonMap 
      ? seasonMap[seasonality as keyof typeof seasonMap].includes(month)
      : false;
  }

  private determineTrendDirection(trendScore: number): TrendAnalysis['trendDirection'] {
    if (trendScore > 65) return 'rising';
    if (trendScore < 35) return 'falling';
    return 'stable';
  }

  private calculateTrendVelocity(productId: string, currentScore: number): number {
    // Mock calculation - would compare with historical trend scores
    return Math.random() * 10; // 0-10 velocity
  }

  private generateSeasonalPattern(seasonality: PricingContext['seasonality']): number[] {
    // 12-month pattern
    const pattern = new Array(12).fill(1);
    
    if (seasonality !== 'year-round') {
      const seasonMap = {
        spring: [2, 3, 4],
        summer: [5, 6, 7],
        fall: [8, 9, 10],
        winter: [11, 0, 1]
      };
      
      if (seasonality in seasonMap) {
        seasonMap[seasonality as keyof typeof seasonMap].forEach(month => {
          pattern[month] = 1.3; // 30% boost in season
        });
      }
    }
    
    return pattern;
  }

  private determineMarketPosition(
    price: number,
    competitorPrices: number[]
  ): TrendAnalysis['competitorAnalysis']['marketPosition'] {
    if (competitorPrices.length === 0) return 'at';
    
    const avgPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
    
    if (price < avgPrice * 0.95) return 'below';
    if (price > avgPrice * 1.05) return 'above';
    return 'at';
  }

  private forecastDemand(
    context: PricingContext,
    trendScore: number
  ): TrendAnalysis['demandForecast'] {
    const baseDemand = context.salesVelocity * 7; // 7 days
    const trendMultiplier = trendScore / 50; // Normalized around 1.0
    
    return {
      next7Days: baseDemand * trendMultiplier,
      next30Days: baseDemand * 4 * trendMultiplier * 0.9, // Slight decay
      next90Days: baseDemand * 12 * trendMultiplier * 0.8  // More decay
    };
  }

  private determineLifeCycleStage(
    trendScore: number,
    velocity: number
  ): TrendAnalysis['stylePopularity']['lifeCycleStage'] {
    if (trendScore > 75 && velocity > 3) return 'growing';
    if (trendScore > 60) return 'mature';
    if (trendScore < 30) return 'declining';
    return 'emerging';
  }

  private isCacheValid(analysis: TrendAnalysis): boolean {
    // For demo purposes, cache is valid for 1 hour
    return true; // In production, check timestamp
  }

  private calculateExpectedVelocity(productId: string): number {
    // Mock calculation - would use historical data
    return 2; // 2 units per day expected
  }

  private calculatePriceVolatility(priceHistory: number[]): number {
    if (priceHistory.length < 2) return 0;
    
    const returns = [];
    for (let i = 1; i < priceHistory.length; i++) {
      returns.push((priceHistory[i] - priceHistory[i-1]) / priceHistory[i-1]);
    }
    
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((acc, ret) => acc + Math.pow(ret - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }
}

export const dynamicPricing = new DynamicPricingService();