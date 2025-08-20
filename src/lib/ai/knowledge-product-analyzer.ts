/**
 * Knowledge-Based AI Product Analyzer
 * Uses Fashion Knowledge Base API to intelligently analyze and categorize products
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

export class KnowledgeProductAnalyzer {
  private knowledgeBaseUrl: string;
  private knowledgeApiKey: string;
  private fashionClipUrl: string;

  constructor() {
    this.knowledgeBaseUrl = process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_API || '';
    this.knowledgeApiKey = process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_KEY || '';
    this.fashionClipUrl = process.env.NEXT_PUBLIC_FASHION_CLIP_API || '';
  }

  /**
   * Analyze product using Fashion Knowledge Base
   */
  async analyzeWithKnowledge(product: any): Promise<KnowledgeAnalysis> {
    try {
      // 1. Get trending analysis from knowledge base
      const trendingAnalysis = await this.getTrendingAnalysis(product);
      
      // 2. Get style recommendations
      const styleAnalysis = await this.getStyleAnalysis(product);
      
      // 3. Get Fashion CLIP visual analysis if image available
      const fashionClipScore = await this.getFashionClipScore(product);
      
      // 4. Determine optimal placement
      const recommendations = this.determineRecommendations(
        product,
        trendingAnalysis,
        styleAnalysis,
        fashionClipScore
      );

      return {
        product,
        trending: trendingAnalysis,
        style: styleAnalysis,
        recommendations,
        fashionClipScore
      };
    } catch (error) {
      console.error('Knowledge analysis error:', error);
      // Fallback to basic analysis
      return this.getFallbackAnalysis(product);
    }
  }

  /**
   * Get trending analysis from Knowledge Base
   */
  private async getTrendingAnalysis(product: any) {
    try {
      const response = await fetch(`${this.knowledgeBaseUrl}/api/trending/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.knowledgeApiKey
        },
        body: JSON.stringify({
          name: product.name,
          category: product.category,
          description: product.description,
          tags: product.tags
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          score: data.score || 0.5,
          reasons: data.reasons || [],
          category: data.category || 'classic'
        };
      }
    } catch (error) {
      console.error('Trending analysis error:', error);
    }

    // Fallback trending analysis based on product attributes
    return this.getFallbackTrendingAnalysis(product);
  }

  /**
   * Get style analysis from Knowledge Base
   */
  private async getStyleAnalysis(product: any) {
    try {
      const response = await fetch(`${this.knowledgeBaseUrl}/api/styles/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.knowledgeApiKey
        },
        body: JSON.stringify({
          product_name: product.name,
          product_type: this.getProductType(product),
          price: product.base_price || product.price
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          occasions: data.occasions || [],
          seasons: data.seasons || [],
          colors: data.colors || [],
          formality: data.formality || 0.5,
          versatility: data.versatility || 0.5
        };
      }
    } catch (error) {
      console.error('Style analysis error:', error);
    }

    // Fallback style analysis
    return this.getFallbackStyleAnalysis(product);
  }

  /**
   * Get Fashion CLIP visual score
   */
  private async getFashionClipScore(product: any): Promise<number | undefined> {
    try {
      // Get primary image URL
      const imageUrl = this.getProductImageUrl(product);
      if (!imageUrl) return undefined;

      const response = await fetch(`${this.fashionClipUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.knowledgeApiKey
        },
        body: JSON.stringify({
          image_url: imageUrl,
          categories: ['suit', 'tuxedo', 'blazer', 'shirt']
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.confidence || data.score || 0.5;
      }
    } catch (error) {
      console.error('Fashion CLIP error:', error);
    }

    return undefined;
  }

  /**
   * Determine product recommendations based on all analyses
   */
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

  /**
   * Batch analyze multiple products and organize by strategy
   */
  async analyzeAndOrganizeProducts(products: any[]) {
    console.log(`Analyzing ${products.length} products with Fashion Knowledge Base...`);
    
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

  // Helper methods
  private getProductType(product: any): string {
    const name = product.name?.toLowerCase() || '';
    if (name.includes('suit')) return 'suit';
    if (name.includes('tuxedo')) return 'tuxedo';
    if (name.includes('blazer')) return 'blazer';
    if (name.includes('shirt')) return 'shirt';
    if (name.includes('tie')) return 'tie';
    return 'other';
  }

  private getProductImageUrl(product: any): string | null {
    if (product.images?.hero?.url) return product.images.hero.url;
    if (product.images?.primary?.cdn_url) return product.images.primary.cdn_url;
    if (product.images?.gallery?.[0]?.cdn_url) return product.images.gallery[0].cdn_url;
    if (product.image) return product.image;
    return null;
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
export const knowledgeProductAnalyzer = new KnowledgeProductAnalyzer();