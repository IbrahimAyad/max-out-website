'use client';

import { smartBundles, SmartBundle, Product } from './smartBundles';
import { TOP_COMBINATIONS, COMBINATION_CONVERSION_DATA, TopCombination } from '@/lib/data/knowledgeBank/topCombinations';
import { COLOR_RELATIONSHIPS, getColorHarmonyScore } from '@/lib/data/knowledgeBank/colorRelationships';

/**
 * Service to generate Smart Bundles based on Knowledge Bank top combinations
 */
class KnowledgeBankBundlesService {
  /**
   * Generate bundles from Knowledge Bank's proven top combinations
   */
  async generateTopBundles(): Promise<SmartBundle[]> {
    const bundles: SmartBundle[] = [];

    // Get all products from smart bundles service
    const products = this.getAllProductsMap();

    // Generate bundles for top 5 combinations
    for (const topCombo of TOP_COMBINATIONS.slice(0, 5)) {
      const bundle = await this.createBundleFromTopCombination(topCombo, products);
      if (bundle) {
        bundles.push(bundle);
      }
    }

    return bundles;
  }

  /**
   * Generate seasonal bundles based on Knowledge Bank data
   */
  async generateSeasonalBundles(season: string): Promise<SmartBundle[]> {
    const seasonalCombos = TOP_COMBINATIONS.filter(combo => 
      combo.events.some(event => event.toLowerCase().includes(season)) ||
      combo.best_for.toLowerCase().includes(season)
    );

    const bundles: SmartBundle[] = [];
    const products = this.getAllProductsMap();

    for (const combo of seasonalCombos.slice(0, 3)) {
      const bundle = await this.createBundleFromTopCombination(combo, products);
      if (bundle) {
        bundles.push(bundle);
      }
    }

    return bundles;
  }

  /**
   * Generate trending bundles based on growth data
   */
  async generateTrendingBundles(): Promise<SmartBundle[]> {
    const trendingCombos = TOP_COMBINATIONS.filter(combo => 
      combo.trending === 'rapidly_increasing' || 
      (combo.growth && combo.growth.includes('+'))
    );

    const bundles: SmartBundle[] = [];
    const products = this.getAllProductsMap();

    for (const combo of trendingCombos) {
      const bundle = await this.createBundleFromTopCombination(combo, products);
      if (bundle) {
        bundles.push(bundle);
      }
    }

    return bundles;
  }

  /**
   * Get bundle recommendations for specific occasion
   */
  async getBundlesForOccasion(occasion: string): Promise<SmartBundle[]> {
    const occasionCombos = TOP_COMBINATIONS.filter(combo =>
      combo.events.includes(occasion) || 
      combo.best_for.toLowerCase().includes(occasion.toLowerCase())
    );

    const bundles: SmartBundle[] = [];
    const products = this.getAllProductsMap();

    for (const combo of occasionCombos) {
      const bundle = await this.createBundleFromTopCombination(combo, products);
      if (bundle) {
        bundles.push(bundle);
      }
    }

    return bundles;
  }

  // Private helper methods
  private getAllProductsMap(): Map<string, Product[]> {
    // This is a simplified version - in production, you'd query your database
    const productsMap = new Map<string, Product[]>();

    // Initialize empty arrays for each category
    productsMap.set('suit', []);
    productsMap.set('shirt', []);
    productsMap.set('tie', []);
    productsMap.set('shoes', []);

    // Get products from smartBundles service (which now has Knowledge Bank data)
    const allProducts = [
      {
        id: 'suit-navy-1',
        name: 'Navy Business Suit',
        category: 'suit' as const,
        price: 599,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public',
        colors: ['navy'],
        tags: ['business', 'formal', 'wedding'],
        inStock: true,
        seasonality: 'year-round' as const
      },
      {
        id: 'suit-charcoal-1',
        name: 'Charcoal Suit',
        category: 'suit' as const,
        price: 649,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/charcoal-suit/public',
        colors: ['charcoal'],
        tags: ['business', 'formal', 'professional'],
        inStock: true,
        seasonality: 'year-round' as const
      },
      {
        id: 'suit-burgundy-1',
        name: 'Burgundy Fall Suit',
        category: 'suit' as const,
        price: 679,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/burgundy-suit/public',
        colors: ['burgundy'],
        tags: ['fall_wedding', 'special_events'],
        inStock: true,
        seasonality: 'fall' as const
      },
      {
        id: 'suit-sage-1',
        name: 'Sage Green Modern Suit',
        category: 'suit' as const,
        price: 629,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/sage-suit/public',
        colors: ['sage_green'],
        tags: ['spring_wedding', 'garden', 'trendy'],
        inStock: true,
        seasonality: 'spring' as const
      },
      {
        id: 'shirt-white-1',
        name: 'Classic White Dress Shirt',
        category: 'shirt' as const,
        price: 89,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/white-shirt/public',
        colors: ['white'],
        tags: ['business', 'formal', 'versatile'],
        inStock: true,
        seasonality: 'year-round' as const
      },
      {
        id: 'shirt-lightblue-1',
        name: 'Light Blue Oxford Shirt',
        category: 'shirt' as const,
        price: 95,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/lightblue-shirt/public',
        colors: ['light_blue'],
        tags: ['business', 'business_casual'],
        inStock: true,
        seasonality: 'year-round' as const
      },
      {
        id: 'tie-burgundy-1',
        name: 'Burgundy Silk Tie',
        category: 'tie' as const,
        price: 65,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/burgundy-tie/public',
        colors: ['burgundy'],
        tags: ['business', 'formal', 'wedding'],
        inStock: true,
        seasonality: 'year-round' as const
      },
      {
        id: 'tie-silver-1',
        name: 'Silver Pattern Tie',
        category: 'tie' as const,
        price: 70,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/silver-tie/public',
        colors: ['silver'],
        tags: ['business', 'formal', 'professional'],
        inStock: true,
        seasonality: 'year-round' as const
      },
      {
        id: 'tie-mustard-1',
        name: 'Mustard Gold Tie',
        category: 'tie' as const,
        price: 68,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/mustard-tie/public',
        colors: ['mustard'],
        tags: ['fall_wedding', 'special_events'],
        inStock: true,
        seasonality: 'fall' as const
      },
      {
        id: 'tie-blushpink-1',
        name: 'Blush Pink Silk Tie',
        category: 'tie' as const,
        price: 72,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/blushpink-tie/public',
        colors: ['blush_pink'],
        tags: ['spring_wedding', 'garden'],
        inStock: true,
        seasonality: 'spring' as const
      },
      {
        id: 'shoes-brown-1',
        name: 'Brown Oxford Shoes',
        category: 'shoes' as const,
        price: 199,
        imageUrl: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/brown-shoes/public',
        colors: ['brown'],
        tags: ['business', 'formal'],
        inStock: true,
        seasonality: 'year-round' as const
      }
    ];

    // Organize products by category and color
    allProducts.forEach(product => {
      const categoryProducts = productsMap.get(product.category) || [];
      categoryProducts.push(product);
      productsMap.set(product.category, categoryProducts);
    });

    return productsMap;
  }

  private async createBundleFromTopCombination(
    topCombo: TopCombination,
    productsMap: Map<string, Product[]>
  ): Promise<SmartBundle | null> {
    // Find matching products
    const suitProducts = productsMap.get('suit') || [];
    const shirtProducts = productsMap.get('shirt') || [];
    const tieProducts = productsMap.get('tie') || [];
    const shoeProducts = productsMap.get('shoes') || [];

    const suit = suitProducts.find(p => 
      p.colors.some(c => c === topCombo.combination.suit || c.includes(topCombo.combination.suit))
    );
    const shirt = shirtProducts.find(p => 
      p.colors.some(c => c === topCombo.combination.shirt || c.includes(topCombo.combination.shirt))
    );
    const tie = tieProducts.find(p => 
      p.colors.some(c => c === topCombo.combination.tie || c.includes(topCombo.combination.tie))
    );

    if (!suit || !shirt || !tie) {

      return null;
    }

    // Add shoes based on suit color
    const shoes = suit.colors.includes('navy') || suit.colors.includes('charcoal') 
      ? shoeProducts.find(p => p.colors.includes('brown'))
      : shoeProducts[0];

    // Get conversion data if available
    const comboKey = `${topCombo.combination.suit}_${topCombo.combination.shirt}_${topCombo.combination.tie}`;
    const conversionData = comboKey in COMBINATION_CONVERSION_DATA
      ? COMBINATION_CONVERSION_DATA[comboKey as keyof typeof COMBINATION_CONVERSION_DATA]
      : null;

    // Calculate color harmony score
    const harmonyScore = getColorHarmonyScore(
      topCombo.combination.suit,
      topCombo.combination.shirt,
      topCombo.combination.tie
    );

    // Create bundle items
    const items = [
      {
        product: suit,
        compatibilityScore: 1.0,
        reasoning: topCombo.description,
        isCore: true
      },
      {
        product: shirt,
        compatibilityScore: topCombo.confidence / 100,
        reasoning: `Perfect match for ${topCombo.combination.suit} suit`,
        isCore: false
      },
      {
        product: tie,
        compatibilityScore: topCombo.confidence / 100,
        reasoning: `Completes the ${topCombo.best_for} look`,
        isCore: false
      }
    ];

    if (shoes) {
      items.push({
        product: shoes,
        compatibilityScore: 0.85,
        reasoning: 'Classic footwear choice',
        isCore: false
      });
    }

    // Calculate pricing
    const totalPrice = items.reduce((sum, item) => sum + item.product.price, 0);
    const discount = totalPrice * 0.1; // 10% bundle discount
    const bundlePrice = totalPrice - discount;

    // Create bundle
    const bundle: SmartBundle = {
      id: `kb_bundle_${topCombo.rank}_${Date.now()}`,
      name: `${topCombo.description} Bundle`,
      description: `${topCombo.best_for}. ${conversionData ? `Loved by ${conversionData.units_sold.toLocaleString()} customers!` : ''}`,
      items,
      totalPrice,
      bundlePrice,
      discount,
      discountPercentage: 10,
      compatibility: {
        overall: topCombo.confidence / 100,
        color: harmonyScore / 100,
        style: topCombo.popularity_score / 100,
        occasion: 0.9
      },
      occasions: topCombo.events,
      seasonality: this.extractSeasonality(topCombo),
      targetCustomer: {
        style: this.extractStyles(topCombo),
        fit: 'regular',
        priceRange: this.determinePriceRange(bundlePrice)
      },
      createdAt: new Date(),
      fashionClipScore: topCombo.confidence / 100
    };

    return bundle;
  }

  private extractSeasonality(combo: TopCombination): string[] {
    const seasons: string[] = [];

    if (combo.events.includes('all_seasons')) {
      return ['year-round'];
    }

    combo.events.forEach(event => {
      if (event.includes('spring')) seasons.push('spring');
      if (event.includes('summer')) seasons.push('summer');
      if (event.includes('fall')) seasons.push('fall');
      if (event.includes('winter')) seasons.push('winter');
    });

    return seasons.length > 0 ? seasons : ['year-round'];
  }

  private extractStyles(combo: TopCombination): string[] {
    const styles: string[] = [];

    if (combo.events.includes('business')) styles.push('professional');
    if (combo.events.includes('wedding')) styles.push('formal');
    if (combo.events.includes('trendy')) styles.push('modern');
    if (combo.description.toLowerCase().includes('classic')) styles.push('classic');
    if (combo.trending === 'rapidly_increasing') styles.push('trendy');

    return styles.length > 0 ? styles : ['versatile'];
  }

  private determinePriceRange(price: number): string {
    if (price < 500) return 'budget';
    if (price < 1000) return 'mid-range';
    if (price < 1500) return 'premium';
    return 'luxury';
  }
}

export const knowledgeBankBundles = new KnowledgeBankBundlesService();