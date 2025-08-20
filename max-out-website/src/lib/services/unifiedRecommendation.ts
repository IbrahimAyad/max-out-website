'use client';

import { fashionClipService } from './fashionClipService';
import { knowledgeBankAdapter } from './knowledgeBankAdapter';
import { smartBundles } from './smartBundles';
import { 
  KNOWLEDGE_BANK_CONFIG, 
  mapColorToKnowledgeBank, 
  mapOccasionToKnowledgeBank,
  calculateUnifiedScore 
} from '../config/knowledgeBank.config';

export interface UnifiedRecommendation {
  id: string;
  suit: {
    color: string;
    name: string;
    imageUrl: string;
    price: number;
  };
  shirt: {
    color: string;
    name: string;
    imageUrl: string;
    price: number;
  };
  tie: {
    color: string;
    pattern?: string;
    name: string;
    imageUrl: string;
    price: number;
  };
  scores: {
    unified: number;
    fashionClip: number;
    knowledgeBank: number;
    conversion?: number;
    customerRating?: number;
    trending?: number;
  };
  metadata: {
    occasions: string[];
    seasons: string[];
    styleProfiles: string[];
    warnings?: string[];
    insights: string[];
  };
  bundle: {
    totalPrice: number;
    discountedPrice: number;
    savings: number;
  };
}

class UnifiedRecommendationService {
  private initialized = false;

  /**
   * Initialize the service with knowledge bank data
   */
  async initialize() {
    if (this.initialized) return;

    try {
      await knowledgeBankAdapter.initialize();
      this.initialized = true;

    } catch (error) {

    }
  }

  /**
   * Get unified recommendations combining Fashion-CLIP and Knowledge Bank
   */
  async getRecommendations(params: {
    occasion?: string;
    season?: string;
    stylePreference?: string;
    colorPreferences?: string[];
    budget?: { min: number; max: number };
    imageFile?: File;
    limit?: number;
  }): Promise<UnifiedRecommendation[]> {
    await this.initialize();

    // Step 1: Get Fashion-CLIP recommendations if image provided
    let fashionClipRecs: any[] = [];
    if (params.imageFile) {
      const analysis = await fashionClipService.analyzeImage(params.imageFile);
      if (analysis) {
        fashionClipRecs = await fashionClipService.getImageBasedRecommendations(params.imageFile);
      }
    }

    // Step 2: Get Knowledge Bank recommendations
    const kbParams = {
      occasion: params.occasion ? mapOccasionToKnowledgeBank(params.occasion) : undefined,
      season: params.season,
      styleProfile: params.stylePreference,
      budget: params.budget,
      excludeColors: params.colorPreferences?.filter(c => c.startsWith('!'))
        .map(c => mapColorToKnowledgeBank(c.substring(1)))
    };

    const kbRecommendations = await knowledgeBankAdapter.getRecommendations(kbParams);

    // Step 3: Get trending combinations
    const trendingCombos = await knowledgeBankAdapter.getTrendingCombinations(5);

    // Step 4: Merge and score all recommendations
    const allRecommendations = await this.mergeRecommendations(
      fashionClipRecs,
      kbRecommendations,
      trendingCombos,
      params
    );

    // Step 5: Validate combinations
    const validatedRecs = await this.validateRecommendations(allRecommendations);

    // Step 6: Sort by unified score and limit
    return validatedRecs
      .sort((a, b) => b.scores.unified - a.scores.unified)
      .slice(0, params.limit || 10);
  }

  /**
   * Validate a specific combination
   */
  async validateCombination(
    suit: string,
    shirt: string,
    tie: string
  ): Promise<{
    valid: boolean;
    score: number;
    warnings?: string[];
    suggestions?: string[];
  }> {
    // Map colors to knowledge bank format
    const mappedSuit = mapColorToKnowledgeBank(suit);
    const mappedShirt = mapColorToKnowledgeBank(shirt);
    const mappedTie = mapColorToKnowledgeBank(tie);

    // Get validation from knowledge bank
    const validation = await knowledgeBankAdapter.validateCombination(
      mappedSuit,
      mappedShirt,
      mappedTie
    );

    // Get color relationships
    const colorRelations = await knowledgeBankAdapter.getColorRelationships(mappedSuit);

    // Enhanced validation with color rules
    if (colorRelations) {
      const shirtMatch = 
        colorRelations.perfect_matches.shirts.includes(mappedShirt) ||
        colorRelations.good_matches.shirts.includes(mappedShirt);

      const tieMatch = 
        colorRelations.perfect_matches.ties.includes(mappedTie) ||
        colorRelations.good_matches.ties.includes(mappedTie);

      if (!shirtMatch) {
        if (!validation.warnings) validation.warnings = [];
        validation.warnings.push(`${shirt} shirt may not be ideal with ${suit} suit`);
      }

      if (!tieMatch) {
        if (!validation.warnings) validation.warnings = [];
        validation.warnings.push(`${tie} tie may not complement ${suit} suit well`);
      }
    }

    return validation;
  }

  /**
   * Get style-specific recommendations
   */
  async getStyleBasedRecommendations(
    styleProfile: string,
    context?: {
      occasion?: string;
      season?: string;
      recentPurchases?: string[];
    }
  ): Promise<UnifiedRecommendation[]> {
    // Get style profile data
    const profile = await knowledgeBankAdapter.getStyleProfile(styleProfile);

    if (!profile) {
      // Fallback to general recommendations
      return this.getRecommendations({
        stylePreference: styleProfile,
        occasion: context?.occasion,
        season: context?.season
      });
    }

    // Get recommendations based on profile preferences
    const recommendations = await this.getRecommendations({
      stylePreference: styleProfile,
      colorPreferences: profile.characteristics.color_preferences,
      occasion: context?.occasion,
      season: context?.season
    });

    // Filter out recent purchases if provided
    if (context?.recentPurchases) {
      return recommendations.filter(rec => {
        const comboId = `${rec.suit.color}_${rec.shirt.color}_${rec.tie.color}`;
        return !context.recentPurchases!.includes(comboId);
      });
    }

    return recommendations;
  }

  /**
   * Enhance Fashion-CLIP recommendations with Knowledge Bank data
   */
  async enhanceWithBusinessIntelligence(
    fashionClipRecommendations: any[]
  ): Promise<any[]> {
    return knowledgeBankAdapter.enhanceWithKnowledgeBank(
      fashionClipRecommendations,
      {}
    );
  }

  // Private helper methods
  private async mergeRecommendations(
    fashionClipRecs: any[],
    kbRecommendations: any[],
    trendingCombos: any[],
    params: any
  ): Promise<UnifiedRecommendation[]> {
    const recommendationMap = new Map<string, UnifiedRecommendation>();

    // Process Fashion-CLIP recommendations
    for (const fcRec of fashionClipRecs) {
      const id = `${fcRec.suit}_${fcRec.shirt}_${fcRec.tie}`;
      recommendationMap.set(id, await this.createUnifiedRecommendation(fcRec, 'fashionclip'));
    }

    // Process Knowledge Bank recommendations
    for (const kbRec of kbRecommendations) {
      const id = `${kbRec.suit}_${kbRec.shirt}_${kbRec.tie}`;

      if (recommendationMap.has(id)) {
        // Merge with existing
        const existing = recommendationMap.get(id)!;
        existing.scores.knowledgeBank = kbRec.score;
        existing.metadata.occasions = [...new Set([...existing.metadata.occasions, ...kbRec.occasions])];
      } else {
        recommendationMap.set(id, await this.createUnifiedRecommendation(kbRec, 'knowledgebank'));
      }
    }

    // Add trending data
    for (const trending of trendingCombos) {
      const id = `${trending.combination.suit}_${trending.combination.shirt}_${trending.combination.tie}`;

      if (recommendationMap.has(id)) {
        const existing = recommendationMap.get(id)!;
        existing.scores.trending = trending.trendScore;
        existing.metadata.insights.push(`Trending up ${trending.growth}%`);
      }
    }

    // Get conversion data for all recommendations
    await this.enrichWithConversionData(recommendationMap);

    // Calculate unified scores
    for (const rec of recommendationMap.values()) {
      rec.scores.unified = calculateUnifiedScore({
        fashionClip: rec.scores.fashionClip,
        knowledgeBank: rec.scores.knowledgeBank,
        conversion: rec.scores.conversion,
        customerRating: rec.scores.customerRating,
        trending: rec.scores.trending
      });
    }

    return Array.from(recommendationMap.values());
  }

  private async createUnifiedRecommendation(
    sourceRec: any,
    source: 'fashionclip' | 'knowledgebank'
  ): Promise<UnifiedRecommendation> {
    // Mock product data - in production this would come from your product database
    const products = {
      suits: {
        navy: { name: 'Navy Business Suit', price: 599, imageUrl: '/images/navy-suit.jpg' },
        charcoal: { name: 'Charcoal Suit', price: 649, imageUrl: '/images/charcoal-suit.jpg' },
        grey: { name: 'Light Grey Suit', price: 579, imageUrl: '/images/grey-suit.jpg' }
      },
      shirts: {
        white: { name: 'Classic White Shirt', price: 89, imageUrl: '/images/white-shirt.jpg' },
        light_blue: { name: 'Light Blue Shirt', price: 95, imageUrl: '/images/blue-shirt.jpg' },
        pink: { name: 'Pink Oxford Shirt', price: 99, imageUrl: '/images/pink-shirt.jpg' }
      },
      ties: {
        burgundy: { name: 'Burgundy Silk Tie', price: 65, imageUrl: '/images/burgundy-tie.jpg' },
        silver: { name: 'Silver Pattern Tie', price: 70, imageUrl: '/images/silver-tie.jpg' },
        navy: { name: 'Navy Repp Tie', price: 60, imageUrl: '/images/navy-tie.jpg' }
      }
    };

    const suit = products.suits[sourceRec.suit as keyof typeof products.suits] || products.suits.navy;
    const shirt = products.shirts[sourceRec.shirt as keyof typeof products.shirts] || products.shirts.white;
    const tie = products.ties[sourceRec.tie as keyof typeof products.ties] || products.ties.burgundy;

    const totalPrice = suit.price + shirt.price + tie.price;
    const discountedPrice = totalPrice * 0.9; // 10% bundle discount

    return {
      id: `${sourceRec.suit}_${sourceRec.shirt}_${sourceRec.tie}`,
      suit: { color: sourceRec.suit, ...suit },
      shirt: { color: sourceRec.shirt, ...shirt },
      tie: { color: sourceRec.tie, ...tie },
      scores: {
        unified: 0, // Will be calculated later
        fashionClip: source === 'fashionclip' ? sourceRec.score || 80 : 0,
        knowledgeBank: source === 'knowledgebank' ? sourceRec.score || 80 : 0
      },
      metadata: {
        occasions: sourceRec.occasions || [],
        seasons: sourceRec.seasons || ['year-round'],
        styleProfiles: [],
        insights: []
      },
      bundle: {
        totalPrice,
        discountedPrice,
        savings: totalPrice - discountedPrice
      }
    };
  }

  private async enrichWithConversionData(
    recommendationMap: Map<string, UnifiedRecommendation>
  ) {
    for (const [id, rec] of recommendationMap) {
      const conversionData = await knowledgeBankAdapter.getConversionData(id);

      if (conversionData) {
        rec.scores.conversion = conversionData.conversion_rate;
        rec.scores.customerRating = conversionData.customer_rating;

        if (conversionData.conversion_rate > 20) {
          rec.metadata.insights.push(`High conversion rate: ${conversionData.conversion_rate}%`);
        }

        if (conversionData.customer_rating >= 4.5) {
          rec.metadata.insights.push(`Highly rated: ${conversionData.customer_rating}/5 stars`);
        }
      }
    }
  }

  private async validateRecommendations(
    recommendations: UnifiedRecommendation[]
  ): Promise<UnifiedRecommendation[]> {
    const validatedRecs: UnifiedRecommendation[] = [];

    for (const rec of recommendations) {
      const validation = await this.validateCombination(
        rec.suit.color,
        rec.shirt.color,
        rec.tie.color
      );

      if (validation.valid) {
        if (validation.warnings && validation.warnings.length > 0) {
          rec.metadata.warnings = validation.warnings;
        }

        validatedRecs.push(rec);
      }
    }

    return validatedRecs;
  }
}

export const unifiedRecommendation = new UnifiedRecommendationService();