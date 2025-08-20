"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useProductSearch } from "@/lib/hooks/useProducts";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import Image from "next/image";

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { products, isLoading, search } = useProductSearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 2) {
        search(query);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, search]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
      >
        <Search className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div className="absolute top-0 right-0 w-72 md:w-96 bg-white shadow-lg rounded-sm border z-50">
            <div className="flex items-center p-3 border-b">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 outline-none text-sm"
                autoFocus
              />
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-gold mr-2" />
              )}
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {query.length >= 2 && (
              <div className="max-h-96 overflow-y-auto">
                {!products || products.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    {isLoading ? "Searching..." : "No products found"}
                  </div>
                ) : (
                  <div className="py-2">
                    {(products || []).slice(0, 5).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={handleClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative w-12 h-16 bg-gray-100 rounded-sm overflow-hidden">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{product.name}</h4>
                          <p className="text-xs text-gray-500">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    ))}
                    {products.length > 5 && (
                      <Link
                        href={`/products?search=${encodeURIComponent(query)}`}
                        onClick={handleClose}
                        className="block px-4 py-3 text-sm text-center text-gold hover:bg-gray-50"
                      >
                        View all {products.length} results
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}