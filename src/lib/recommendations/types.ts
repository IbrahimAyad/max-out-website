import { Product } from "@/lib/types";

export interface RecommendationEngine {
  getRecommendations(
    type: RecommendationType,
    context: RecommendationContext
  ): Promise<Recommendation[]>;
}

export type RecommendationType =
  | "customers_also_bought"
  | "complete_the_look"
  | "based_on_style"
  | "trending_in_size"
  | "similar_products"
  | "personalized";

export interface RecommendationContext {
  productId?: string;
  customerId?: string;
  category?: string;
  size?: string;
  stylePreferences?: {
    colors: string[];
    fit: string;
    occasions: string[];
    stylePersona?: string;
  };
  purchaseHistory?: string[];
  viewHistory?: string[];
  cartItems?: string[];
  limit?: number;
}

export interface Recommendation {
  product: Product;
  score: number;
  reason: string;
  type: RecommendationType;
  metadata?: {
    purchasedTogether?: number;
    similarityScore?: number;
    trendingScore?: number;
    personalizedScore?: number;
  };
}

export interface ProductAffinity {
  productId: string;
  relatedProducts: Array<{
    productId: string;
    score: number;
    cooccurrence: number;
  }>;
}

export interface StyleProfile {
  customerId: string;
  preferredCategories: string[];
  preferredSizes: string[];
  preferredColors: string[];
  preferredPriceRange: [number, number];
  stylePersona?: string;
  purchasePatterns: {
    averageOrderValue: number;
    frequentlyBoughtTogether: string[][];
    seasonalPreferences: Record<string, string[]>;
  };
}

export interface TrendingData {
  period: "daily" | "weekly" | "monthly";
  products: Array<{
    productId: string;
    views: number;
    purchases: number;
    cartAdds: number;
    score: number;
  }>;
  byCategory: Record<string, string[]>;
  bySize: Record<string, string[]>;
}