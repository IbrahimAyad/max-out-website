/**
 * AI Product Analyzer
 * Intelligently analyzes, scores, and categorizes products for strategic placement
 */

interface ProductScore {
  trendingScore: number;      // Based on views, clicks, time
  qualityScore: number;       // Based on price, materials, brand
  visualAppealScore: number;  // Based on image count, quality
  seasonalScore: number;      // Based on current season relevance
  versatilityScore: number;   // How many occasions it fits
  overallScore: number;       // Weighted average
}

interface AIProductAnalysis {
  product: any;
  scores: ProductScore;
  category: string;
  tags: string[];
  recommendation: string;
  placement: 'hero' | 'trending' | 'new' | 'bestseller' | 'seasonal' | 'classic';
}

export class AIProductAnalyzer {
  private currentSeason: string;
  private currentMonth: number;

  constructor() {
    this.currentMonth = new Date().getMonth() + 1;
    this.currentSeason = this.getCurrentSeason();
  }

  private getCurrentSeason(): string {
    if (this.currentMonth >= 3 && this.currentMonth <= 5) return 'spring';
    if (this.currentMonth >= 6 && this.currentMonth <= 8) return 'summer';
    if (this.currentMonth >= 9 && this.currentMonth <= 11) return 'fall';
    return 'winter';
  }

  /**
   * Analyze a single product and generate AI scores
   */
  analyzeProduct(product: any): AIProductAnalysis {
    const scores = this.calculateScores(product);
    const category = this.categorizeProduct(product);
    const tags = this.generateTags(product);
    const placement = this.determinePlacement(product, scores);
    const recommendation = this.generateRecommendation(product, scores);

    return {
      product,
      scores,
      category,
      tags,
      recommendation,
      placement
    };
  }

  /**
   * Calculate AI scores for a product
   */
  private calculateScores(product: any): ProductScore {
    // Trending Score (based on recency, category popularity)
    let trendingScore = 0.5; // Base score
    if (product.created_at) {
      const daysOld = this.getDaysOld(product.created_at);
      if (daysOld < 7) trendingScore += 0.3;
      else if (daysOld < 30) trendingScore += 0.2;
      else if (daysOld < 60) trendingScore += 0.1;
    }
    
    // Boost for certain trending categories
    if (product.name?.toLowerCase().includes('velvet') || 
        product.name?.toLowerCase().includes('sparkle') ||
        product.name?.toLowerCase().includes('floral')) {
      trendingScore += 0.2;
    }

    // Quality Score (based on price and materials)
    let qualityScore = 0.5;
    const price = product.base_price || product.price || 0;
    if (price > 400) qualityScore = 0.9;
    else if (price > 300) qualityScore = 0.8;
    else if (price > 200) qualityScore = 0.7;
    else if (price > 100) qualityScore = 0.6;

    // Visual Appeal Score (based on images)
    let visualAppealScore = 0.3;
    if (product.images) {
      const imageCount = this.countImages(product.images);
      if (imageCount >= 5) visualAppealScore = 0.9;
      else if (imageCount >= 3) visualAppealScore = 0.7;
      else if (imageCount >= 2) visualAppealScore = 0.5;
      
      // Bonus for lifestyle images
      if (product.images.lifestyle?.length > 0) visualAppealScore += 0.1;
    }

    // Seasonal Score
    let seasonalScore = this.calculateSeasonalScore(product);

    // Versatility Score (how many occasions)
    let versatilityScore = 0.5;
    const productName = product.name?.toLowerCase() || '';
    if (productName.includes('classic') || productName.includes('essential')) {
      versatilityScore = 0.9;
    } else if (productName.includes('business') || productName.includes('formal')) {
      versatilityScore = 0.7;
    } else if (productName.includes('wedding') || productName.includes('prom')) {
      versatilityScore = 0.4; // More specialized
    }

    // Calculate overall score (weighted average)
    const overallScore = (
      trendingScore * 0.25 +
      qualityScore * 0.20 +
      visualAppealScore * 0.20 +
      seasonalScore * 0.20 +
      versatilityScore * 0.15
    );

    return {
      trendingScore: Math.min(1, trendingScore),
      qualityScore: Math.min(1, qualityScore),
      visualAppealScore: Math.min(1, visualAppealScore),
      seasonalScore: Math.min(1, seasonalScore),
      versatilityScore: Math.min(1, versatilityScore),
      overallScore: Math.min(1, overallScore)
    };
  }

  /**
   * Calculate seasonal relevance score
   */
  private calculateSeasonalScore(product: any): number {
    const name = product.name?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    const combined = name + ' ' + description;

    let score = 0.5; // Base score

    // Summer scoring
    if (this.currentSeason === 'summer') {
      if (combined.includes('linen') || combined.includes('light') || 
          combined.includes('summer') || combined.includes('breathable')) {
        score = 0.9;
      } else if (combined.includes('wool') || combined.includes('heavy') || 
                 combined.includes('winter')) {
        score = 0.2;
      }
    }
    
    // Winter scoring
    else if (this.currentSeason === 'winter') {
      if (combined.includes('wool') || combined.includes('velvet') || 
          combined.includes('winter') || combined.includes('warm')) {
        score = 0.9;
      } else if (combined.includes('linen') || combined.includes('summer')) {
        score = 0.2;
      }
    }
    
    // Spring/Fall - transitional seasons favor versatile pieces
    else {
      if (combined.includes('classic') || combined.includes('essential') ||
          combined.includes('versatile')) {
        score = 0.8;
      }
    }

    return score;
  }

  /**
   * Categorize product based on AI analysis
   */
  private categorizeProduct(product: any): string {
    const name = product.name?.toLowerCase() || '';
    
    if (name.includes('tuxedo') || name.includes('formal')) return 'formal';
    if (name.includes('wedding')) return 'wedding';
    if (name.includes('prom') || name.includes('sparkle')) return 'prom';
    if (name.includes('business') || name.includes('professional')) return 'business';
    if (name.includes('casual') || name.includes('relaxed')) return 'casual';
    if (name.includes('blazer') || name.includes('jacket')) return 'outerwear';
    
    return 'classic';
  }

  /**
   * Generate smart tags for the product
   */
  private generateTags(product: any): string[] {
    const tags: string[] = [];
    const name = product.name?.toLowerCase() || '';
    const price = product.base_price || product.price || 0;

    // Price-based tags
    if (price > 400) tags.push('luxury');
    else if (price < 200) tags.push('value');

    // Style tags
    if (name.includes('slim')) tags.push('slim-fit');
    if (name.includes('classic')) tags.push('timeless');
    if (name.includes('modern')) tags.push('contemporary');
    
    // Occasion tags
    if (name.includes('wedding')) tags.push('wedding-ready');
    if (name.includes('business')) tags.push('office-appropriate');
    if (name.includes('prom')) tags.push('prom-perfect');

    // Material/feature tags
    if (name.includes('velvet')) tags.push('luxe-fabric');
    if (name.includes('wool')) tags.push('premium-wool');
    if (name.includes('stretch')) tags.push('comfort-stretch');

    return tags;
  }

  /**
   * Determine optimal placement for product
   */
  private determinePlacement(product: any, scores: ProductScore): AIProductAnalysis['placement'] {
    // Hero placement for highest overall scorers with good visuals
    if (scores.overallScore > 0.8 && scores.visualAppealScore > 0.7) {
      return 'hero';
    }
    
    // Trending for high trending scores
    if (scores.trendingScore > 0.7) {
      return 'trending';
    }
    
    // New arrivals for recent products
    const daysOld = product.created_at ? this.getDaysOld(product.created_at) : 999;
    if (daysOld < 30) {
      return 'new';
    }
    
    // Seasonal for high seasonal relevance
    if (scores.seasonalScore > 0.8) {
      return 'seasonal';
    }
    
    // Bestseller for versatile, quality pieces
    if (scores.versatilityScore > 0.7 && scores.qualityScore > 0.6) {
      return 'bestseller';
    }
    
    return 'classic';
  }

  /**
   * Generate AI recommendation text
   */
  private generateRecommendation(product: any, scores: ProductScore): string {
    const reasons: string[] = [];

    if (scores.trendingScore > 0.7) {
      reasons.push('Currently trending');
    }
    if (scores.seasonalScore > 0.8) {
      reasons.push(`Perfect for ${this.currentSeason}`);
    }
    if (scores.versatilityScore > 0.8) {
      reasons.push('Versatile essential');
    }
    if (scores.qualityScore > 0.8) {
      reasons.push('Premium quality');
    }
    if (scores.visualAppealScore > 0.8) {
      reasons.push('Stunning visuals');
    }

    return reasons.length > 0 
      ? reasons.join(' • ')
      : 'Classic style';
  }

  /**
   * Analyze multiple products and sort by strategy
   */
  analyzeAndSortProducts(products: any[]): {
    hero: any[];
    trending: any[];
    newArrivals: any[];
    seasonal: any[];
    bestsellers: any[];
    classics: any[];
    all: AIProductAnalysis[];
  } {
    // Analyze all products
    const analyzed = products.map(p => this.analyzeProduct(p));
    
    // Sort by overall score
    analyzed.sort((a, b) => b.scores.overallScore - a.scores.overallScore);

    // Categorize by placement
    const hero = analyzed
      .filter(a => a.placement === 'hero')
      .slice(0, 3)
      .map(a => a.product);
      
    const trending = analyzed
      .filter(a => a.placement === 'trending' || a.scores.trendingScore > 0.6)
      .slice(0, 8)
      .map(a => a.product);
      
    const newArrivals = analyzed
      .filter(a => a.placement === 'new')
      .slice(0, 8)
      .map(a => a.product);
      
    const seasonal = analyzed
      .filter(a => a.placement === 'seasonal' || a.scores.seasonalScore > 0.7)
      .slice(0, 8)
      .map(a => a.product);
      
    const bestsellers = analyzed
      .filter(a => a.placement === 'bestseller' || a.scores.versatilityScore > 0.7)
      .slice(0, 8)
      .map(a => a.product);
      
    const classics = analyzed
      .filter(a => a.placement === 'classic')
      .slice(0, 8)
      .map(a => a.product);

    return {
      hero,
      trending,
      newArrivals,
      seasonal,
      bestsellers,
      classics,
      all: analyzed
    };
  }

  // Helper methods
  private getDaysOld(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private countImages(images: any): number {
    if (!images) return 0;
    let count = 0;
    if (images.hero) count++;
    if (images.primary) count++;
    if (images.gallery?.length) count += images.gallery.length;
    if (images.lifestyle?.length) count += images.lifestyle.length;
    if (images.detail_shots?.length) count += images.detail_shots.length;
    return count;
  }
}

// Export singleton instance
export const aiProductAnalyzer = new AIProductAnalyzer();