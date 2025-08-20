"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useProductSearch } from "@/lib/hooks/useProducts";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";
import { debounce } from "@/lib/utils/performance/debounce";

interface SearchBarProps {
  variant?: "header" | "page";
  onClose?: () => void;
}

export function SearchBar({ variant = "header", onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { products, isLoading, search } = useProductSearch();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string) => {
      if (searchQuery.trim()) {
        search(searchQuery);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 300),
    [search]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleProductClick = (productId: string) => {
    setQuery("");
    setShowResults(false);
    onClose?.();
    router.push(`/products/${productId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(false);
      onClose?.();
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search suits, shirts, accessories..."
            className={`
              w-full pl-10 pr-10
              ${variant === "header" 
                ? "py-2 text-sm bg-gray-100 rounded-full" 
                : "py-3 text-base bg-white border border-gray-300 rounded-lg"
              }
              focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
            `}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold mx-auto"></div>
            </div>
          ) : products.length > 0 ? (
            <div>
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm text-gray-600">
                  {products.length} results for "{query}"
                </p>
              </div>
              {products.slice(0, 5).map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full p-3 hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-0"
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                  </div>
                </button>
              ))}
              {products.length > 5 && (
                <button
                  onClick={handleSubmit}
                  className="w-full p-3 text-center text-sm font-medium text-gold hover:bg-gray-50"
                >
                  View all {products.length} results
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-600">
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}