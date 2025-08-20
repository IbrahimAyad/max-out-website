/**
 * Product Recommendation Engine
 * Provides intelligent product recommendations based on:
 * - Color coordination
 * - Style matching
 * - Price range
 * - Occasion/event type
 * - User preferences
 */

import productsDatabase from '../../kct_menswear_products_database.json';

// Color coordination rules based on fashion principles
const COLOR_HARMONIES = {
  // Complementary colors
  navy: ['burgundy', 'brown', 'grey', 'white', 'pink'],
  black: ['white', 'grey', 'red', 'gold', 'silver'],
  grey: ['navy', 'burgundy', 'black', 'white', 'pink'],
  burgundy: ['navy', 'grey', 'white', 'beige', 'gold'],
  brown: ['navy', 'beige', 'cream', 'olive', 'white'],
  
  // Monochromatic schemes
  'light-blue': ['navy', 'royal-blue', 'white', 'grey'],
  'royal-blue': ['navy', 'light-blue', 'white', 'silver'],
  
  // Earth tones
  olive: ['brown', 'beige', 'tan', 'cream', 'navy'],
  tan: ['brown', 'navy', 'olive', 'white', 'burgundy'],
  beige: ['brown', 'navy', 'olive', 'burgundy', 'grey'],
  
  // Pastels (wedding colors)
  'blush': ['sage', 'lavender', 'cream', 'gold', 'grey'],
  'sage': ['blush', 'cream', 'gold', 'lavender', 'white'],
  'lavender': ['sage', 'blush', 'grey', 'silver', 'white'],
  
  // Bold colors
  red: ['black', 'white', 'grey', 'navy'],
  purple: ['grey', 'black', 'gold', 'white'],
  emerald: ['black', 'gold', 'navy', 'grey']
};

// Style categories and compatible items
const STYLE_COMPATIBILITY = {
  formal: {
    compatible: ['tuxedo', 'dress-shirt', 'bowtie', 'cummerbund', 'dress-shoes', 'cufflinks'],
    occasions: ['wedding', 'gala', 'black-tie', 'formal-dinner']
  },
  prom: {
    compatible: ['prom-tuxedo', 'prom-blazer', 'bowtie', 'suspenders', 'studded-loafers', 'rhinestone-shoes'],
    occasions: ['prom', 'homecoming', 'formal-dance']
  },
  wedding: {
    compatible: ['wedding-suit', 'wedding-tuxedo', 'vest', 'tie', 'pocket-square', 'dress-shoes'],
    occasions: ['wedding', 'groomsmen', 'wedding-guest']
  },
  business: {
    compatible: ['business-suit', 'dress-shirt', 'tie', 'dress-shoes', 'belt'],
    occasions: ['business', 'interview', 'conference', 'meeting']
  },
  cocktail: {
    compatible: ['blazer', 'dress-shirt', 'dress-pants', 'loafers', 'pocket-square'],
    occasions: ['cocktail-party', 'dinner', 'date-night']
  }
};

// Complete outfit combinations
const OUTFIT_TEMPLATES = {
  classicTuxedo: {
    name: 'Classic Black Tie',
    items: ['black-tuxedo', 'white-dress-shirt', 'black-bowtie', 'black-cummerbund', 'black-dress-shoes'],
    occasion: 'black-tie'
  },
  promKing: {
    name: 'Prom Statement Look',
    items: ['velvet-blazer', 'black-dress-shirt', 'matching-bowtie', 'suspenders', 'studded-loafers'],
    occasion: 'prom'
  },
  weddingGroom: {
    name: 'Groom Essentials',
    items: ['wedding-suit', 'white-dress-shirt', 'wedding-tie', 'vest', 'pocket-square', 'dress-shoes'],
    occasion: 'wedding'
  },
  businessProfessional: {
    name: 'Business Professional',
    items: ['navy-suit', 'light-blue-shirt', 'burgundy-tie', 'black-belt', 'black-dress-shoes'],
    occasion: 'business'
  },
  summerWedding: {
    name: 'Summer Wedding Guest',
    items: ['beige-suit', 'white-shirt', 'pastel-tie', 'brown-loafers', 'pocket-square'],
    occasion: 'wedding-guest'
  }
};

export interface RecommendationRequest {
  productId?: string;
  category?: string;
  color?: string;
  occasion?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  style?: string;
}

export interface Recommendation {
  product: any;
  reason: string;
  matchScore: number;
  outfit?: string[];
}

class RecommendationEngine {
  private products: any[];
  
  constructor() {
    this.products = productsDatabase.products;
  }
  
  /**
   * Get recommendations based on a specific product
   */
  getProductRecommendations(productId: string, limit: number = 6): Recommendation[] {
    const product = this.products.find(p => p.id === productId);
    if (!product) return [];
    
    const recommendations: Recommendation[] = [];
    
    // 1. Color coordinated items
    const colorMatches = this.findColorCoordinatedItems(product);
    colorMatches.forEach(match => {
      recommendations.push({
        product: match.product,
        reason: `Complements ${product.name} with ${match.reason}`,
        matchScore: match.score
      });
    });
    
    // 2. Complete the outfit
    const outfitItems = this.completeOutfit(product);
    outfitItems.forEach(item => {
      if (!recommendations.find(r => r.product.id === item.product.id)) {
        recommendations.push({
          product: item.product,
          reason: item.reason,
          matchScore: item.score
        });
      }
    });
    
    // 3. Similar style alternatives
    const alternatives = this.findAlternatives(product);
    alternatives.forEach(alt => {
      if (!recommendations.find(r => r.product.id === alt.product.id)) {
        recommendations.push({
          product: alt.product,
          reason: `Alternative option in ${alt.reason}`,
          matchScore: alt.score
        });
      }
    });
    
    // Sort by match score and return top recommendations
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }
  
  /**
   * Get recommendations for an occasion
   */
  getOccasionRecommendations(occasion: string): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Find matching outfit template
    const template = Object.values(OUTFIT_TEMPLATES).find(
      t => t.occasion === occasion || t.occasion.includes(occasion)
    );
    
    if (template) {
      // Build complete outfit
      const outfit = this.buildOutfitFromTemplate(template);
      outfit.forEach(item => {
        recommendations.push({
          product: item.product,
          reason: `Essential for ${template.name}`,
          matchScore: item.score,
          outfit: template.items
        });
      });
    }
    
    // Add occasion-specific products
    const occasionProducts = this.products.filter(p => {
      const tags = p.tags || [];
      const description = (p.description || '').toLowerCase();
      return tags.includes(occasion) || description.includes(occasion);
    });
    
    occasionProducts.forEach(product => {
      if (!recommendations.find(r => r.product.id === product.id)) {
        recommendations.push({
          product,
          reason: `Perfect for ${occasion}`,
          matchScore: 0.7
        });
      }
    });
    
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }
  
  /**
   * Find color coordinated items
   */
  private findColorCoordinatedItems(product: any): any[] {
    const matches: any[] = [];
    const productColors = product.colors || [];
    
    productColors.forEach((color: string) => {
      const harmoniousColors = COLOR_HARMONIES[color.toLowerCase()] || [];
      
      this.products.forEach(p => {
        if (p.id === product.id) return;
        
        const pColors = p.colors || [];
        const hasMatchingColor = pColors.some((c: string) => 
          harmoniousColors.includes(c.toLowerCase())
        );
        
        if (hasMatchingColor) {
          matches.push({
            product: p,
            reason: `color harmony`,
            score: 0.8
          });
        }
      });
    });
    
    return matches;
  }
  
  /**
   * Complete an outfit based on a product
   */
  private completeOutfit(product: any): any[] {
    const outfitItems: any[] = [];
    const category = product.category?.toLowerCase() || '';
    
    // Determine what's needed to complete the outfit
    const neededItems = this.determineNeededItems(category);
    
    neededItems.forEach(needed => {
      const item = this.findBestMatch(needed, product);
      if (item) {
        outfitItems.push({
          product: item,
          reason: `Complete your ${category} outfit`,
          score: 0.9
        });
      }
    });
    
    return outfitItems;
  }
  
  /**
   * Find alternative products in similar style
   */
  private findAlternatives(product: any): any[] {
    return this.products
      .filter(p => {
        return p.id !== product.id &&
               p.category === product.category &&
               Math.abs(p.price - product.price) <= 50;
      })
      .map(p => ({
        product: p,
        reason: `${p.colors?.[0] || 'similar style'}`,
        score: 0.6
      }))
      .slice(0, 3);
  }
  
  /**
   * Determine needed items to complete outfit
   */
  private determineNeededItems(category: string): string[] {
    const outfitMap: Record<string, string[]> = {
      'tuxedo': ['dress-shirt', 'bowtie', 'dress-shoes', 'cummerbund'],
      'suit': ['dress-shirt', 'tie', 'dress-shoes', 'belt'],
      'blazer': ['dress-shirt', 'dress-pants', 'loafers', 'pocket-square'],
      'wedding-suit': ['dress-shirt', 'tie', 'vest', 'dress-shoes'],
      'prom-tuxedo': ['dress-shirt', 'bowtie', 'suspenders', 'studded-loafers']
    };
    
    return outfitMap[category] || [];
  }
  
  /**
   * Find best matching product for a needed item
   */
  private findBestMatch(itemType: string, referenceProduct: any): any {
    return this.products.find(p => {
      const category = p.category?.toLowerCase() || '';
      const name = p.name?.toLowerCase() || '';
      return category.includes(itemType) || name.includes(itemType);
    });
  }
  
  /**
   * Build outfit from template
   */
  private buildOutfitFromTemplate(template: any): any[] {
    const outfit: any[] = [];
    
    template.items.forEach((itemType: string) => {
      const product = this.products.find(p => {
        const name = p.name?.toLowerCase() || '';
        const category = p.category?.toLowerCase() || '';
        return name.includes(itemType) || category.includes(itemType);
      });
      
      if (product) {
        outfit.push({
          product,
          score: 0.95
        });
      }
    });
    
    return outfit;
  }
  
  /**
   * Get trending products
   */
  getTrendingProducts(limit: number = 8): any[] {
    // For now, return newest/featured products
    // In production, this would use actual analytics data
    return this.products
      .filter(p => p.isNew || p.tags?.includes('trending'))
      .slice(0, limit);
  }
  
  /**
   * Get personalized recommendations based on user history
   */
  getPersonalizedRecommendations(userPreferences: any): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Filter by price range
    let filtered = this.products;
    if (userPreferences.priceRange) {
      filtered = filtered.filter(p => 
        p.price >= userPreferences.priceRange.min &&
        p.price <= userPreferences.priceRange.max
      );
    }
    
    // Filter by preferred colors
    if (userPreferences.favoriteColors) {
      filtered = filtered.filter(p => {
        const colors = p.colors || [];
        return colors.some((c: string) => 
          userPreferences.favoriteColors.includes(c.toLowerCase())
        );
      });
    }
    
    // Filter by style
    if (userPreferences.style) {
      filtered = filtered.filter(p => {
        const tags = p.tags || [];
        return tags.includes(userPreferences.style);
      });
    }
    
    // Score and sort
    filtered.forEach(product => {
      let score = 0.5;
      
      // Boost score for matching preferences
      if (userPreferences.favoriteColors?.some((c: string) => 
        product.colors?.includes(c))) {
        score += 0.2;
      }
      
      if (userPreferences.sizes?.includes(product.sizes?.[0])) {
        score += 0.1;
      }
      
      if (product.isNew) score += 0.1;
      if (product.isSale) score += 0.1;
      
      recommendations.push({
        product,
        reason: 'Based on your preferences',
        matchScore: score
      });
    });
    
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12);
  }
}

// Export singleton instance
export const recommendationEngine = new RecommendationEngine();

// Export utility functions
export function getColorHarmony(color: string): string[] {
  return COLOR_HARMONIES[color.toLowerCase()] || [];
}

export function getOutfitTemplate(occasion: string): any {
  return Object.values(OUTFIT_TEMPLATES).find(
    t => t.occasion === occasion
  );
}

export function getStyleCompatibility(style: string): any {
  return STYLE_COMPATIBILITY[style.toLowerCase()] || null;
}