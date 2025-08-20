'use client';

import { useState, useEffect } from 'react';

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  subcategory: string;
  stripePriceId: string;
  price: number;
  prices?: Array<{
    id: string;
    nickname: string;
    amount: number;
  }>;
  availableColors: string[];
  availableSizes: string[];
  metadata: Record<string, any>;
}

export function useStripeProducts(category?: string) {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      // Filter by category if provided
      const filteredProducts = category
        ? data.products.filter((p: StripeProduct) => p.category === category)
        : data.products;

      setProducts(filteredProducts);
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
}