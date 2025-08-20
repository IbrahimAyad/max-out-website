"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters, FilterState } from "@/components/search/SearchFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/lib/hooks/useProducts";
import { Product } from "@/lib/types";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("search") || "";
  const { products, isLoading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const applyFilters = (products: Product[], filters: FilterState) => {
    let filtered = [...products];

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) => filters.categories.includes(p.category));
    }

    // Filter by sizes
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.variants.some((v) => filters.sizes.includes(v.size) && v.stock > 0)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] * 100 && p.price <= filters.priceRange[1] * 100
    );

    // Sort products
    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // In a real app, sort by creation date
        filtered.reverse();
        break;
      default:
        // Featured - keep default order
        break;
    }

    return filtered;
  };

  const handleFilterChange = (filters: FilterState) => {
    const filtered = applyFilters(products, filters);
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {query ? `Search results for "${query}"` : "All Products"}
          </h1>
          <div className="max-w-2xl">
            <SearchBar variant="page" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              onFilterChange={handleFilterChange}
              productCount={filteredProducts.length}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Products</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}