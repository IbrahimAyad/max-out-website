"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  sale_price?: number;
  images: string[];
  slug: string;
  is_featured?: boolean;
  is_trending?: boolean;
}

export function TrendingNow() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [products, setProducts] = useState<Record<string, Product[]>>({
    all: [],
    suits: [],
    tuxedos: [],
    'double-breasted': [],
    shirts: [],
    stretch: []
  });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch different categories matching actual Supabase data
        // Using exact category names from products_enhanced table
        const categories = [
          { key: 'all', params: 'trending=true&limit=12' }, // All trending products
          { key: 'suits', params: 'category=Suits&limit=8' },
          { key: 'tuxedos', params: 'category=Tuxedos&limit=8' },
          { key: 'double-breasted', params: 'category=Double-Breasted Suits&limit=8' },
          { key: 'shirts', params: 'category=Mens Shirts&limit=8' },
          { key: 'stretch', params: 'category=Stretch Suits&limit=8' }
        ];

        const productsByCategory: Record<string, Product[]> = {
          all: [],
          suits: [],
          tuxedos: [],
          'double-breasted': [],
          shirts: [],
          stretch: []
        };

        // Fetch all categories in parallel
        const promises = categories.map(async ({ key, params }) => {
          const response = await fetch(`/api/products/unified?${params}`);
          if (response.ok) {
            const data = await response.json();
            return { key, products: data.products || [] };
          }
          return { key, products: [] };
        });

        const results = await Promise.all(promises);
        
        // Organize results by category
        results.forEach(({ key, products }) => {
          productsByCategory[key] = products.slice(0, 8); // Limit to 8 products per category
        });

        setProducts(productsByCategory);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    const currentProducts = products[activeTab];
    const maxIndex = Math.max(0, currentProducts.length - 3);
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const calculateDiscount = (price: number, salePrice?: number) => {
    if (!salePrice || salePrice >= price) return null;
    const discount = Math.round(((price - salePrice) / price) * 100);
    return `-${discount}%`;
  };

  const getProductUrl = (product: Product) => {
    // If product has a slug, use it
    if (product.slug) {
      return `/products/${product.slug}`;
    }
    // Otherwise construct from category and ID
    return `/products/${product.category}/${product.id}`;
  };

  const tabLabels: Record<string, string> = {
    all: "TRENDING",
    suits: "SUITS",
    tuxedos: "TUXEDOS",
    'double-breasted': "DOUBLE BREASTED",
    shirts: "SHIRTS",
    stretch: "STRETCH SUITS"
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-6">TRENDING NOW</h2>
          </div>
          <div className="flex justify-center items-center h-96">
            <div className="animate-pulse text-gray-400">Loading products...</div>
          </div>
        </div>
      </section>
    );
  }

  const currentProducts = products[activeTab];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-6">TRENDING NOW</h2>
          
          {/* Tab Navigation */}
          <div className="flex justify-center gap-12">
            {Object.keys(tabLabels).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentIndex(0);
                }}
                className={`text-sm font-semibold tracking-wider transition-all pb-2 ${
                  activeTab === tab 
                    ? "text-black border-b-2 border-black" 
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          {currentIndex < Math.max(0, currentProducts.length - 3) && (
            <button
              onClick={handleNext}
              className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Products Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={getProductUrl(product)}
                    className="min-w-[33.333%] px-4 group"
                  >
                    <div className="relative">
                      {/* Discount Badge */}
                      {product.sale_price && (
                        <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-sm font-bold px-3 py-1.5">
                          {calculateDiscount(product.price, product.sale_price)}
                        </span>
                      )}
                      
                      {/* Featured/Trending Badge */}
                      {(product.is_featured || product.is_trending) && !product.sale_price && (
                        <span className="absolute top-4 left-4 z-10 bg-black text-white text-sm font-bold px-3 py-1.5">
                          {product.is_trending ? "TRENDING" : "FEATURED"}
                        </span>
                      )}

                      {/* Product Image */}
                      <div className="aspect-[4/5] bg-gray-100 mb-6 overflow-hidden rounded-lg" style={{ minHeight: '600px' }}>
                        <img
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Brand */}
                      <p className="text-burgundy font-bold text-sm mb-2">KCT MENSWEAR</p>

                      {/* Product Name */}
                      <h3 className="text-sm font-medium mb-4 line-clamp-2 min-h-[3rem] uppercase tracking-wide">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        {product.sale_price ? (
                          <>
                            <span className="text-gray-400 line-through text-base">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-red-600 text-lg font-bold">
                              ${product.sale_price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-black text-lg font-bold">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="w-full text-center py-20 text-gray-500">
                  No products available in this category
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}