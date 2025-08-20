'use client';

/**
 * Knowledge Bank Adapter Service
 * Bridges the AI Suit-Shirt-Tie knowledge bank with our Fashion-CLIP infrastructure
 */

export interface ColorRelationship {
  perfect_matches: {
    shirts: string[];
    ties: string[];
    confidence: number;
  };
  good_matches: {
    shirts: string[];
    ties: string[];
    confidence: number;
  };
  seasonal_boosts?: {
    [season: string]: string[];
  };
}

export interface CombinationRule {
  suit: string;
  shirt: string;
  tie: string;
  score: number;
  occasions: string[];
  avoid?: boolean;
  reason?: string;
}

export interface StyleProfile {
  id: string;
  name: string;
  characteristics: {
    color_preferences: string[];
    pattern_tolerance: 'low' | 'medium' | 'high';
    adventure_level: 'minimal' | 'moderate' | 'high';
    brand_loyalty: 'low' | 'medium' | 'high';
    price_sensitivity: 'low' | 'medium' | 'high';
  };
  preferred_combinations: Array<{
    combo: string;
    confidence: number;
  }>;
  messaging_preferences: {
    tone: string;
    focus: string;
    avoid?: string;
  };
}

export interface ConversionData {
  combination_id: string;
  conversion_rate: number;
  units_sold: number;
  customer_rating: number;
  instagram_engagement?: number;
  seasonal_performance?: {
    [season: string]: number;
  };
}

class KnowledgeBankAdapter {
  private apiUrl: string;
  private apiKey: string;
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Configure with Railway API endpoint V2
    this.apiUrl = process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_API || 'https://kct-knowledge-api-2-production.up.railway.app';
    this.apiKey = process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_KEY || '';
  }

  /**
   * Initialize the adapter with static data
   * This will be called on app startup to load core rules
   */
  async initialize() {
    try {
      // Load critical data that rarely changes
      await Promise.all([
        this.loadColorRelationships(),
        this.loadNeverCombineRules(),
        this.loadStyleProfiles()
      ]);

    } catch (error) {

    }
  }

  /**
   * Get color relationships from the knowledge bank
   * Since the API doesn't have a direct colors endpoint, we'll use rules and static data
   */
  async getColorRelationships(suitColor: string): Promise<ColorRelationship | null> {
    const cacheKey = `color_${suitColor}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Get rules from the API V2
      const rulesResponse = await fetch(`${this.apiUrl}/api/v2/rules`, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (rulesResponse.ok) {
        const rulesData = await rulesResponse.json();
        // Process rules to extract color relationships
        // For now, we'll use static data enhanced with rules
        const staticRelationship = this.getStaticColorRelationship(suitColor);

        if (staticRelationship && rulesData.success) {
          // Enhance with never-combine rules
          const neverCombine = rulesData.data.absolute_never_combine || [];
          // Filter out any colors that are in never-combine rules
          // This is a simplified implementation
          this.cache.set(cacheKey, staticRelationship);
          setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
          return staticRelationship;
        }
      }

      throw new Error('Failed to fetch from API');
    } catch (error) {

      // Fallback to static data
      return this.getStaticColorRelationship(suitColor);
    }
  }

  /**
   * Validate a combination against knowledge bank rules
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
    try {
      // Fetch rules to validate against V2
      const rulesResponse = await fetch(`${this.apiUrl}/api/v2/rules`, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (rulesResponse.ok) {
        const rulesData = await rulesResponse.json();
        if (rulesData.success) {
          const warnings: string[] = [];
          let score = 100;

          // Check against never-combine rules
          const neverCombine = rulesData.data.absolute_never_combine || [];
          for (const rule of neverCombine) {
            if (this.matchesRule(rule.combination, { suit, shirt, tie })) {
              warnings.push(rule.reason);
              score -= rule.severity === 'critical' ? 50 : 25;
            }
          }

          return {
            valid: warnings.length === 0,
            score: Math.max(0, score),
            warnings: warnings.length > 0 ? warnings : undefined,
            suggestions: warnings.length > 0 ? ['Consider a different combination'] : undefined
          };
        }
      }

      throw new Error('Failed to fetch rules');
    } catch (error) {

      // Fallback to basic validation
      return {
        valid: true,
        score: 75,
        warnings: ['Could not validate against full rule set']
      };
    }
  }

  /**
   * Helper to match a rule against a combination
   */
  private matchesRule(rule: any, combo: { suit: string; shirt: string; tie: string }): boolean {
    if (rule.suit && rule.suit !== 'any' && rule.suit !== combo.suit) return false;
    if (rule.shirt && rule.shirt !== combo.shirt) {
      // Check special cases like 'same_exact_color'
      if (rule.shirt === 'same_exact_color' && combo.suit === combo.shirt) return true;
      return false;
    }
    if (rule.tie && rule.tie !== '*' && rule.tie !== combo.tie) return false;
    return true;
  }

  /**
   * Get personalized recommendations based on style profile
   */
  async getRecommendations(options: {
    occasion?: string;
    season?: string;
    styleProfile?: string;
    budget?: { min: number; max: number };
    excludeColors?: string[];
  }): Promise<CombinationRule[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v2/recommendations`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        throw new Error(`Recommendations failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.recommendations;
    } catch (error) {

      // Fallback to mock recommendations
      return this.getMockRecommendations(options);
    }
  }

  /**
   * Get conversion data for pricing optimization
   */
  async getConversionData(combinationId: string): Promise<ConversionData | null> {
    const cacheKey = `conversion_${combinationId}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/v2/analytics/conversions/${combinationId}`, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversion data: ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, data);

      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

      return data;
    } catch (error) {

      return null;
    }
  }

  /**
   * Get trending combinations
   */
  async getTrendingCombinations(limit: number = 10): Promise<Array<{
    combination: CombinationRule;
    trendScore: number;
    growth: number;
  }>> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v2/intelligence/trending`, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch trending: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        // Transform API response to our format
        return data.data.slice(0, limit).map((item: any) => ({
          combination: {
            suit: item.combination?.suit || '',
            shirt: item.combination?.shirt || '',
            tie: item.combination?.tie || '',
            score: item.score || 0,
            occasions: ['trending'] // Default occasions
          },
          trendScore: item.score || 0,
          growth: parseFloat(item.growth?.replace('%', '').replace('+', '') || '0')
        }));
      }

      return [];
    } catch (error) {

      return [];
    }
  }

  /**
   * Get style profile data for customer
   */
  async getStyleProfile(profileType: string): Promise<StyleProfile | null> {
    const cacheKey = `profile_${profileType}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/v2/profiles/${profileType}`, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch style profile: ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, data);

      return data;
    } catch (error) {

      // Fallback to static profile
      return this.getStaticStyleProfile(profileType);
    }
  }

  /**
   * Merge Fashion-CLIP recommendations with Knowledge Bank rules
   */
  async enhanceWithKnowledgeBank(
    fashionClipRecommendations: any[],
    context: {
      occasion?: string;
      season?: string;
      customerProfile?: string;
    }
  ): Promise<any[]> {
    // Get knowledge bank recommendations
    const kbRecommendations = await this.getRecommendations(context);

    // Get conversion data for scoring
    const conversionPromises = fashionClipRecommendations.map(rec => 
      this.getConversionData(`${rec.suit}_${rec.shirt}_${rec.tie}`)
    );
    const conversionData = await Promise.all(conversionPromises);

    // Merge and score recommendations
    return fashionClipRecommendations.map((rec, index) => {
      const kbMatch = kbRecommendations.find(kb => 
        kb.suit === rec.suit && kb.shirt === rec.shirt && kb.tie === rec.tie
      );

      const conversion = conversionData[index];

      return {
        ...rec,
        knowledgeBankScore: kbMatch?.score || 0,
        conversionRate: conversion?.conversion_rate || 0,
        customerRating: conversion?.customer_rating || 0,
        combinedScore: this.calculateCombinedScore(rec, kbMatch, conversion),
        insights: {
          hasKnowledgeBankData: !!kbMatch,
          hasConversionData: !!conversion,
          occasions: kbMatch?.occasions || [],
          warnings: kbMatch?.avoid ? [kbMatch.reason] : []
        }
      };
    }).sort((a, b) => b.combinedScore - a.combinedScore);
  }

  // Private helper methods
  private async loadColorRelationships() {
    // This will be replaced with actual API call or static import
    const colorData = {
      navy: {
        perfect_matches: {
          shirts: ['white', 'light_blue', 'pink'],
          ties: ['burgundy', 'silver', 'gold'],
          confidence: 98
        }
      },
      charcoal: {
        perfect_matches: {
          shirts: ['white', 'light_blue', 'grey'],
          ties: ['burgundy', 'silver', 'navy'],
          confidence: 96
        }
      }
    };

    Object.entries(colorData).forEach(([color, data]) => {
      this.cache.set(`color_${color}`, data);
    });
  }

  private async loadNeverCombineRules() {
    // Will be loaded from API or static file
    const rules = [
      { suit: 'black', shirt: 'brown', tie: '*', reason: 'Color clash' },
      { suit: 'navy', shirt: 'navy', tie: 'navy', reason: 'Monochrome overload' }
    ];

    this.cache.set('never_combine_rules', rules);
  }

  private async loadStyleProfiles() {
    // Will be loaded from API or static file
    const profiles = {
      classic_conservative: {
        id: 'classic_conservative',
        name: 'Classic Conservative',
        characteristics: {
          color_preferences: ['navy', 'charcoal', 'grey'],
          pattern_tolerance: 'low' as const,
          adventure_level: 'minimal' as const,
          brand_loyalty: 'high' as const,
          price_sensitivity: 'medium' as const
        },
        preferred_combinations: [
          { combo: 'navy_white_burgundy', confidence: 98 }
        ],
        messaging_preferences: {
          tone: 'professional',
          focus: 'quality and tradition'
        }
      }
    };

    this.cache.set('style_profiles', profiles);
  }

  private getMockRecommendations(options: any): CombinationRule[] {
    // Fallback recommendations when API is unavailable
    return [
      {
        suit: 'navy',
        shirt: 'white',
        tie: 'burgundy',
        score: 95,
        occasions: ['business', 'wedding', 'formal']
      },
      {
        suit: 'charcoal',
        shirt: 'light_blue',
        tie: 'silver',
        score: 92,
        occasions: ['business', 'interview']
      }
    ];
  }

  private calculateCombinedScore(
    fashionClipRec: any,
    kbMatch: CombinationRule | undefined,
    conversion: ConversionData | null
  ): number {
    let score = 0;

    // Fashion-CLIP visual score (40% weight)
    score += (fashionClipRec.score || 0) * 0.4;

    // Knowledge Bank rule score (30% weight)
    score += (kbMatch?.score || 50) * 0.3;

    // Conversion rate score (20% weight)
    if (conversion) {
      score += (conversion.conversion_rate || 0) * 0.2;
    }

    // Customer rating score (10% weight)
    if (conversion?.customer_rating) {
      score += (conversion.customer_rating / 5) * 100 * 0.1;
    }

    return Math.round(score);
  }

  private getStaticColorRelationship(suitColor: string): ColorRelationship | null {
    const staticRelationships: Record<string, ColorRelationship> = {
      navy: {
        perfect_matches: {
          shirts: ['white', 'light_blue', 'pink'],
          ties: ['burgundy', 'silver', 'gold'],
          confidence: 98
        },
        good_matches: {
          shirts: ['grey', 'lavender'],
          ties: ['navy_pattern', 'red'],
          confidence: 85
        },
        seasonal_boosts: {
          summer: ['pink', 'light_blue'],
          winter: ['burgundy', 'gold']
        }
      },
      charcoal: {
        perfect_matches: {
          shirts: ['white', 'light_blue', 'grey'],
          ties: ['burgundy', 'silver', 'navy'],
          confidence: 96
        },
        good_matches: {
          shirts: ['pink', 'lavender'],
          ties: ['gold', 'red'],
          confidence: 82
        }
      },
      grey: {
        perfect_matches: {
          shirts: ['white', 'light_blue', 'pink'],
          ties: ['navy', 'burgundy', 'silver'],
          confidence: 94
        },
        good_matches: {
          shirts: ['lavender', 'grey'],
          ties: ['gold', 'red_pattern'],
          confidence: 80
        }
      },
      black: {
        perfect_matches: {
          shirts: ['white'],
          ties: ['silver', 'gold', 'red'],
          confidence: 92
        },
        good_matches: {
          shirts: ['light_grey'],
          ties: ['burgundy', 'navy'],
          confidence: 78
        }
      }
    };

    return suitColor in staticRelationships 
      ? staticRelationships[suitColor as keyof typeof staticRelationships]
      : null;
  }

  private getStaticStyleProfile(profileType: string): StyleProfile | null {
    const staticProfiles: Record<string, StyleProfile> = {
      classic_conservative: {
        id: 'classic_conservative',
        name: 'Classic Conservative',
        characteristics: {
          color_preferences: ['navy', 'charcoal', 'grey'],
          pattern_tolerance: 'low',
          adventure_level: 'minimal',
          brand_loyalty: 'high',
          price_sensitivity: 'medium'
        },
        preferred_combinations: [
          { combo: 'navy_white_burgundy', confidence: 98 },
          { combo: 'charcoal_light_blue_silver', confidence: 95 },
          { combo: 'grey_white_navy', confidence: 93 }
        ],
        messaging_preferences: {
          tone: 'professional',
          focus: 'quality and tradition',
          avoid: 'trendy language'
        }
      },
      modern_professional: {
        id: 'modern_professional',
        name: 'Modern Professional',
        characteristics: {
          color_preferences: ['navy', 'charcoal', 'burgundy'],
          pattern_tolerance: 'medium',
          adventure_level: 'moderate',
          brand_loyalty: 'medium',
          price_sensitivity: 'low'
        },
        preferred_combinations: [
          { combo: 'navy_pink_silver', confidence: 92 },
          { combo: 'charcoal_lavender_burgundy', confidence: 90 }
        ],
        messaging_preferences: {
          tone: 'confident',
          focus: 'style and success'
        }
      },
      fashion_forward: {
        id: 'fashion_forward',
        name: 'Fashion Forward',
        characteristics: {
          color_preferences: ['burgundy', 'olive', 'light_grey'],
          pattern_tolerance: 'high',
          adventure_level: 'high',
          brand_loyalty: 'low',
          price_sensitivity: 'low'
        },
        preferred_combinations: [
          { combo: 'burgundy_pink_gold', confidence: 88 },
          { combo: 'olive_white_burgundy_pattern', confidence: 85 }
        ],
        messaging_preferences: {
          tone: 'trendy',
          focus: 'unique style and expression'
        }
      }
    };

    return profileType in staticProfiles
      ? staticProfiles[profileType as keyof typeof staticProfiles]
      : null;
  }
}

export const knowledgeBankAdapter = new KnowledgeBankAdapter();