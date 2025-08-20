import { Product } from "@/lib/types";
import {
  RecommendationType,
  RecommendationContext,
  Recommendation,
  ProductAffinity,
  StyleProfile,
  TrendingData,
} from "./types";
import { recommendationCache } from "@/lib/utils/performance/cache";
import { retry } from "@/lib/utils/performance/retry";

class RecommendationService {
  private affinityCache: Map<string, ProductAffinity> = new Map();
  private trendingCache: TrendingData | null = null;
  private trendingCacheExpiry: number = 0;

  async getRecommendations(
    type: RecommendationType,
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    // Check cache first
    const cacheKey = `${type}-${JSON.stringify(context)}`;
    const cached = recommendationCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let recommendations: Recommendation[] = [];

    switch (type) {
      case "customers_also_bought":
        recommendations = await this.getCustomersAlsoBought(context);
        break;
      case "complete_the_look":
        recommendations = await this.getCompleteTheLook(context);
        break;
      case "based_on_style":
        recommendations = await this.getBasedOnStyle(context);
        break;
      case "trending_in_size":
        recommendations = await this.getTrendingInSize(context);
        break;
      case "similar_products":
        recommendations = await this.getSimilarProducts(context);
        break;
      case "personalized":
        recommendations = await this.getPersonalized(context);
        break;
      default:
        return [];
    }

    // Cache the results
    recommendationCache.set(cacheKey, recommendations);
    return recommendations;
  }

  private async getCustomersAlsoBought(
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    if (!context.productId) return [];

    try {
      // Fetch product affinities from API
      const response = await fetch(
        `/api/recommendations/affinity?productId=${context.productId}`
      );

      if (!response.ok) {
        return this.getMockCustomersAlsoBought(context);
      }

      const affinity: ProductAffinity = await response.json();

      // Get top related products
      const recommendations = await Promise.all(
        affinity.relatedProducts
          .slice(0, context.limit || 4)
          .map(async (related) => {
            const product = await this.fetchProduct(related.productId);
            if (!product) return null;

            return {
              product,
              score: related.score,
              reason: `${related.cooccurrence} customers also bought this`,
              type: "customers_also_bought" as RecommendationType,
              metadata: {
                purchasedTogether: related.cooccurrence,
              },
            };
          })
      );

      const resolvedRecommendations = await recommendations;
      return resolvedRecommendations.filter(r => r !== null) as Recommendation[];
    } catch (error) {

      return this.getMockCustomersAlsoBought(context);
    }
  }

  private async getCompleteTheLook(
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    if (!context.productId) return [];

    try {
      const currentProduct = await this.fetchProduct(context.productId);
      if (!currentProduct) return [];

      // Define complementary categories
      const complementaryCategories: Record<string, string[]> = {
        suits: ["shirts", "accessories", "shoes"],
        shirts: ["suits", "accessories"],
        accessories: ["suits", "shirts"],
        shoes: ["suits", "accessories"],
      };

      const targetCategories = complementaryCategories[currentProduct.category] || [];

      // Fetch products from complementary categories
      const recommendations: Recommendation[] = [];

      for (const category of targetCategories) {
        const products = await this.fetchProductsByCategory(category);

        // Score based on style compatibility
        const scored = products
          .map((product) => ({
            product,
            score: this.calculateStyleCompatibility(currentProduct, product),
            reason: `Complete your ${currentProduct.category} look`,
            type: "complete_the_look" as RecommendationType,
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 2); // Get top 2 from each category

        recommendations.push(...scored);
      }

      return recommendations.slice(0, context.limit || 6);
    } catch (error) {

      return [];
    }
  }

  private async getBasedOnStyle(
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    if (!context.stylePreferences && !context.customerId) return [];

    try {
      // Get style profile
      const styleProfile = await this.getStyleProfile(context.customerId!);
      const preferences = context.stylePreferences || styleProfile;

      // Fetch products matching style preferences
      const products = await this.fetchAllProducts();

      const recommendations = products
        .map((product) => {
          const score = this.calculateStyleMatch(product, preferences);
          return {
            product,
            score,
            reason: this.getStyleReason(preferences),
            type: "based_on_style" as RecommendationType,
            metadata: {
              personalizedScore: score,
            },
          };
        })
        .filter((r) => r.score > 0.5)
        .sort((a, b) => b.score - a.score)
        .slice(0, context.limit || 8);

      return recommendations;
    } catch (error) {

      return [];
    }
  }

  private async getTrendingInSize(
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    if (!context.size) return [];

    try {
      const trending = await this.getTrendingData();
      const sizeProducts = trending.bySize[context.size] || [];

      const recommendations = await Promise.all(
        sizeProducts.slice(0, context.limit || 6).map(async (productId) => {
          const product = await this.fetchProduct(productId);
          if (!product) return null;

          const trendData = trending.products.find((p) => p.productId === productId);

          return {
            product,
            score: trendData?.score || 0,
            reason: `Trending in size ${context.size}`,
            type: "trending_in_size" as RecommendationType,
            metadata: {
              trendingScore: trendData?.score || 0,
            },
          };
        })
      );

      const resolvedRecommendations = await recommendations;
      return resolvedRecommendations.filter(r => r !== null) as Recommendation[];
    } catch (error) {

      return [];
    }
  }

  private async getSimilarProducts(
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    if (!context.productId) return [];

    try {
      const currentProduct = await this.fetchProduct(context.productId);
      if (!currentProduct) return [];

      // Fetch products from same category
      const products = await this.fetchProductsByCategory(currentProduct.category);

      const recommendations = products
        .filter((p) => p.id !== currentProduct.id)
        .map((product) => ({
          product,
          score: this.calculateSimilarity(currentProduct, product),
          reason: `Similar to ${currentProduct.name}`,
          type: "similar_products" as RecommendationType,
          metadata: {
            similarityScore: this.calculateSimilarity(currentProduct, product),
          },
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, context.limit || 6);

      return recommendations;
    } catch (error) {

      return [];
    }
  }

  private async getPersonalized(
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    if (!context.customerId) return [];

    try {
      // Combine multiple recommendation strategies
      const [styleRecs, purchaseRecs, trendingRecs] = await Promise.all([
        this.getBasedOnStyle(context),
        this.getCustomersAlsoBought({
          ...context,
          productId: context.purchaseHistory?.[0],
        }),
        this.getTrendingInSize({
          ...context,
          size: context.size || "42R", // Default size
        }),
      ]);

      // Merge and deduplicate
      const allRecs = [...styleRecs, ...purchaseRecs, ...trendingRecs];
      const uniqueRecs = this.deduplicateRecommendations(allRecs);

      // Re-score based on multiple factors
      const personalized = uniqueRecs
        .map((rec) => ({
          ...rec,
          score: this.calculatePersonalizedScore(rec, context),
          reason: "Recommended for you",
          type: "personalized" as RecommendationType,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, context.limit || 12);

      return personalized;
    } catch (error) {

      return [];
    }
  }

  // Helper methods
  private calculateStyleCompatibility(product1: Product, product2: Product): number {
    // Simple compatibility scoring
    const categoryScores: Record<string, Record<string, number>> = {
      suits: { shirts: 0.9, accessories: 0.8, shoes: 0.7 },
      shirts: { suits: 0.9, accessories: 0.7 },
      accessories: { suits: 0.8, shirts: 0.7 },
      shoes: { suits: 0.7, accessories: 0.6 },
    };

    return categoryScores[product1.category]?.[product2.category] || 0.5;
  }

  private calculateStyleMatch(product: Product, preferences: any): number {
    let score = 0;

    // Match by occasions (if we had occasion data on products)
    if (preferences.occasions?.includes("business") && product.category === "suits") {
      score += 0.3;
    }

    // Match by price range preference
    if (preferences.preferredPriceRange) {
      const [min, max] = preferences.preferredPriceRange;
      if (product.price >= min && product.price <= max) {
        score += 0.2;
      }
    }

    // Base score for category match
    if (preferences.preferredCategories?.includes(product.category)) {
      score += 0.5;
    }

    return Math.min(score, 1);
  }

  private calculateSimilarity(product1: Product, product2: Product): number {
    let score = 0;

    // Same category
    if (product1.category === product2.category) {
      score += 0.5;
    }

    // Similar price range (within 20%)
    const priceDiff = Math.abs(product1.price - product2.price) / product1.price;
    if (priceDiff < 0.2) {
      score += 0.3;
    }

    // Similar sizes available
    const sizes1 = new Set(product1.variants.map((v) => v.size));
    const sizes2 = new Set(product2.variants.map((v) => v.size));
    const commonSizes = [...sizes1].filter((s) => sizes2.has(s));
    score += (commonSizes.length / sizes1.size) * 0.2;

    return score;
  }

  private calculatePersonalizedScore(
    recommendation: Recommendation,
    context: RecommendationContext
  ): number {
    let score = recommendation.score;

    // Boost if in preferred categories
    if (context.stylePreferences?.occasions?.includes("wedding") && 
        recommendation.product.category === "suits") {
      score *= 1.2;
    }

    // Boost if matches size preference
    if (context.size && 
        recommendation.product.variants.some((v) => v.size === context.size && v.stock > 0)) {
      score *= 1.1;
    }

    return Math.min(score, 1);
  }

  private getStyleReason(preferences: any): string {
    if (preferences.stylePersona) {
      const personas: Record<string, string> = {
        classic: "Matches your classic style",
        modern: "Fits your modern aesthetic",
        fashion: "Trending for fashion-forward looks",
        minimalist: "Clean and minimalist design",
      };
      return personas[preferences.stylePersona] || "Based on your style preferences";
    }
    return "Based on your style preferences";
  }

  private deduplicateRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const seen = new Set<string>();
    return recommendations.filter((rec) => {
      if (seen.has(rec.product.id)) {
        return false;
      }
      seen.add(rec.product.id);
      return true;
    });
  }

  private async fetchProduct(productId: string): Promise<Product | null> {
    return retry(
      async () => {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error(`Failed to fetch product ${productId}`);
        return await response.json();
      },
      { maxAttempts: 2, initialDelay: 500 }
    ).catch(() => null);
  }

  private async fetchProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`/api/products?category=${category}`);
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  }

  private async fetchAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  }

  private async getStyleProfile(customerId: string): Promise<any> {
    // In production, fetch from API
    return {
      preferredCategories: ["suits", "shirts"],
      preferredSizes: ["42R"],
      preferredPriceRange: [50000, 150000],
    };
  }

  private async getTrendingData(): Promise<TrendingData> {
    if (this.trendingCache && Date.now() < this.trendingCacheExpiry) {
      return this.trendingCache;
    }

    try {
      const response = await fetch("/api/recommendations/trending");
      if (!response.ok) {
        return this.getMockTrendingData();
      }

      this.trendingCache = await response.json();
      this.trendingCacheExpiry = Date.now() + 60 * 60 * 1000; // Cache for 1 hour

      return this.trendingCache!;
    } catch {
      return this.getMockTrendingData();
    }
  }

  // Mock data fallbacks
  private getMockCustomersAlsoBought(context: RecommendationContext): Recommendation[] {
    return [
      {
        product: {
          id: "2",
          sku: "WHT-SHRT-001",
          name: "Crisp White Dress Shirt",
          price: 12900,
          images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80"],
          category: "shirts",
          stock: { "M": 10, "L": 15, "XL": 8 },
          variants: [
            { size: "M", stock: 10 },
            { size: "L", stock: 15 },
            { size: "XL", stock: 8 },
          ],
        },
        score: 0.9,
        reason: "87% of customers also bought this",
        type: "customers_also_bought",
        metadata: { purchasedTogether: 87 },
      },
    ];
  }

  private getMockTrendingData(): TrendingData {
    return {
      period: "weekly",
      products: [
        {
          productId: "1",
          views: 245,
          purchases: 23,
          cartAdds: 45,
          score: 0.85,
        },
      ],
      byCategory: {
        suits: ["1", "3"],
        shirts: ["5", "6"],
      },
      bySize: {
        "42R": ["1", "3"],
        "L": ["5", "6"],
      },
    };
  }
}

export const recommendationService = new RecommendationService();