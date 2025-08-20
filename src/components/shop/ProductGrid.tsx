"use client";

import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductCardSkeleton";
import { cn } from "@/lib/utils/cn";

interface ProductGridProps {
  products: Product[];
  className?: string;
  isLoading?: boolean;
}

export function ProductGrid({ products, className, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={className}>
        <ProductGridSkeleton count={12} />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}
    >
      {(products || []).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}