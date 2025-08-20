/**
 * Cached Knowledge-Based AI Product Analyzer
 * Uses Fashion Knowledge Base API with caching to prevent constant reloading
 */

interface KnowledgeAnalysis {
  product: any;
  trending: {
    score: number;
    reasons: string[];
    category: string;
  };
  style: {
    occasions: string[];
    seasons: string[];
    colors: string[];
    formality: number;
    versatility: number;
  };
  recommendations: {
    placement: 'hero' | 'trending' | 'new' | 'seasonal' | 'classic' | 'premium';
    reason: string;
    tags: string[];
  };
  fashionClipScore?: number;
}

class CachedKnowledgeProductAnalyzer {
  private cache: Map<string, KnowledgeAnalysis> = new Map();
  private productCache: Map<string, any> = new Map();
  private lastFetch: number = 0;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private knowledgeBaseUrl: string;
  private knowledgeApiKey: string;

  constructor() {
    // Use server-side env vars in production
    this.knowledgeBaseUrl = process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_API || '';
    this.knowledgeApiKey = process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_KEY || '';
  }

  /**
   * Get cached products or fetch new ones
   */
  async getCachedProducts(): Promise<any[]> {
    const now = Date.now();
    
    // Return cached products if still valid
    if (this.productCache.size > 0 && (now - this.lastFetch) < this.cacheTimeout) {
      console.log('Returning cached products');
      return Array.from(this.productCache.values());
    }

    // Fetch new products
    try {
      const response = await fetch('/api/products/enhanced?status=active&limit=100');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      const products = data.products || [];
      
      // Update cache
      this.productCache.clear();
      products.forEach(p => this.productCache.set(p.id || p.slug, p));
      this.lastFetch = now;
      
      console.log(`Fetched and cached ${products.length} products`);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return cached products even if expired
      return Array.from(this.productCache.values());
    }
  }

  /**
   * Analyze product with caching
   */
  async analyzeWithKnowledge(product: any): Promise<KnowledgeAnalysis> {
    const cacheKey = product.id || product.slug || product.name;
    
    // Return cached analysis if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Get trending analysis (skip external API calls for now due to CORS)
      const trendingAnalysis = this.getFallbackTrendingAnalysis(product);
      
      // Get style analysis (use fallback for now)
      const styleAnalysis = this.getFallbackStyleAnalysis(product);
      
      // Skip Fashion CLIP due to CORS issues
      const fashionClipScore = undefined;
      
      // Determine optimal placement
      const recommendations = this.determineRecommendations(
        product,
        trendingAnalysis,
        styleAnalysis,
        fashionClipScore
      );

      const analysis: KnowledgeAnalysis = {
        product,
        trending: trendingAnalysis,
        style: styleAnalysis,
        recommendations,
        fashionClipScore
      };

      // Cache the analysis
      this.cache.set(cacheKey, analysis);
      
      return analysis;
    } catch (error) {
      console.error('Knowledge analysis error:', error);
      return this.getFallbackAnalysis(product);
    }
  }

  /**
   * Batch analyze with caching
   */
  async analyzeAndOrganizeProducts(inputProducts?: any[]) {
    // Use cached products or fetch new ones
    const products = inputProducts || await this.getCachedProducts();
    
    console.log(`Analyzing ${products.length} products...`);
    
    // Analyze all products
    const analyses = await Promise.all(
      products.map(p => this.analyzeWithKnowledge(p))
    );

    // Sort by trending scores
    analyses.sort((a, b) => b.trending.score - a.trending.score);

    // Organize by placement
    const organized = {
      hero: [] as any[],
      trending: [] as any[],
      newArrivals: [] as any[],
      seasonal: [] as any[],
      premium: [] as any[],
      classics: [] as any[],
      allAnalyses: analyses
    };

    // Categorize products
    analyses.forEach(analysis => {
      const product = analysis.product;
      
      switch (analysis.recommendations.placement) {
        case 'hero':
          if (organized.hero.length < 3) organized.hero.push(product);
          break;
        case 'trending':
          if (organized.trending.length < 12) organized.trending.push(product);
          break;
        case 'new':
          if (organized.newArrivals.length < 12) organized.newArrivals.push(product);
          break;
        case 'seasonal':
          if (organized.seasonal.length < 12) organized.seasonal.push(product);
          break;
        case 'premium':
          if (organized.premium.length < 8) organized.premium.push(product);
          break;
        default:
          if (organized.classics.length < 12) organized.classics.push(product);
      }
    });

    // Fill hero section if needed
    if (organized.hero.length === 0) {
      organized.hero = organized.trending.slice(0, 3);
    }

    console.log('Product organization complete:', {
      hero: organized.hero.length,
      trending: organized.trending.length,
      new: organized.newArrivals.length,
      seasonal: organized.seasonal.length,
      premium: organized.premium.length,
      classics: organized.classics.length
    });

    return organized;
  }

  /**
   * Clear caches (useful for force refresh)
   */
  clearCache() {
    this.cache.clear();
    this.productCache.clear();
    this.lastFetch = 0;
  }

  // Helper methods
  private determineRecommendations(
    product: any,
    trending: any,
    style: any,
    fashionClipScore?: number
  ) {
    const tags: string[] = [];
    let placement: KnowledgeAnalysis['recommendations']['placement'] = 'classic';
    let reason = '';

    // High trending score products
    if (trending.score > 0.8) {
      placement = 'trending';
      reason = 'Currently trending in fashion';
      tags.push('trending', 'popular');
    }
    
    // High versatility products
    else if (style.versatility > 0.8) {
      placement = 'hero';
      reason = 'Versatile essential piece';
      tags.push('versatile', 'essential');
    }
    
    // Seasonal products
    else if (style.seasons.includes(this.getCurrentSeason())) {
      placement = 'seasonal';
      reason = `Perfect for ${this.getCurrentSeason()}`;
      tags.push('seasonal', this.getCurrentSeason());
    }
    
    // New products (check created date)
    else if (this.isNewProduct(product)) {
      placement = 'new';
      reason = 'Recently added to collection';
      tags.push('new-arrival');
    }
    
    // Premium products
    else if ((product.base_price || product.price) > 300) {
      placement = 'premium';
      reason = 'Premium quality piece';
      tags.push('premium', 'luxury');
    }

    // Add style tags
    if (style.formality > 0.7) tags.push('formal');
    if (style.formality < 0.3) tags.push('casual');
    if (fashionClipScore && fashionClipScore > 0.8) tags.push('photogenic');

    // Add occasion tags
    style.occasions.forEach(occasion => {
      if (!tags.includes(occasion)) tags.push(occasion);
    });

    return {
      placement,
      reason,
      tags
    };
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  }

  private isNewProduct(product: any): boolean {
    if (!product.created_at) return false;
    const daysSinceCreation = (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation < 30;
  }

  // Fallback methods when API is unavailable
  private getFallbackTrendingAnalysis(product: any) {
    const name = product.name?.toLowerCase() || '';
    let score = 0.5;
    const reasons = [];

    if (name.includes('velvet') || name.includes('sparkle')) {
      score = 0.8;
      reasons.push('Luxe fabrics trending');
    }
    if (name.includes('slim') || name.includes('tailored')) {
      score += 0.1;
      reasons.push('Tailored fits in demand');
    }
    if (name.includes('burgundy') || name.includes('emerald')) {
      score += 0.1;
      reasons.push('Rich colors trending');
    }

    return {
      score: Math.min(1, score),
      reasons,
      category: score > 0.7 ? 'trending' : 'classic'
    };
  }

  private getFallbackStyleAnalysis(product: any) {
    const name = product.name?.toLowerCase() || '';
    const occasions = [];
    const seasons = [];
    
    // Determine occasions
    if (name.includes('business') || name.includes('professional')) occasions.push('business');
    if (name.includes('wedding')) occasions.push('wedding');
    if (name.includes('prom')) occasions.push('prom');
    if (name.includes('casual')) occasions.push('casual');
    if (!occasions.length) occasions.push('versatile');

    // Determine seasons
    if (name.includes('summer') || name.includes('linen')) seasons.push('summer');
    if (name.includes('winter') || name.includes('wool')) seasons.push('winter');
    if (!seasons.length) seasons.push('all-season');

    // Determine formality
    let formality = 0.5;
    if (name.includes('tuxedo') || name.includes('formal')) formality = 0.9;
    else if (name.includes('business')) formality = 0.7;
    else if (name.includes('casual')) formality = 0.3;

    return {
      occasions,
      seasons,
      colors: [],
      formality,
      versatility: occasions.includes('versatile') ? 0.8 : 0.5
    };
  }

  private getFallbackAnalysis(product: any): KnowledgeAnalysis {
    return {
      product,
      trending: this.getFallbackTrendingAnalysis(product),
      style: this.getFallbackStyleAnalysis(product),
      recommendations: {
        placement: 'classic',
        reason: 'Quality menswear piece',
        tags: ['menswear']
      }
    };
  }
}

// Export singleton instance
export const cachedKnowledgeAnalyzer = new CachedKnowledgeProductAnalyzer();