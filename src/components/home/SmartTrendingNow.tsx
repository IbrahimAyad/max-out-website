"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Heart } from "lucide-react";

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
  trending_score?: number;
  affinity_score?: number;
  ai_recommendation?: string;
  matching_products?: string[];
}

interface OutfitRecommendation {
  primary: Product;
  shirt?: Product;
  tie?: Product;
  accessories?: Product[];
  total_price: number;
  bundle_price?: number;
  style_match_score: number;
  occasion: string;
}

export function SmartTrendingNow() {
  const [activeTab, setActiveTab] = useState<string>("ai-picks");
  const [products, setProducts] = useState<Record<string, any>>({
    'ai-picks': [],
    'trending': [],
    'outfits': [],
    'personalized': [],
    'best-sellers': []
  });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch smart recommendations using our AI endpoints
  useEffect(() => {
    const fetchSmartProducts = async () => {
      setLoading(true);
      try {
        // Fetch from multiple AI-powered endpoints
        const [
          trendingResponse,
          recommendationsResponse,
          outfitsResponse,
          affinityResponse
        ] = await Promise.all([
          // Get actual trending products based on analytics
          fetch('/api/recommendations/trending?limit=12'),
          // Get AI recommendations
          fetch('/api/recommendations?type=featured&limit=12'),
          // Get complete outfit recommendations
          fetch('/api/ai/outfit-recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              occasion: 'business',
              style: 'modern',
              budget: 500
            })
          }),
          // Get products with high affinity scores
          fetch('/api/recommendations/affinity?productId=featured&limit=8')
        ]);

        const trending = await trendingResponse.json();
        const recommendations = await recommendationsResponse.json();
        const outfits = await outfitsResponse.json();
        const affinity = await affinityResponse.json();

        // Also fetch regular products for fallback
        const productsResponse = await fetch('/api/products/unified?limit=20');
        const regularProducts = await productsResponse.json();

        // Organize smart recommendations
        setProducts({
          'ai-picks': recommendations.products || regularProducts.products?.slice(0, 8) || [],
          'trending': trending.products || regularProducts.products?.slice(0, 8) || [],
          'outfits': outfits.recommendations || [],
          'personalized': affinity.products || regularProducts.products?.slice(8, 16) || [],
          'best-sellers': regularProducts.products?.filter((p: any) => p.is_featured) || []
        });
      } catch (error) {
        console.error('Error fetching smart products:', error);
        // Fallback to regular products
        try {
          const response = await fetch('/api/products/unified?limit=20');
          const data = await response.json();
          const allProducts = data.products || [];
          
          setProducts({
            'ai-picks': allProducts.slice(0, 5),
            'trending': allProducts.slice(5, 10),
            'outfits': [],
            'personalized': allProducts.slice(10, 15),
            'best-sellers': allProducts.slice(15, 20)
          });
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSmartProducts();
  }, []);

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    const currentProducts = products[activeTab] || [];
    const maxIndex = Math.max(0, currentProducts.length - 3);
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const calculateDiscount = (price: number, salePrice?: number) => {
    if (!salePrice || salePrice >= price) return null;
    const discount = Math.round(((price - salePrice) / price) * 100);
    return `-${discount}%`;
  };

  const getProductUrl = (product: Product) => {
    if (product.slug) {
      return `/products/${product.slug}`;
    }
    return `/products/${product.category}/${product.id}`;
  };

  const tabConfig = {
    'ai-picks': { 
      label: "AI PICKS", 
      icon: <Sparkles className="w-4 h-4" />,
      description: "Curated by our style AI"
    },
    'trending': { 
      label: "TRENDING NOW", 
      icon: <TrendingUp className="w-4 h-4" />,
      description: "What's popular this week"
    },
    'outfits': { 
      label: "COMPLETE LOOKS", 
      icon: <Heart className="w-4 h-4" />,
      description: "Perfect outfit combinations"
    },
    'personalized': { 
      label: "FOR YOU", 
      icon: <Sparkles className="w-4 h-4" />,
      description: "Based on your style"
    },
    'best-sellers': { 
      label: "BEST SELLERS", 
      icon: <TrendingUp className="w-4 h-4" />,
      description: "Customer favorites"
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-2">SMART RECOMMENDATIONS</h2>
            <p className="text-gray-600">Powered by AI Style Intelligence</p>
          </div>
          <div className="flex justify-center items-center h-96">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-burgundy animate-pulse" />
              <span className="text-gray-500">AI is curating your perfect styles...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentProducts = products[activeTab] || [];
  const isOutfitTab = activeTab === 'outfits';
  
  // Ensure currentProducts is always an array
  const safeProducts = Array.isArray(currentProducts) ? currentProducts : [];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-burgundy" />
            <h2 className="text-4xl font-bold tracking-tight">SMART RECOMMENDATIONS</h2>
            <Sparkles className="w-6 h-6 text-burgundy" />
          </div>
          <p className="text-gray-600 mb-8">Powered by AI Style Intelligence</p>
          
          {/* Smart Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {Object.entries(tabConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setCurrentIndex(0);
                }}
                className={`group relative px-6 py-3 rounded-full transition-all ${
                  activeTab === key 
                    ? "bg-black text-white shadow-lg scale-105" 
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {config.icon}
                  <span className="text-sm font-semibold tracking-wider">{config.label}</span>
                </div>
                {activeTab === key && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                    {config.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products Display */}
        <div className="relative mt-16">
          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-lg"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          {currentIndex < Math.max(0, safeProducts.length - 3) && (
            <button
              onClick={handleNext}
              className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-lg"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Products Grid */}
          <div className="overflow-hidden">
            {isOutfitTab ? (
              // Special layout for outfit recommendations
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {safeProducts.slice(currentIndex, currentIndex + 3).map((outfit: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all">
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 p-4">
                      <div className="grid grid-cols-2 gap-2 h-full">
                        {(outfit.products || []).slice(0, 4).map((p: any, i: number) => (
                          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                            <img 
                              src={p.images?.[0] || '/placeholder.jpg'} 
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-burgundy text-white px-2 py-1 rounded-full">
                          {outfit.occasion || 'COMPLETE LOOK'}
                        </span>
                        {outfit.style_match_score && (
                          <span className="text-xs text-gray-500">
                            {Math.round(outfit.style_match_score * 100)}% Match
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold mb-2">{outfit.name || 'Curated Outfit'}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-burgundy">
                          ${outfit.bundle_price || outfit.total_price || 299}
                        </span>
                        {outfit.total_price && outfit.bundle_price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${outfit.total_price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Regular product display with AI enhancements
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              >
                {safeProducts.length > 0 ? (
                  safeProducts.map((product: Product) => (
                    <Link
                      key={product.id}
                      href={getProductUrl(product)}
                      className="min-w-[33.333%] px-4 group"
                    >
                      <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                        {/* AI Badge */}
                        {product.ai_recommendation && (
                          <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-burgundy to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI PICK
                          </div>
                        )}
                        
                        {/* Trending Score */}
                        {product.trending_score && product.trending_score > 0.7 && (
                          <div className="absolute top-4 right-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            HOT
                          </div>
                        )}
                        
                        {/* Discount Badge */}
                        {product.sale_price && !product.ai_recommendation && (
                          <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded">
                            {calculateDiscount(product.price, product.sale_price)}
                          </span>
                        )}

                        {/* Product Image */}
                        <div className="aspect-[4/5] bg-gray-100 overflow-hidden" style={{ minHeight: '500px' }}>
                          <img
                            src={product.images?.[0] || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>

                        <div className="p-4">
                          {/* Brand */}
                          <p className="text-burgundy font-bold text-xs mb-1">KCT MENSWEAR</p>

                          {/* Product Name */}
                          <h3 className="text-sm font-medium mb-2 line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                          </h3>

                          {/* Smart Matching Info */}
                          {product.matching_products && product.matching_products.length > 0 && (
                            <p className="text-xs text-gray-500 mb-2">
                              Pairs well with {product.matching_products.length} items
                            </p>
                          )}

                          {/* Price */}
                          <div className="flex items-center gap-3">
                            {product.sale_price ? (
                              <>
                                <span className="text-gray-400 line-through text-sm">
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
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="w-full text-center py-20 text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>AI is learning your preferences...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}