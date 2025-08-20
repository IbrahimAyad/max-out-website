import { useEffect } from "react";
import { useProductStore } from "@/lib/store/productStore";
import { Product } from "@/lib/types";

export function useProducts() {
  const {
    products,
    featuredProducts,
    isLoading,
    error,
    fetchProducts,
    subscribeToInventory,
    unsubscribeFromInventory,
  } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  return {
    products,
    featuredProducts,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}

export function useProduct(id: string) {
  const { products, isLoading, error, fetchProducts, subscribeToInventory, unsubscribeFromInventory } = useProductStore();
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (!product && !isLoading && products.length === 0) {
      fetchProducts();
    }
  }, [product, isLoading, products.length]);

  useEffect(() => {
    if (product) {
      subscribeToInventory(product.sku);
      return () => unsubscribeFromInventory(product.sku);
    }
  }, [product?.sku]);

  return {
    product,
    isLoading,
    error,
  };
}

export function useProductsByCategory(category: string) {
  const {
    products,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    fetchProductsByCategory,
  } = useProductStore();

  useEffect(() => {
    if (category !== selectedCategory) {
      setSelectedCategory(category as any);
    }
  }, [category]);

  return {
    products,
    isLoading,
    error,
  };
}

export function useProductSearch() {
  const {
    products,
    searchQuery,
    isLoading,
    error,
    searchProducts,
    setSearchQuery,
  } = useProductStore();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchProducts(query);
  };

  return {
    products,
    searchQuery,
    isLoading,
    error,
    search: handleSearch,
  };
}