/**
 * Smart Filter Engine with AI Capabilities
 * Provides intelligent product filtering, recommendations, and search
 */

import { UnifiedProduct, UnifiedProductFilters } from '@/types/unified-shop';

export interface SmartFilterConfig {
  // Basic filters
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  priceRange?: { min: number; max: number };
  occasions?: string[];
  
  // AI-powered filters
  searchQuery?: string;
  similarToProductId?: string;
  userPreferences?: UserPreferences;
  seasonalRelevance?: boolean;
  trendingOnly?: boolean;
  
  // Advanced options
  includeOutfitSuggestions?: boolean;
  includeAlternatives?: boolean;
  maxResults?: number;
  minScore?: number;
}

export interface UserPreferences {
  userId?: string;
  favoriteColors?: string[];
  preferredFit?: string[];
  pricePreference?: 'budget' | 'mid' | 'premium' | 'luxury';
  styleProfile?: 'classic' | 'modern' | 'trendy' | 'casual' | 'formal';
  occasions?: string[];
  avoidColors?: string[];
  sizes?: Record<string, string>; // category -> size mapping
}

export interface FilterResult {
  products: UnifiedProduct[];
  suggestions: FilterSuggestion[];
  alternativeFilters: AlternativeFilter[];
  outfitSuggestions?: OutfitSuggestion[];
  metadata: FilterMetadata;
}

export interface FilterSuggestion {
  type: 'color' | 'category' | 'occasion' | 'price' | 'style';
  value: string | number;
  displayName: string;
  confidence: number;
  reason: string;
  productCount: number;
}

export interface AlternativeFilter {
  name: string;
  filters: Partial<SmartFilterConfig>;
  expectedResults: number;
  relevanceScore: number;
}

export interface OutfitSuggestion {
  baseProduct: UnifiedProduct;
  suggestions: {
    category: string;
    products: UnifiedProduct[];
    reason: string;
  }[];
  totalPrice: number;
  savings?: number;
  occasionMatch: string[];
}

export interface FilterMetadata {
  totalMatches: number;
  appliedFilters: string[];
  searchTime: number;
  aiScoreRange: { min: number; max: number };
  priceRange: { min: number; max: number };
  topCategories: { name: string; count: number }[];
  topColors: { name: string; count: number }[];
}

export class SmartFilterEngine {
  private static instance: SmartFilterEngine;
  
  private constructor() {}
  
  static getInstance(): SmartFilterEngine {
    if (!this.instance) {
      this.instance = new SmartFilterEngine();
    }
    return this.instance;
  }
  
  /**
   * Main filtering function with AI enhancements
   */
  async applySmartFilters(
    products: UnifiedProduct[],
    config: SmartFilterConfig
  ): Promise<FilterResult> {
    const startTime = Date.now();
    
    // Step 1: Apply basic filters
    let filteredProducts = this.applyBasicFilters(products, config);
    
    // Step 2: Apply AI scoring
    filteredProducts = await this.applyAIScoring(filteredProducts, config);
    
    // Step 3: Sort by relevance
    filteredProducts = this.sortByRelevance(filteredProducts, config);
    
    // Step 4: Generate suggestions
    const suggestions = this.generateFilterSuggestions(products, filteredProducts, config);
    
    // Step 5: Find alternatives if results are too few
    const alternatives = filteredProducts.length < 5 
      ? this.findAlternativeFilters(products, config)
      : [];
    
    // Step 6: Generate outfit suggestions if requested
    const outfitSuggestions = config.includeOutfitSuggestions
      ? await this.generateOutfitSuggestions(filteredProducts, products, config)
      : undefined;
    
    // Step 7: Limit results
    if (config.maxResults) {
      filteredProducts = filteredProducts.slice(0, config.maxResults);
    }
    
    // Generate metadata
    const metadata = this.generateMetadata(filteredProducts, startTime);
    
    return {
      products: filteredProducts,
      suggestions,
      alternativeFilters: alternatives,
      outfitSuggestions,
      metadata
    };
  }
  
  /**
   * Apply basic filters (categories, colors, price, etc.)
   */
  private applyBasicFilters(
    products: UnifiedProduct[],
    config: SmartFilterConfig
  ): UnifiedProduct[] {
    return products.filter(product => {
      // Category filter
      if (config.categories?.length) {
        const productCategory = product.category?.toLowerCase();
        const matchesCategory = config.categories.some(
          cat => productCategory?.includes(cat.toLowerCase())
        );
        if (!matchesCategory) return false;
      }
      
      // Color filter
      if (config.colors?.length) {
        const productColors = this.extractProductColors(product);
        const matchesColor = config.colors.some(
          color => productColors.some(pc => pc.includes(color.toLowerCase()))
        );
        if (!matchesColor) return false;
      }
      
      // Size filter
      if (config.sizes?.length) {
        const productSizes = product.size || [];
        const matchesSize = config.sizes.some(
          size => productSizes.includes(size)
        );
        if (!matchesSize) return false;
      }
      
      // Price filter
      if (config.priceRange) {
        const price = product.price;
        if (price < config.priceRange.min || price > config.priceRange.max) {
          return false;
        }
      }
      
      // Occasion filter
      if (config.occasions?.length) {
        const productOccasions = product.occasions || [];
        const matchesOccasion = config.occasions.some(
          occ => productOccasions.some(po => po.toLowerCase().includes(occ.toLowerCase()))
        );
        if (!matchesOccasion) return false;
      }
      
      // Trending filter
      if (config.trendingOnly && !product.trending) {
        return false;
      }
      
      return true;
    });
  }
  
  /**
   * Apply AI scoring based on various factors
   */
  private async applyAIScoring(
    products: UnifiedProduct[],
    config: SmartFilterConfig
  ): Promise<UnifiedProduct[]> {
    return products.map(product => {
      let score = product.aiScore || 50;
      
      // Search query relevance
      if (config.searchQuery) {
        const relevance = this.calculateTextRelevance(product, config.searchQuery);
        score += relevance * 20;
      }
      
      // User preference matching
      if (config.userPreferences) {
        const prefScore = this.calculatePreferenceScore(product, config.userPreferences);
        score += prefScore * 15;
      }
      
      // Seasonal relevance
      if (config.seasonalRelevance) {
        const seasonScore = this.calculateSeasonalScore(product);
        score += seasonScore * 10;
      }
      
      // Trending boost
      if (product.trending) {
        score += 10;
      }
      
      // Price-value ratio
      const valueScore = this.calculateValueScore(product);
      score += valueScore * 5;
      
      // Normalize score to 0-100
      product.aiScore = Math.min(100, Math.max(0, score));
      
      return product;
    });
  }
  
  /**
   * Calculate text relevance using simple keyword matching
   * (In production, this would use embeddings for semantic search)
   */
  private calculateTextRelevance(product: UnifiedProduct, query: string): number {
    const queryLower = query.toLowerCase();
    const searchableText = `
      ${product.name} 
      ${product.description} 
      ${product.category} 
      ${product.tags?.join(' ')}
    `.toLowerCase();
    
    // Count keyword matches
    const keywords = queryLower.split(' ');
    const matches = keywords.filter(keyword => searchableText.includes(keyword));
    
    return (matches.length / keywords.length);
  }
  
  /**
   * Calculate preference score based on user preferences
   */
  private calculatePreferenceScore(
    product: UnifiedProduct,
    preferences: UserPreferences
  ): number {
    let score = 0;
    let factors = 0;
    
    // Color preference
    if (preferences.favoriteColors?.length) {
      const productColors = this.extractProductColors(product);
      const hasPreferredColor = preferences.favoriteColors.some(
        color => productColors.some(pc => pc.includes(color.toLowerCase()))
      );
      if (hasPreferredColor) score += 1;
      factors++;
    }
    
    // Avoid colors
    if (preferences.avoidColors?.length) {
      const productColors = this.extractProductColors(product);
      const hasAvoidColor = preferences.avoidColors.some(
        color => productColors.some(pc => pc.includes(color.toLowerCase()))
      );
      if (hasAvoidColor) return -1; // Negative score for avoided colors
    }
    
    // Price preference
    if (preferences.pricePreference) {
      const priceMatch = this.matchesPricePreference(product.price, preferences.pricePreference);
      if (priceMatch) score += 1;
      factors++;
    }
    
    // Style profile
    if (preferences.styleProfile) {
      const styleMatch = this.matchesStyleProfile(product, preferences.styleProfile);
      if (styleMatch) score += 1;
      factors++;
    }
    
    return factors > 0 ? score / factors : 0;
  }
  
  /**
   * Calculate seasonal relevance score
   */
  private calculateSeasonalScore(product: UnifiedProduct): number {
    const currentMonth = new Date().getMonth();
    const currentSeason = this.getCurrentSeason(currentMonth);
    
    // Check if product is seasonal
    if (product.seasonal === currentSeason) return 1;
    
    // Check tags for seasonal keywords
    const seasonalTags = {
      'spring': ['light', 'pastel', 'cotton', 'linen'],
      'summer': ['lightweight', 'breathable', 'short-sleeve', 'tropical'],
      'fall': ['wool', 'tweed', 'burgundy', 'earth-tone'],
      'winter': ['heavy', 'warm', 'cashmere', 'velvet']
    };
    
    const currentSeasonTags = seasonalTags[currentSeason as keyof typeof seasonalTags] || [];
    const productText = `${product.name} ${product.description} ${product.tags?.join(' ')}`.toLowerCase();
    
    const matches = currentSeasonTags.filter(tag => productText.includes(tag));
    return matches.length > 0 ? 0.5 : 0;
  }
  
  /**
   * Calculate value score based on price and features
   */
  private calculateValueScore(product: UnifiedProduct): number {
    // Bundle products have better value
    if (product.isBundle) return 1;
    
    // Sale items have better value
    if (product.originalPrice && product.price < product.originalPrice) {
      const discount = (product.originalPrice - product.price) / product.originalPrice;
      return discount;
    }
    
    return 0;
  }
  
  /**
   * Sort products by relevance
   */
  private sortByRelevance(
    products: UnifiedProduct[],
    config: SmartFilterConfig
  ): UnifiedProduct[] {
    return products.sort((a, b) => {
      // Primary: AI score
      const scoreDiff = (b.aiScore || 0) - (a.aiScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      
      // Secondary: Trending status
      if (a.trending !== b.trending) {
        return b.trending ? 1 : -1;
      }
      
      // Tertiary: Price (lower is better for ties)
      return a.price - b.price;
    });
  }
  
  /**
   * Generate filter suggestions based on results
   */
  private generateFilterSuggestions(
    allProducts: UnifiedProduct[],
    filteredProducts: UnifiedProduct[],
    config: SmartFilterConfig
  ): FilterSuggestion[] {
    const suggestions: FilterSuggestion[] = [];
    
    // Suggest colors if not filtered
    if (!config.colors?.length && filteredProducts.length > 0) {
      const colorCounts = this.countProductColors(filteredProducts);
      const topColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      topColors.forEach(([color, count]) => {
        suggestions.push({
          type: 'color',
          value: color,
          displayName: color.charAt(0).toUpperCase() + color.slice(1),
          confidence: count / filteredProducts.length,
          reason: `${count} matching products`,
          productCount: count
        });
      });
    }
    
    // Suggest occasions
    if (!config.occasions?.length && filteredProducts.length > 0) {
      const occasionCounts = this.countOccasions(filteredProducts);
      const topOccasion = Object.entries(occasionCounts)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (topOccasion) {
        suggestions.push({
          type: 'occasion',
          value: topOccasion[0],
          displayName: topOccasion[0].charAt(0).toUpperCase() + topOccasion[0].slice(1),
          confidence: topOccasion[1] / filteredProducts.length,
          reason: `Perfect for ${topOccasion[0]}`,
          productCount: topOccasion[1]
        });
      }
    }
    
    return suggestions;
  }
  
  /**
   * Find alternative filters if current filters are too restrictive
   */
  private findAlternativeFilters(
    products: UnifiedProduct[],
    config: SmartFilterConfig
  ): AlternativeFilter[] {
    const alternatives: AlternativeFilter[] = [];
    
    // Try removing one filter at a time
    if (config.colors?.length) {
      const withoutColor = { ...config, colors: undefined };
      const results = this.applyBasicFilters(products, withoutColor);
      alternatives.push({
        name: 'All Colors',
        filters: withoutColor,
        expectedResults: results.length,
        relevanceScore: 0.8
      });
    }
    
    if (config.priceRange) {
      const widerRange = {
        ...config,
        priceRange: {
          min: config.priceRange.min * 0.8,
          max: config.priceRange.max * 1.2
        }
      };
      const results = this.applyBasicFilters(products, widerRange);
      alternatives.push({
        name: 'Wider Price Range',
        filters: widerRange,
        expectedResults: results.length,
        relevanceScore: 0.7
      });
    }
    
    return alternatives;
  }
  
  /**
   * Generate outfit suggestions
   */
  private async generateOutfitSuggestions(
    filteredProducts: UnifiedProduct[],
    allProducts: UnifiedProduct[],
    config: SmartFilterConfig
  ): Promise<OutfitSuggestion[]> {
    const suggestions: OutfitSuggestion[] = [];
    
    // For each suit, suggest matching items
    const suits = filteredProducts.filter(p => 
      p.category?.toLowerCase().includes('suit')
    ).slice(0, 3);
    
    for (const suit of suits) {
      const outfitSuggestion: OutfitSuggestion = {
        baseProduct: suit,
        suggestions: [],
        totalPrice: suit.price,
        occasionMatch: suit.occasions || []
      };
      
      // Suggest shirts
      const shirts = allProducts.filter(p => 
        p.category?.toLowerCase().includes('shirt') &&
        this.colorsMatch(suit, p)
      ).slice(0, 3);
      
      if (shirts.length > 0) {
        outfitSuggestion.suggestions.push({
          category: 'Shirts',
          products: shirts,
          reason: 'Color coordinated shirts'
        });
      }
      
      // Suggest ties
      const ties = allProducts.filter(p => 
        p.category?.toLowerCase().includes('tie') &&
        this.colorsMatch(suit, p)
      ).slice(0, 3);
      
      if (ties.length > 0) {
        outfitSuggestion.suggestions.push({
          category: 'Ties',
          products: ties,
          reason: 'Matching ties and accessories'
        });
      }
      
      suggestions.push(outfitSuggestion);
    }
    
    return suggestions;
  }
  
  /**
   * Helper: Extract colors from product
   */
  private extractProductColors(product: UnifiedProduct): string[] {
    const colors: string[] = [];
    
    if (product.color) colors.push(product.color.toLowerCase());
    
    // Extract from bundle components
    if (product.bundleComponents) {
      if (product.bundleComponents.suit?.color) {
        colors.push(product.bundleComponents.suit.color.toLowerCase());
      }
      if (product.bundleComponents.shirt?.color) {
        colors.push(product.bundleComponents.shirt.color.toLowerCase());
      }
      if (product.bundleComponents.tie?.color) {
        colors.push(product.bundleComponents.tie.color.toLowerCase());
      }
    }
    
    // Extract from name and tags
    const colorKeywords = ['black', 'navy', 'grey', 'blue', 'brown', 'white', 'burgundy', 'red', 'green'];
    const text = `${product.name} ${product.tags?.join(' ')}`.toLowerCase();
    colorKeywords.forEach(color => {
      if (text.includes(color) && !colors.includes(color)) {
        colors.push(color);
      }
    });
    
    return colors;
  }
  
  /**
   * Helper: Check if colors match for outfit coordination
   */
  private colorsMatch(product1: UnifiedProduct, product2: UnifiedProduct): boolean {
    const colors1 = this.extractProductColors(product1);
    const colors2 = this.extractProductColors(product2);
    
    // Neutral colors match with everything
    const neutralColors = ['white', 'black', 'grey', 'navy'];
    const hasNeutral = colors2.some(c => neutralColors.includes(c));
    if (hasNeutral) return true;
    
    // Complementary color rules (simplified)
    const complementaryPairs = [
      ['navy', 'burgundy'],
      ['grey', 'blue'],
      ['black', 'white'],
      ['brown', 'cream']
    ];
    
    for (const [color1, color2] of complementaryPairs) {
      if (
        (colors1.includes(color1) && colors2.includes(color2)) ||
        (colors1.includes(color2) && colors2.includes(color1))
      ) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Helper: Count product colors
   */
  private countProductColors(products: UnifiedProduct[]): Record<string, number> {
    const counts: Record<string, number> = {};
    
    products.forEach(product => {
      const colors = this.extractProductColors(product);
      colors.forEach(color => {
        counts[color] = (counts[color] || 0) + 1;
      });
    });
    
    return counts;
  }
  
  /**
   * Helper: Count occasions
   */
  private countOccasions(products: UnifiedProduct[]): Record<string, number> {
    const counts: Record<string, number> = {};
    
    products.forEach(product => {
      (product.occasions || []).forEach(occasion => {
        counts[occasion] = (counts[occasion] || 0) + 1;
      });
    });
    
    return counts;
  }
  
  /**
   * Helper: Get current season
   */
  private getCurrentSeason(month: number): string {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }
  
  /**
   * Helper: Match price preference
   */
  private matchesPricePreference(price: number, preference: string): boolean {
    const ranges = {
      'budget': [0, 150],
      'mid': [150, 300],
      'premium': [300, 500],
      'luxury': [500, Infinity]
    };
    
    const range = ranges[preference as keyof typeof ranges];
    return price >= range[0] && price <= range[1];
  }
  
  /**
   * Helper: Match style profile
   */
  private matchesStyleProfile(product: UnifiedProduct, profile: string): boolean {
    const profileKeywords = {
      'classic': ['classic', 'traditional', 'timeless'],
      'modern': ['modern', 'contemporary', 'sleek'],
      'trendy': ['trendy', 'fashion', 'latest'],
      'casual': ['casual', 'relaxed', 'comfortable'],
      'formal': ['formal', 'business', 'professional']
    };
    
    const keywords = profileKeywords[profile as keyof typeof profileKeywords] || [];
    const productText = `${product.name} ${product.description} ${product.tags?.join(' ')}`.toLowerCase();
    
    return keywords.some(keyword => productText.includes(keyword));
  }
  
  /**
   * Generate metadata for filter results
   */
  private generateMetadata(products: UnifiedProduct[], startTime: number): FilterMetadata {
    const prices = products.map(p => p.price);
    const aiScores = products.map(p => p.aiScore || 0);
    
    // Count categories
    const categoryCounts: Record<string, number> = {};
    products.forEach(p => {
      const category = p.category || 'uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Count colors
    const colorCounts = this.countProductColors(products);
    
    return {
      totalMatches: products.length,
      appliedFilters: [], // TODO: Track applied filters
      searchTime: Date.now() - startTime,
      aiScoreRange: {
        min: Math.min(...aiScores),
        max: Math.max(...aiScores)
      },
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      topCategories: Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
      topColors: Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))
    };
  }
}

// Export singleton instance
export const smartFilterEngine = SmartFilterEngine.getInstance();