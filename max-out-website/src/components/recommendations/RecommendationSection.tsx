"use client";

import { Recommendation } from "@/lib/recommendations/types";
import { ProductCard } from "@/components/products/ProductCard";
import { LoadingState, ProductGridSkeleton } from "@/components/ui/states/LoadingState";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface RecommendationSectionProps {
  title: string;
  recommendations: Recommendation[];
  isLoading: boolean;
  error?: Error | null;
  showReason?: boolean;
  columns?: 3 | 4 | 6;
}

export function RecommendationSection({
  title,
  recommendations,
  isLoading,
  error,
  showReason = false,
  columns = 4,
}: RecommendationSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = columns;
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);

  if (error) {
    return null; // Silently fail for recommendations
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <ProductGridSkeleton count={columns} />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const startIndex = currentPage * itemsPerPage;
  const visibleRecommendations = recommendations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            <span className="text-sm text-gray-600">
              {currentPage + 1} / {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-6`}>
        {visibleRecommendations.map((rec, index) => (
          <div key={rec.product.id} className="relative">
            <ProductCard product={rec.product} />
            
            {showReason && (
              <div className="mt-2 text-sm text-gray-600 text-center">
                {rec.reason}
              </div>
            )}
            
            {rec.metadata?.purchasedTogether && (
              <div className="absolute top-2 right-2 bg-gold text-black text-xs font-medium px-2 py-1 rounded">
                {rec.metadata.purchasedTogether}% bought together
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}