'use client';

import { fashionClipService } from './fashionClipService';

export interface Product {
  id: string;
  name: string;
  category: 'suit' | 'shirt' | 'tie' | 'shoes' | 'accessory' | 'outerwear';
  subcategory?: string;
  price: number;
  imageUrl: string;
  colors: string[];
  tags: string[];
  styleVector?: number[];
  inStock: boolean;
  seasonality?: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
}

export interface BundleItem {
  product: Product;
  compatibilityScore: number;
  reasoning: string;
  isCore: boolean; // Whether this is the main piece the bundle is built around
}

export interface SmartBundle {
  id: string;
  name: string;
  description: string;
  items: BundleItem[];
  totalPrice: number;
  bundlePrice: number;
  discount: number;
  discountPercentage: number;
  compatibility: {
    overall: number;
    color: number;
    style: number;
    occasion: number;
  };
  occasions: string[];
  seasonality: string[];
  targetCustomer: {
    style: string[];
    fit: string;
    priceRange: string;
  };
  createdAt: Date;
  fashionClipScore: number;
}

export interface BundleGenerationOptions {
  coreProductId: string;
  occasion?: string;
  priceRange?: [number, number];
  style?: string[];
  season?: string;
  includeCategories?: Product['category'][];
  excludeProducts?: string[];
  maxItems?: number;
  minCompatibilityScore?: number;
}

class SmartBundlesService {
  private products: Map<string, Product> = new Map();
  private bundles: Map<string, SmartBundle> = new Map();
  private compatibilityCache: Map<string, number> = new Map();

  // Mock product data - in production this would come from your product database
  constructor() {
    this.initializeMockProducts();
  }

  /**
   * Generate a smart bundle based on a core product and preferences
   */
  async generateBundle(options: BundleGenerationOptions): Promise<SmartBundle> {
    const coreProduct = this.products.get(options.coreProductId);
    if (!coreProduct) {
      throw new Error('Core product not found');
    }

    // Get complementary products
    const candidates = await this.findComplementaryProducts(coreProduct, options);

    // Score and select best combinations
    const selectedItems = await this.selectOptimalCombination(
      coreProduct,
      candidates,
      options
    );

    // Create bundle
    const bundle = this.createBundle(coreProduct, selectedItems, options);

    this.bundles.set(bundle.id, bundle);
    return bundle;
  }

  /**
   * Generate multiple bundle variations for A/B testing
   */
  async generateBundleVariations(
    coreProductId: string,
    count: number = 3
  ): Promise<SmartBundle[]> {
    const variations: SmartBundle[] = [];

    const baseOptions: BundleGenerationOptions = {
      coreProductId,
      maxItems: 4,
      minCompatibilityScore: 0.7
    };

    // Conservative bundle (high compatibility, fewer items)
    variations.push(await this.generateBundle({
      ...baseOptions,
      maxItems: 3,
      minCompatibilityScore: 0.8
    }));

    // Comprehensive bundle (more items, good compatibility)
    variations.push(await this.generateBundle({
      ...baseOptions,
      maxItems: 5,
      minCompatibilityScore: 0.7
    }));

    // Trendy bundle (includes seasonal/trending items)
    const trendyOptions = {
      ...baseOptions,
      style: ['modern', 'trendy', 'contemporary'],
      season: this.getCurrentSeason()
    };
    variations.push(await this.generateBundle(trendyOptions));

    return variations;
  }

  /**
   * Calculate compatibility between two products using Fashion-CLIP
   */
  async calculateProductCompatibility(
    productA: Product,
    productB: Product
  ): Promise<number> {
    const cacheKey = `${productA.id}_${productB.id}`;
    const cachedScore = this.compatibilityCache.get(cacheKey);

    if (cachedScore !== undefined) {
      return cachedScore;
    }

    let score = 0;

    // Color compatibility (30% weight)
    const colorScore = this.calculateColorCompatibility(productA.colors, productB.colors);
    score += colorScore * 0.3;

    // Style compatibility (40% weight)
    const styleScore = this.calculateStyleCompatibility(productA.tags, productB.tags);
    score += styleScore * 0.4;

    // Category compatibility (20% weight)
    const categoryScore = this.calculateCategoryCompatibility(productA.category, productB.category);
    score += categoryScore * 0.2;

    // Fashion-CLIP similarity (10% weight)
    if (productA.styleVector && productB.styleVector) {
      const fashionClipScore = this.calculateVectorSimilarity(
        productA.styleVector,
        productB.styleVector
      );
      score += fashionClipScore * 0.1;
    }

    // Cache the result
    this.compatibilityCache.set(cacheKey, score);
    this.compatibilityCache.set(`${productB.id}_${productA.id}`, score);

    return score;
  }

  /**
   * Get bundle recommendations for a customer based on their style profile
   */
  async getPersonalizedBundles(
    customerId: string,
    preferences: {
      style?: string[];
      colors?: string[];
      priceRange?: [number, number];
      occasions?: string[];
    }
  ): Promise<SmartBundle[]> {
    // In production, this would use the customer's style profile
    const personalizedBundles: SmartBundle[] = [];

    // Get products that match customer preferences
    const matchingProducts = Array.from(this.products.values()).filter(product => {
      if (preferences.priceRange) {
        const [min, max] = preferences.priceRange;
        if (product.price < min || product.price > max) return false;
      }

      if (preferences.colors?.length) {
        const hasMatchingColor = product.colors.some(color => 
          preferences.colors!.some(prefColor => 
            color.toLowerCase().includes(prefColor.toLowerCase())
          )
        );
        if (!hasMatchingColor) return false;
      }

      return true;
    });

    // Generate bundles for top matching products
    for (const product of matchingProducts.slice(0, 5)) {
      try {
        const bundle = await this.generateBundle({
          coreProductId: product.id,
          priceRange: preferences.priceRange,
          style: preferences.style,
          maxItems: 4
        });
        personalizedBundles.push(bundle);
      } catch (error) {

      }
    }

    return personalizedBundles.sort((a, b) => b.fashionClipScore - a.fashionClipScore);
  }

  /**
   * Optimize bundle pricing using dynamic pricing strategies
   */
  optimizeBundlePricing(bundle: SmartBundle, context: {
    customerSegment?: 'premium' | 'value' | 'luxury';
    seasonality?: string;
    inventory?: Map<string, number>;
    competitorPricing?: number;
  }): SmartBundle {
    let discountPercentage = 10; // Base discount

    // Adjust based on customer segment
    switch (context.customerSegment) {
      case 'luxury':
        discountPercentage = 5; // Smaller discount for luxury customers
        break;
      case 'value':
        discountPercentage = 15; // Larger discount for value-conscious customers
        break;
      case 'premium':
        discountPercentage = 10; // Standard discount
        break;
    }

    // Seasonal adjustments
    if (context.seasonality === 'end-of-season') {
      discountPercentage += 10;
    }

    // Inventory-based adjustments
    if (context.inventory) {
      const avgInventory = Array.from(context.inventory.values())
        .reduce((sum, inv) => sum + inv, 0) / context.inventory.size;

      if (avgInventory > 50) {
        discountPercentage += 5; // Higher discount for overstocked items
      }
    }

    // Update bundle pricing
    const updatedBundle = { ...bundle };
    updatedBundle.discountPercentage = Math.min(discountPercentage, 25); // Cap at 25%
    updatedBundle.discount = bundle.totalPrice * (updatedBundle.discountPercentage / 100);
    updatedBundle.bundlePrice = bundle.totalPrice - updatedBundle.discount;

    return updatedBundle;
  }

  // Private helper methods
  private async findComplementaryProducts(
    coreProduct: Product,
    options: BundleGenerationOptions
  ): Promise<Product[]> {
    const candidates = Array.from(this.products.values()).filter(product => {
      if (product.id === coreProduct.id) return false;
      if (!product.inStock) return false;
      if (options.excludeProducts?.includes(product.id)) return false;

      if (options.includeCategories?.length) {
        if (!options.includeCategories.includes(product.category)) return false;
      }

      if (options.priceRange) {
        const [min, max] = options.priceRange;
        if (product.price < min || product.price > max) return false;
      }

      return true;
    });

    // Score each candidate for compatibility
    const scoredCandidates = await Promise.all(
      candidates.map(async (product) => ({
        product,
        score: await this.calculateProductCompatibility(coreProduct, product)
      }))
    );

    return scoredCandidates
      .filter(({ score }) => score >= (options.minCompatibilityScore || 0.6))
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);
  }

  private async selectOptimalCombination(
    coreProduct: Product,
    candidates: Product[],
    options: BundleGenerationOptions
  ): Promise<BundleItem[]> {
    const maxItems = options.maxItems || 4;
    const items: BundleItem[] = [];

    // Add core product
    items.push({
      product: coreProduct,
      compatibilityScore: 1.0,
      reasoning: 'Core product',
      isCore: true
    });

    // Select complementary products by category priority
    const categoryPriority = this.getCategoryPriority(coreProduct.category);

    for (const category of categoryPriority) {
      if (items.length >= maxItems) break;

      const categoryProducts = candidates.filter(p => p.category === category);
      if (categoryProducts.length === 0) continue;

      const bestMatch = categoryProducts[0];
      const compatibility = await this.calculateProductCompatibility(coreProduct, bestMatch);

      items.push({
        product: bestMatch,
        compatibilityScore: compatibility,
        reasoning: this.generateCompatibilityReasoning(coreProduct, bestMatch, compatibility),
        isCore: false
      });
    }

    return items;
  }

  private createBundle(
    coreProduct: Product,
    items: BundleItem[],
    options: BundleGenerationOptions
  ): SmartBundle {
    const totalPrice = items.reduce((sum, item) => sum + item.product.price, 0);
    const bundleDiscount = Math.min(items.length * 5, 20); // 5% per item, max 20%
    const discount = totalPrice * (bundleDiscount / 100);
    const bundlePrice = totalPrice - discount;

    const compatibility = this.calculateOverallCompatibility(items);
    const occasions = this.extractOccasions(items);
    const seasonality = this.extractSeasonality(items);

    return {
      id: `bundle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: this.generateBundleName(coreProduct, items),
      description: this.generateBundleDescription(items, occasions),
      items,
      totalPrice,
      bundlePrice,
      discount,
      discountPercentage: bundleDiscount,
      compatibility,
      occasions,
      seasonality,
      targetCustomer: {
        style: this.extractStyles(items),
        fit: this.extractFit(items),
        priceRange: this.classifyPriceRange(bundlePrice)
      },
      createdAt: new Date(),
      fashionClipScore: this.calculateFashionClipScore(items)
    };
  }

  private calculateColorCompatibility(colorsA: string[], colorsB: string[]): number {
    // Simplified color compatibility logic
    const complementaryPairs = [
      ['navy', 'white'], ['black', 'white'], ['charcoal', 'light blue'],
      ['brown', 'cream'], ['burgundy', 'navy'], ['green', 'brown']
    ];

    for (const colorA of colorsA) {
      for (const colorB of colorsB) {
        for (const [c1, c2] of complementaryPairs) {
          if ((colorA.includes(c1) && colorB.includes(c2)) ||
              (colorA.includes(c2) && colorB.includes(c1))) {
            return 0.9;
          }
        }
      }
    }

    return 0.6; // Default moderate compatibility
  }

  private calculateStyleCompatibility(tagsA: string[], tagsB: string[]): number {
    const commonTags = tagsA.filter(tag => tagsB.includes(tag));
    const totalUniqueTags = new Set([...tagsA, ...tagsB]).size;

    return commonTags.length / totalUniqueTags;
  }

  private calculateCategoryCompatibility(categoryA: Product['category'], categoryB: Product['category']): number {
    const compatibilityMatrix: Record<string, Record<string, number>> = {
      suit: { shirt: 0.9, tie: 0.8, shoes: 0.7, accessory: 0.6 },
      shirt: { suit: 0.9, tie: 0.8, accessory: 0.6, shoes: 0.5 },
      tie: { suit: 0.8, shirt: 0.8, accessory: 0.4 },
      shoes: { suit: 0.7, shirt: 0.5, outerwear: 0.6 },
      accessory: { suit: 0.6, shirt: 0.6, outerwear: 0.5 },
      outerwear: { suit: 0.5, shoes: 0.6, accessory: 0.5 }
    };

    return compatibilityMatrix[categoryA]?.[categoryB] || 0.3;
  }

  private calculateVectorSimilarity(vectorA: number[], vectorB: number[]): number {
    // Cosine similarity
    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));

    return dotProduct / (magnitudeA * magnitudeB) || 0;
  }

  private getCategoryPriority(coreCategory: Product['category']): Product['category'][] {
    const priorities: Record<Product['category'], Product['category'][]> = {
      suit: ['shirt', 'tie', 'shoes', 'accessory'],
      shirt: ['tie', 'suit', 'accessory', 'shoes'],
      tie: ['shirt', 'suit', 'accessory'],
      shoes: ['suit', 'shirt', 'outerwear'],
      accessory: ['suit', 'shirt', 'outerwear'],
      outerwear: ['suit', 'shirt', 'accessory']
    };

    return priorities[coreCategory] || [];
  }

  private generateCompatibilityReasoning(productA: Product, productB: Product, score: number): string {
    if (score > 0.8) return `Excellent match - ${productB.category} complements ${productA.category} perfectly`;
    if (score > 0.6) return `Good match - compatible style and colors`;
    return `Moderate match - adds variety to the outfit`;
  }

  private calculateOverallCompatibility(items: BundleItem[]) {
    const avgCompatibility = items.reduce((sum, item) => sum + item.compatibilityScore, 0) / items.length;

    return {
      overall: avgCompatibility,
      color: avgCompatibility * 0.9, // Mock individual scores
      style: avgCompatibility * 0.95,
      occasion: avgCompatibility * 0.85
    };
  }

  private extractOccasions(items: BundleItem[]): string[] {
    const occasionTags = ['business', 'formal', 'wedding', 'casual', 'evening'];
    const foundOccasions = new Set<string>();

    items.forEach(item => {
      item.product.tags.forEach(tag => {
        if (occasionTags.includes(tag)) {
          foundOccasions.add(tag);
        }
      });
    });

    return Array.from(foundOccasions);
  }

  private extractSeasonality(items: BundleItem[]): string[] {
    const seasons = items
      .map(item => item.product.seasonality)
      .filter((season): season is NonNullable<Product['seasonality']> => season !== undefined);

    return [...new Set(seasons)];
  }

  private extractStyles(items: BundleItem[]): string[] {
    const styleTags = ['modern', 'classic', 'contemporary', 'traditional', 'trendy'];
    const styles = new Set<string>();

    items.forEach(item => {
      item.product.tags.forEach(tag => {
        if (styleTags.includes(tag)) {
          styles.add(tag);
        }
      });
    });

    return Array.from(styles);
  }

  private extractFit(items: BundleItem[]): string {
    const fitTags = items.flatMap(item => item.product.tags)
      .filter(tag => ['slim', 'regular', 'relaxed'].includes(tag));

    return fitTags[0] || 'regular';
  }

  private classifyPriceRange(price: number): string {
    if (price < 300) return 'budget';
    if (price < 800) return 'mid-range';
    if (price < 1500) return 'premium';
    return 'luxury';
  }

  private generateBundleName(coreProduct: Product, items: BundleItem[]): string {
    const occasion = this.extractOccasions(items)[0] || 'professional';
    const style = this.extractStyles(items)[0] || 'classic';

    return `${style.charAt(0).toUpperCase() + style.slice(1)} ${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Bundle`;
  }

  private generateBundleDescription(items: BundleItem[], occasions: string[]): string {
    const itemTypes = items.map(item => item.product.category).join(', ');
    const occasionText = occasions.length > 0 ? occasions.join(' and ') : 'professional';

    return `Complete ${occasionText} outfit with ${itemTypes}. Curated by AI for perfect style harmony.`;
  }

  private calculateFashionClipScore(items: BundleItem[]): number {
    return items.reduce((sum, item) => sum + item.compatibilityScore, 0) / items.length;
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  private initializeMockProducts() {
    // Import top combinations from Knowledge Bank
    const { TOP_COMBINATIONS, COMBINATION_CONVERSION_DATA } = require('@/lib/data/knowledgeBank/topCombinations');

    const mockProducts: Product[] = [
      // Navy suits - most popular
      {
        id: 'suit-navy-1',
        name: 'Navy Business Suit',
        category: 'suit',
        price: 599,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public',
        colors: ['navy', 'dark blue'],
        tags: ['business', 'formal', 'slim fit', 'wool', 'wedding', 'all_seasons'],
        inStock: true,
        seasonality: 'year-round',
        styleVector: [0.8, 0.2, 0.9, 0.1, 0.7]
      },
      // Charcoal suits
      {
        id: 'suit-charcoal-1',
        name: 'Charcoal Suit',
        category: 'suit',
        price: 649,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/charcoal-suit/public',
        colors: ['charcoal', 'dark grey'],
        tags: ['business', 'formal', 'professional', 'evening'],
        inStock: true,
        seasonality: 'year-round',
        styleVector: [0.9, 0.1, 0.8, 0.2, 0.8]
      },
      // Burgundy suits - trending
      {
        id: 'suit-burgundy-1',
        name: 'Burgundy Fall Suit',
        category: 'suit',
        price: 679,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/burgundy-suit/public',
        colors: ['burgundy', 'wine'],
        tags: ['fall_wedding', 'special_events', 'trendy'],
        inStock: true,
        seasonality: 'fall',
        styleVector: [0.7, 0.5, 0.8, 0.4, 0.9]
      },
      // Sage green suits - rapidly trending
      {
        id: 'suit-sage-1',
        name: 'Sage Green Modern Suit',
        category: 'suit',
        price: 629,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/sage-suit/public',
        colors: ['sage_green', 'sage'],
        tags: ['spring_wedding', 'garden', 'trendy', 'outdoor'],
        inStock: true,
        seasonality: 'spring',
        styleVector: [0.6, 0.7, 0.7, 0.6, 0.8]
      },
      // White shirts
      {
        id: 'shirt-white-1',
        name: 'Classic White Dress Shirt',
        category: 'shirt',
        price: 89,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/white-shirt/public',
        colors: ['white'],
        tags: ['business', 'formal', 'cotton', 'classic', 'versatile'],
        inStock: true,
        seasonality: 'year-round',
        styleVector: [0.9, 0.1, 0.8, 0.2, 0.6]
      },
      // Light blue shirts
      {
        id: 'shirt-lightblue-1',
        name: 'Light Blue Oxford Shirt',
        category: 'shirt',
        price: 95,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/lightblue-shirt/public',
        colors: ['light_blue', 'blue'],
        tags: ['business', 'business_casual', 'summer'],
        inStock: true,
        seasonality: 'year-round',
        styleVector: [0.8, 0.2, 0.7, 0.3, 0.6]
      },
      // Pink shirts
      {
        id: 'shirt-pink-1',
        name: 'Pink Dress Shirt',
        category: 'shirt',
        price: 99,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/pink-shirt/public',
        colors: ['pink', 'light_pink'],
        tags: ['business', 'social', 'modern'],
        inStock: true,
        seasonality: 'spring',
        styleVector: [0.7, 0.4, 0.6, 0.5, 0.7]
      },
      // Burgundy tie - top performer
      {
        id: 'tie-burgundy-1',
        name: 'Burgundy Silk Tie',
        category: 'tie',
        price: 65,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/burgundy-tie/public',
        colors: ['burgundy', 'wine'],
        tags: ['business', 'formal', 'silk', 'classic', 'wedding'],
        inStock: true,
        seasonality: 'year-round',
        styleVector: [0.8, 0.3, 0.9, 0.2, 0.7]
      },
      // Silver tie
      {
        id: 'tie-silver-1',
        name: 'Silver Pattern Tie',
        category: 'tie',
        price: 70,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/silver-tie/public',
        colors: ['silver', 'grey'],
        tags: ['business', 'formal', 'professional'],
        inStock: true,
        seasonality: 'year-round',
        styleVector: [0.9, 0.2, 0.8, 0.1, 0.6]
      },
      // Mustard tie - fall favorite
      {
        id: 'tie-mustard-1',
        name: 'Mustard Gold Tie',
        category: 'tie',
        price: 68,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/mustard-tie/public',
        colors: ['mustard', 'gold'],
        tags: ['fall_wedding', 'special_events', 'trendy'],
        inStock: true,
        seasonality: 'fall',
        styleVector: [0.7, 0.5, 0.7, 0.4, 0.8]
      },
      // Blush pink tie - trending
      {
        id: 'tie-blushpink-1',
        name: 'Blush Pink Silk Tie',
        category: 'tie',
        price: 72,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/blushpink-tie/public',
        colors: ['blush_pink', 'pink'],
        tags: ['spring_wedding', 'garden', 'trendy'],
        inStock: true,
        seasonality: 'spring',
        styleVector: [0.6, 0.6, 0.7, 0.5, 0.7]
      },
      // Navy pattern tie
      {
        id: 'tie-navypattern-1',
        name: 'Navy Pattern Tie',
        category: 'tie',
        price: 60,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/navypattern-tie/public',
        colors: ['navy', 'blue'],
        tags: ['business', 'social', 'versatile'],
        inStock: true,
        seasonality: 'year-round',
        styleVector: [0.8, 0.3, 0.7, 0.2, 0.6]
      },
      // Coral tie - summer
      {
        id: 'tie-coral-1',
        name: 'Coral Summer Tie',
        category: 'tie',
        price: 65,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/coral-tie/public',
        colors: ['coral', 'orange-pink'],
        tags: ['spring_wedding', 'summer', 'daytime'],
        inStock: true,
        seasonality: 'summer',
        styleVector: [0.6, 0.7, 0.6, 0.6, 0.7]
      },
      // Sage green tie
      {
        id: 'tie-sagegreen-1',
        name: 'Sage Green Tie',
        category: 'tie',
        price: 68,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/sagegreen-tie/public',
        colors: ['sage_green', 'green'],
        tags: ['summer', 'outdoor', 'casual_wedding'],
        inStock: true,
        seasonality: 'summer',
        styleVector: [0.6, 0.6, 0.7, 0.5, 0.7]
      },
      // Oxford shoes
      {
        id: 'shoes-brown-1',
        name: 'Brown Oxford Shoes',
        category: 'shoes',
        price: 199,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/brown-shoes/public',
        colors: ['brown', 'cognac'],
        tags: ['business', 'formal', 'leather', 'oxford'],
        inStock: true,
        seasonality: 'year-round',
        styleVector: [0.6, 0.4, 0.7, 0.3, 0.8]
      },
      // Black dress shoes
      {
        id: 'shoes-black-1',
        name: 'Black Patent Leather Shoes',
        category: 'shoes',
        price: 229,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/black-shoes/public',
        colors: ['black'],
        tags: ['formal', 'black_tie', 'evening'],
        inStock: true,
        seasonality: 'year-round',
        styleVector: [0.9, 0.1, 0.9, 0.1, 0.9]
      }
    ];

    mockProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }
}

export const smartBundles = new SmartBundlesService();