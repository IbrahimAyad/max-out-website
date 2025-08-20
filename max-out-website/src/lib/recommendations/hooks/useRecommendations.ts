"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCart } from "@/lib/hooks/useCart";
import { recommendationService } from "../recommendationService";
import {
  RecommendationType,
  RecommendationContext,
  Recommendation,
} from "../types";

interface UseRecommendationsOptions {
  type: RecommendationType;
  productId?: string;
  category?: string;
  size?: string;
  limit?: number;
  enabled?: boolean;
}

export function useRecommendations(options: UseRecommendationsOptions) {
  const { customer } = useAuth();
  const { items } = useCart();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!options.enabled) return;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const context: RecommendationContext = {
          productId: options.productId,
          customerId: customer?.id,
          category: options.category,
          size: options.size || customer?.measurements ? "42R" : undefined, // Use customer's typical size
          stylePreferences: customer?.stylePreferences,
          cartItems: items.map((item) => item.productId),
          limit: options.limit,
        };

        const recs = await recommendationService.getRecommendations(
          options.type,
          context
        );
        
        setRecommendations(recs);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch recommendations"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [
    options.type,
    options.productId,
    options.category,
    options.size,
    options.limit,
    options.enabled,
    customer?.id,
  ]);

  return { recommendations, isLoading, error };
}

export function useProductRecommendations(productId?: string) {
  const customersAlsoBought = useRecommendations({
    type: "customers_also_bought",
    productId,
    limit: 4,
    enabled: !!productId,
  });

  const completeTheLook = useRecommendations({
    type: "complete_the_look",
    productId,
    limit: 6,
    enabled: !!productId,
  });

  const similarProducts = useRecommendations({
    type: "similar_products",
    productId,
    limit: 6,
    enabled: !!productId,
  });

  return {
    customersAlsoBought,
    completeTheLook,
    similarProducts,
  };
}

export function usePersonalizedRecommendations() {
  const { customer } = useAuth();
  
  return useRecommendations({
    type: "personalized",
    limit: 12,
    enabled: !!customer,
  });
}

export function useTrendingRecommendations(size?: string) {
  return useRecommendations({
    type: "trending_in_size",
    size,
    limit: 8,
    enabled: !!size,
  });
}

export function useStyleBasedRecommendations() {
  const { customer } = useAuth();
  
  return useRecommendations({
    type: "based_on_style",
    limit: 8,
    enabled: !!customer?.stylePreferences,
  });
}