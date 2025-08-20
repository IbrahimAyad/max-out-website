"use client";

import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { ShoppingBag, Sparkles, TrendingUp, Heart, Award, Zap } from "lucide-react";
import { trackProductClick } from "@/lib/analytics/google-analytics";
import { WishlistButton } from "@/components/products/WishlistButton";

interface AIProductCardProps {
  product: Product & {
    ai_score?: number;
    trending_score?: number;
    style_match?: number;
    pairs_well_with?: string[];
    is_ai_pick?: boolean;
    is_trending?: boolean;
    is_featured?: boolean;
    recommendation_reason?: string;
  };
  listName?: string;
  index?: number;
  userStyle?: string; // User's style preference
}

export function AIProductCard({ product, listName = 'product_list', index = 0, userStyle }: AIProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // Fetch AI recommendations for this product
  useEffect(() => {
    const fetchAIRecommendations = async () => {
      if (!product.id) return;
      
      setLoadingAI(true);
      try {
        const response = await fetch(`/api/recommendations?type=complete_the_look&productId=${product.id}&limit=3`);
        if (response.ok) {
          const data = await response.json();
          setAiRecommendations(data.recommendations || []);
        }
      } catch (error) {
        console.error('Error fetching AI recommendations:', error);
      } finally {
        setLoadingAI(false);
      }
    };

    // Only fetch if product has high AI score or is featured
    if (product.ai_score && product.ai_score > 0.7 || product.is_featured) {
      fetchAIRecommendations();
    }
  }, [product.id, product.ai_score, product.is_featured]);

  const handleQuickAdd = async () => {
    if (!selectedSize) return;

    try {
      await addToCart(product, selectedSize);
      setSelectedSize("");
      setShowQuickAdd(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const availableSizes = product.variants?.filter(v => v.stock > 0) || [];

  // Calculate AI badge to show - more subtle approach
  const getAIBadge = () => {
    // Only show one badge, prioritize Atelier AI picks
    if (product.is_ai_pick || (product.ai_score && product.ai_score > 0.8)) {
      return { 
        icon: <Sparkles className="w-3 h-3" />, 
        text: "Atelier Pick", 
        color: "bg-burgundy/90 backdrop-blur-sm" 
      };
    }
    if (product.trending_score && product.trending_score > 0.85) {
      return { 
        icon: <TrendingUp className="w-3 h-3" />, 
        text: "Trending", 
        color: "bg-gray-900/80 backdrop-blur-sm" 
      };
    }
    // Don't show too many badges - keep it clean
    return null;
  };

  const aiBadge = getAIBadge();
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <article 
      className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setShowQuickAdd(true)}
      onMouseLeave={() => setShowQuickAdd(false)}
      aria-label={`${product.name} - ${formatPrice(product.price)}`}
    >
      {/* Subtle AI Badge - only show when relevant */}
      {aiBadge && (
        <div className="absolute top-3 left-3 z-20">
          <div className={`${aiBadge.color} text-white text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm`}>
            {aiBadge.icon}
            <span className="tracking-wide">{aiBadge.text}</span>
          </div>
        </div>
      )}
      
      {/* Discount Badge - separate from AI */}
      {hasDiscount && (
        <div className="absolute top-3 right-12 z-20">
          <div className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-20">
        <WishlistButton product={product} />
      </div>

      <Link 
        href={`/products/${product.id}`}
        onClick={() => {
          trackProductClick(product, listName, index);
        }}
        aria-label={`View details for ${product.name}`}
      >
        {/* Product Image */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {!imageError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
          )}

          {/* AI Recommendation Overlay on Hover */}
          {product.recommendation_reason && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {product.recommendation_reason}
              </p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Subtle Atelier AI insight - only show high matches */}
          {product.style_match && product.style_match > 0.9 && userStyle && (
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3 text-burgundy" />
              <span className="text-xs text-burgundy font-medium">Atelier matched</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
              <span className={`font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Remove numeric AI score - too overwhelming */}
          </div>
        </div>
      </Link>

      {/* Quick Add Overlay */}
      {showQuickAdd && availableSizes.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 transform translate-y-0 transition-transform duration-300 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
              aria-label="Select size"
            >
              <option value="">Select Size</option>
              {availableSizes.map((variant) => (
                <option key={variant.size} value={variant.size}>
                  {variant.size}
                </option>
              ))}
            </select>
            <button
              onClick={handleQuickAdd}
              disabled={!selectedSize}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Atelier AI Suggestions - subtle integration */}
          {aiRecommendations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-burgundy font-medium mb-2">
                Atelier suggests:
              </p>
              <div className="flex gap-2">
                {aiRecommendations.slice(0, 3).map((rec, idx) => (
                  <Link
                    key={idx}
                    href={`/products/${rec.product?.id}`}
                    className="flex-1 text-center"
                  >
                    <div className="aspect-square bg-gray-100 rounded overflow-hidden mb-1">
                      <img 
                        src={rec.product?.image || '/placeholder.jpg'} 
                        alt={rec.product?.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                    <p className="text-xs truncate">{rec.product?.name}</p>
                    <p className="text-xs font-bold">{formatPrice(rec.product?.price || 0)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}