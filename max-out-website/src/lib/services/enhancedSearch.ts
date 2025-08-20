/**
 * Enhanced Search Service
 * Connects Fashion CLIP, dynamic suggestions, and smart search
 */

import { UnifiedProduct } from '@/types/unified-shop';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'style' | 'occasion' | 'color' | 'brand';
  icon?: string;
  count?: number;
  confidence?: number;
}

interface VisualSearchResult {
  product: UnifiedProduct;
  similarity: number;
  confidence: number;
  reason: string;
}

interface SearchAnalytics {
  query: string;
  timestamp: Date;
  resultsCount: number;
  clickedResult?: string;
  searchType: 'text' | 'visual' | 'voice';
}

class EnhancedSearchService {
  private searchHistory: SearchAnalytics[] = [];
  private suggestionCache = new Map<string, SearchSuggestion[]>();
  private readonly FASHION_CLIP_API = process.env.NEXT_PUBLIC_FASHION_CLIP_API || 'https://fashion-clip-kct-production.up.railway.app';
  
  /**
   * Get dynamic search suggestions based on actual products
   */
  async getDynamicSuggestions(query: string): Promise<SearchSuggestion[]> {
    // Check cache first
    const cacheKey = query.toLowerCase();
    if (this.suggestionCache.has(cacheKey)) {
      return this.suggestionCache.get(cacheKey)!;
    }

    try {
      // Fetch products to build suggestions
      const response = await fetch(`/api/products/unified?search=${encodeURIComponent(query)}&limit=50`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      const suggestions: SearchSuggestion[] = [];
      const seen = new Set<string>();
      
      // Extract categories from results
      const categoryCount = new Map<string, number>();
      const colorCount = new Map<string, number>();
      const occasionCount = new Map<string, number>();
      
      data.products.forEach((product: UnifiedProduct) => {
        // Count categories
        if (product.category) {
          categoryCount.set(product.category, (categoryCount.get(product.category) || 0) + 1);
        }
        
        // Count colors (from tags or name)
        const colors = this.extractColors(product.name + ' ' + product.tags?.join(' '));
        colors.forEach(color => {
          colorCount.set(color, (colorCount.get(color) || 0) + 1);
        });
        
        // Count occasions
        product.tags?.forEach(tag => {
          const occasions = ['wedding', 'prom', 'business', 'casual', 'formal', 'cocktail'];
          if (occasions.some(occ => tag.toLowerCase().includes(occ))) {
            occasionCount.set(tag, (occasionCount.get(tag) || 0) + 1);
          }
        });
      });
      
      // Build category suggestions
      Array.from(categoryCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([category, count]) => {
          if (!seen.has(category)) {
            suggestions.push({
              id: `cat-${category}`,
              text: `${category} (${count} items)`,
              type: 'category',
              icon: this.getCategoryIcon(category),
              count
            });
            seen.add(category);
          }
        });
      
      // Build color suggestions
      Array.from(colorCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([color, count]) => {
          if (!seen.has(color)) {
            suggestions.push({
              id: `color-${color}`,
              text: `${color} products (${count})`,
              type: 'color',
              icon: '🎨',
              count
            });
            seen.add(color);
          }
        });
      
      // Build occasion suggestions
      Array.from(occasionCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .forEach(([occasion, count]) => {
          if (!seen.has(occasion)) {
            suggestions.push({
              id: `occ-${occasion}`,
              text: `${occasion} (${count} options)`,
              type: 'occasion',
              icon: this.getOccasionIcon(occasion),
              count
            });
            seen.add(occasion);
          }
        });
      
      // Add specific product suggestions (top 3 matches)
      data.products.slice(0, 3).forEach((product: UnifiedProduct, index: number) => {
        suggestions.push({
          id: `prod-${product.id}`,
          text: product.name,
          type: 'product',
          icon: '👔',
          confidence: 1 - (index * 0.1) // Higher confidence for earlier results
        });
      });
      
      // Cache the suggestions
      this.suggestionCache.set(cacheKey, suggestions);
      
      // Clear cache after 5 minutes
      setTimeout(() => {
        this.suggestionCache.delete(cacheKey);
      }, 5 * 60 * 1000);
      
      return suggestions;
      
    } catch (error) {
      console.error('Error getting dynamic suggestions:', error);
      return this.getFallbackSuggestions(query);
    }
  }
  
  /**
   * Visual search using Fashion CLIP
   */
  async visualSearch(imageFile: File, textQuery?: string): Promise<VisualSearchResult[]> {
    try {
      // Step 1: Get Fashion CLIP analysis
      const formData = new FormData();
      formData.append('file', imageFile);
      if (textQuery) {
        formData.append('text', textQuery);
      }
      
      const clipResponse = await fetch(`${this.FASHION_CLIP_API}/predict`, {
        method: 'POST',
        body: formData
      });
      
      let clipData: any = {};
      if (clipResponse.ok) {
        clipData = await clipResponse.json();

      }
      
      // Step 2: Extract features from Fashion CLIP response
      // Fashion CLIP might return: garment_type, color, style, pattern, etc.
      const features = {
        category: clipData.garment_type || clipData.category || this.detectCategoryFromImage(imageFile.name),
        colors: clipData.color ? [clipData.color] : (clipData.colors || []),
        style: clipData.style || 'formal',
        occasion: clipData.occasion || clipData.event || 'business',
        pattern: clipData.pattern,
        confidence: clipData.confidence || clipData.similarity || 0.7
      };
      
      // Step 3: Search products based on extracted features
      // Build a text search query from the features
      const searchTerms: string[] = [];
      if (features.category) searchTerms.push(features.category);
      if (features.colors.length > 0) searchTerms.push(...features.colors);
      if (features.style && features.style !== 'formal') searchTerms.push(features.style);
      if (features.pattern) searchTerms.push(features.pattern);
      
      // Use text search which is more flexible than exact filters
      const searchQuery = searchTerms.join(' ') || 'suit';
      const productsResponse = await fetch(`/api/products/unified?search=${encodeURIComponent(searchQuery)}&limit=20`);
      if (!productsResponse.ok) throw new Error('Failed to fetch products');
      
      const productsData = await productsResponse.json();
      
      // Step 4: Rank products by similarity
      const results: VisualSearchResult[] = productsData.products
        .map((product: UnifiedProduct) => {
          const similarity = this.calculateSimilarity(product, features);
          return {
            product,
            similarity,
            confidence: similarity * features.confidence,
            reason: this.getSimilarityReason(product, features)
          };
        })
        .sort((a: VisualSearchResult, b: VisualSearchResult) => b.similarity - a.similarity)
        .slice(0, 10); // Top 10 results
      
      // Track analytics
      this.trackSearch(textQuery || 'visual-search', results.length, 'visual');
      
      return results;
      
    } catch (error) {
      console.error('Visual search error:', error);
      return [];
    }
  }
  
  /**
   * Calculate similarity score between product and extracted features
   */
  private calculateSimilarity(product: UnifiedProduct, features: any): number {
    let score = 0;
    let weights = 0;
    
    // Category match (40% weight)
    if (product.category?.toLowerCase() === features.category?.toLowerCase()) {
      score += 0.4;
    }
    weights += 0.4;
    
    // Color match (30% weight)
    if (features.colors?.length > 0) {
      const productColors = this.extractColors(product.name + ' ' + product.tags?.join(' '));
      const colorMatch = features.colors.some((color: string) => 
        productColors.some(pColor => pColor.toLowerCase().includes(color.toLowerCase()))
      );
      if (colorMatch) score += 0.3;
    }
    weights += 0.3;
    
    // Occasion match (20% weight)
    if (features.occasion && product.tags?.some(tag => 
      tag.toLowerCase().includes(features.occasion.toLowerCase())
    )) {
      score += 0.2;
    }
    weights += 0.2;
    
    // Style match (10% weight)
    if (features.style && product.tags?.some(tag => 
      tag.toLowerCase().includes(features.style.toLowerCase())
    )) {
      score += 0.1;
    }
    weights += 0.1;
    
    return weights > 0 ? score / weights : 0;
  }
  
  /**
   * Get human-readable reason for similarity
   */
  private getSimilarityReason(product: UnifiedProduct, features: any): string {
    const reasons = [];
    
    if (product.category?.toLowerCase() === features.category?.toLowerCase()) {
      reasons.push(`Same category: ${product.category}`);
    }
    
    const productColors = this.extractColors(product.name);
    const matchingColors = features.colors?.filter((color: string) => 
      productColors.some(pColor => pColor.toLowerCase().includes(color.toLowerCase()))
    );
    if (matchingColors?.length > 0) {
      reasons.push(`Matching colors: ${matchingColors.join(', ')}`);
    }
    
    if (features.occasion && product.tags?.some(tag => 
      tag.toLowerCase().includes(features.occasion.toLowerCase())
    )) {
      reasons.push(`Perfect for ${features.occasion}`);
    }
    
    return reasons.length > 0 ? reasons.join('. ') : 'Similar style and appearance';
  }
  
  /**
   * Extract colors from text
   */
  private extractColors(text: string): string[] {
    const colors = [
      'black', 'white', 'navy', 'blue', 'grey', 'gray', 'charcoal',
      'brown', 'tan', 'beige', 'burgundy', 'red', 'green', 'purple',
      'pink', 'ivory', 'cream', 'gold', 'silver', 'bronze'
    ];
    
    const found: string[] = [];
    const lowerText = text.toLowerCase();
    
    colors.forEach(color => {
      if (lowerText.includes(color)) {
        found.push(color.charAt(0).toUpperCase() + color.slice(1));
      }
    });
    
    return found;
  }
  
  /**
   * Get fallback suggestions when API fails
   */
  private getFallbackSuggestions(query: string): SearchSuggestion[] {
    const lower = query.toLowerCase();
    const suggestions: SearchSuggestion[] = [];
    
    // Category suggestions
    if (lower.includes('suit')) {
      suggestions.push(
        { id: '1', text: 'Two-Piece Suits', type: 'category', icon: '👔' },
        { id: '2', text: 'Three-Piece Suits', type: 'category', icon: '🎩' },
        { id: '3', text: 'Tuxedos', type: 'category', icon: '🤵' }
      );
    }
    
    // Occasion suggestions
    if (lower.includes('wedding')) {
      suggestions.push(
        { id: '4', text: 'Wedding Suits', type: 'occasion', icon: '💒' },
        { id: '5', text: 'Groomsmen Attire', type: 'occasion', icon: '🤵' }
      );
    }
    
    // Color suggestions
    const colors = this.extractColors(query);
    colors.forEach((color, index) => {
      suggestions.push({
        id: `color-${index}`,
        text: `${color} collection`,
        type: 'color',
        icon: '🎨'
      });
    });
    
    return suggestions;
  }
  
  /**
   * Track search analytics
   */
  private trackSearch(query: string, resultsCount: number, searchType: 'text' | 'visual' | 'voice') {
    this.searchHistory.push({
      query,
      timestamp: new Date(),
      resultsCount,
      searchType
    });
    
    // Keep only last 100 searches
    if (this.searchHistory.length > 100) {
      this.searchHistory = this.searchHistory.slice(-100);
    }
  }
  
  /**
   * Get search analytics
   */
  getSearchAnalytics() {
    return {
      totalSearches: this.searchHistory.length,
      popularQueries: this.getPopularQueries(),
      searchTypes: this.getSearchTypeBreakdown(),
      averageResultsCount: this.getAverageResultsCount()
    };
  }
  
  private getPopularQueries(): { query: string; count: number }[] {
    const queryCount = new Map<string, number>();
    this.searchHistory.forEach(search => {
      queryCount.set(search.query, (queryCount.get(search.query) || 0) + 1);
    });
    
    return Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
  
  private getSearchTypeBreakdown() {
    const types = { text: 0, visual: 0, voice: 0 };
    this.searchHistory.forEach(search => {
      types[search.searchType]++;
    });
    return types;
  }
  
  private getAverageResultsCount(): number {
    if (this.searchHistory.length === 0) return 0;
    const total = this.searchHistory.reduce((sum, search) => sum + search.resultsCount, 0);
    return Math.round(total / this.searchHistory.length);
  }
  
  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      suits: '👔',
      blazers: '🧥',
      shirts: '👕',
      ties: '👔',
      shoes: '👞',
      accessories: '⌚',
      pants: '👖'
    };
    return icons[category.toLowerCase()] || '📦';
  }
  
  private getOccasionIcon(occasion: string): string {
    const icons: Record<string, string> = {
      wedding: '💒',
      prom: '🎓',
      business: '💼',
      formal: '🎩',
      casual: '👕',
      cocktail: '🍸'
    };
    return icons[occasion.toLowerCase()] || '✨';
  }
  
  private detectCategoryFromImage(filename: string): string {
    // Simple detection based on filename
    const lower = filename.toLowerCase();
    if (lower.includes('suit')) return 'suits';
    if (lower.includes('blazer')) return 'blazers';
    if (lower.includes('shirt')) return 'shirts';
    if (lower.includes('tie')) return 'ties';
    return 'suits'; // Default
  }
}

// Export singleton instance
export const enhancedSearchService = new EnhancedSearchService();