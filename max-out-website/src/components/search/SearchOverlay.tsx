"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, ArrowRight, Clock, TrendingUp, Command } from "lucide-react";
import { useProductSearch } from "@/lib/hooks/useProducts";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";
import { debounce } from "@/lib/utils/performance/debounce";
import { cn } from "@/lib/utils/cn";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'kct_recent_searches';
const MAX_RECENT_SEARCHES = 5;

const TRENDING_SEARCHES = [
  "Wedding suits",
  "Black tuxedo", 
  "Prom blazers",
  "Navy dress shirt",
  "Gold tie",
  "Three-piece suit"
];

const QUICK_CATEGORIES = [
  {
    name: "Suits",
    href: "/products/suits",
    image: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public",
    count: "120+ items"
  },
  {
    name: "Wedding",
    href: "/weddings",
    image: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/aa23aaf9-ea00-430e-4436-15b8ad71db00/public",
    count: "50+ items"
  },
  {
    name: "Prom",
    href: "/prom-collection",
    image: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/e5f26504-4bf5-434a-e115-fab5edaa0b00/public",
    count: "75+ items"
  },
  {
    name: "Dress Shirts",
    href: "/collections/dress-shirts",
    image: "/placeholder-shirt.jpg",
    count: "90+ items"
  }
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { products, isLoading, search } = useProductSearch();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse recent searches:', e);
        }
      }
    }
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string) => {
      if (searchQuery.trim()) {
        search(searchQuery);
      }
    }, 300),
    [search]
  );

  useEffect(() => {
    debouncedSearch(query);
    setActiveIndex(-1);
  }, [query, debouncedSearch]);

  // Save search to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const newRecentSearches = [
      searchQuery.trim(),
      ...recentSearches.filter(s => s !== searchQuery.trim())
    ].slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(newRecentSearches);
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecentSearches));
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const totalItems = products.length;
      
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => (prev < totalItems - 1 ? prev + 1 : -1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev > -1 ? prev - 1 : totalItems - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < products.length) {
            handleProductClick(products[activeIndex].id);
          } else if (query.trim()) {
            handleSearchSubmit();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, products, query]);

  const handleProductClick = (productId: string) => {
    if (query.trim()) {
      saveRecentSearch(query);
    }
    onClose();
    router.push(`/products/${productId}`);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      saveRecentSearch(query);
      onClose();
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    saveRecentSearch(searchTerm);
    onClose();
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleCategoryClick = (href: string) => {
    onClose();
    router.push(href);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  };

  if (!isOpen) return null;

  const showResults = query.trim() && (products.length > 0 || !isLoading);
  const showEmptyState = query.trim() && products.length === 0 && !isLoading;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Search Overlay */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  placeholder="Search suits, shirts, accessories..."
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent shadow-lg"
                  style={{ 
                    focusRingColor: 'var(--focus-ring)',
                  }}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <div className="hidden sm:flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md">
                    <Command className="h-3 w-3" />
                    <span>K</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white/95 backdrop-blur-md overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            
            {/* Loading State */}
            {isLoading && query.trim() && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-burgundy"></div>
              </div>
            )}

            {/* Search Results */}
            {showResults && (
              <div ref={resultsRef}>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Products ({products.length})
                  </h3>
                  <div className="grid gap-3">
                    {products.slice(0, 8).map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className={cn(
                          "w-full p-4 rounded-xl flex items-center space-x-4 text-left transition-all duration-200 group",
                          activeIndex === index 
                            ? "bg-gradient-to-r from-burgundy/10 to-gold/10 shadow-md" 
                            : "hover:bg-gray-50"
                        )}
                      >
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={product.images[0] || "/placeholder.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 group-hover:text-burgundy transition-colors">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <ArrowRight 
                          className={cn(
                            "h-5 w-5 text-gray-400 group-hover:text-burgundy transition-all",
                            activeIndex === index && "translate-x-1"
                          )} 
                        />
                      </button>
                    ))}
                    {products.length > 8 && (
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full p-4 text-center font-medium text-burgundy hover:bg-burgundy/5 rounded-xl transition-colors"
                      >
                        View all {products.length} results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {showEmptyState && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try searching for something else or browse our collections
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {QUICK_CATEGORIES.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.href)}
                      className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-burgundy/30 hover:shadow-md transition-all"
                    >
                      <div className="aspect-square mb-3 rounded-lg overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="font-medium text-gray-900 group-hover:text-burgundy">
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {category.count}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Default State - No Query */}
            {!query.trim() && (
              <div className="space-y-8">
                {/* Quick Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Browse
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {QUICK_CATEGORIES.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryClick(category.href)}
                        className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-burgundy/30 hover:shadow-md transition-all"
                      >
                        <div className="aspect-square mb-3 rounded-lg overflow-hidden">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="font-medium text-gray-900 group-hover:text-burgundy transition-colors">
                          {category.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {category.count}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickSearch(search)}
                          className="px-4 py-2 text-sm bg-gray-100 hover:bg-burgundy/10 hover:text-burgundy rounded-full transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Trending Now
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="px-4 py-2 text-sm bg-white border border-gray-200 hover:border-burgundy hover:text-burgundy rounded-full transition-all hover:shadow-sm"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}