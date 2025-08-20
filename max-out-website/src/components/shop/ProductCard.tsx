"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { useProduct } from "@/lib/hooks/useProducts";
import { cn } from "@/lib/utils/cn";
import { WishlistButton } from "@/components/products/WishlistButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product: initialProduct }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showQuickShop, setShowQuickShop] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  // Get real-time product data with inventory updates
  const { product } = useProduct(initialProduct.id);
  const { addToCart } = useCart();

  // Use real-time product data if available, fallback to initial
  const currentProduct = product || initialProduct;

  const availableSizes = (currentProduct.variants || [])
    .filter((variant) => variant.stock > 0)
    .map((variant) => variant.size);

  const isInStock = availableSizes.length > 0;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    try {
      addToCart(currentProduct, selectedSize);
      setAddSuccess(true);
      setError("");
      setTimeout(() => {
        setAddSuccess(false);
        setShowQuickShop(false);
        setSelectedSize("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    }
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0"
      onMouseEnter={() => setShowQuickShop(true)}
      onMouseLeave={() => {
        if (!selectedSize) setShowQuickShop(false);
      }}
    >
      <Link href={`/products/${currentProduct.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {currentProduct.images[0] ? (
            <Image
              src={currentProduct.images[0]}
              alt={currentProduct.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingBag className="h-16 w-16" />
            </div>
          )}
          {!isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
          
          {/* Real-time stock indicator */}
          {isInStock && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-sm text-xs text-white font-medium">
              {availableSizes.length} sizes available
            </div>
          )}
          
          {/* Wishlist Button */}
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <WishlistButton productId={currentProduct.id} variant="icon" className="bg-white/90 backdrop-blur-sm" />
          </div>
          
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Button 
              variant="outline" 
              className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-sm border-white hover:bg-white hover:text-black"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Quick View
            </Button>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/products/${currentProduct.id}`}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-gold transition-colors duration-300">
            {currentProduct.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3">SKU: {currentProduct.sku}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-black">{formatPrice(currentProduct.price)}</span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs text-gold font-semibold uppercase tracking-wider">Premium</span>
          </div>
        </div>

        {/* Quick Shop Section */}
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          showQuickShop && isInStock ? "max-h-40" : "max-h-0"
        )}>
          {/* Size Selection */}
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2 font-medium uppercase tracking-wider">Select Size:</p>
            <div className="grid grid-cols-4 gap-1">
              {(currentProduct.variants || []).map((variant) => (
                <button
                  key={variant.size}
                  className={cn(
                    "text-xs py-1.5 px-2 rounded-sm border transition-all duration-200 font-medium",
                    variant.stock === 0 && "opacity-50 cursor-not-allowed line-through",
                    selectedSize === variant.size
                      ? "border-gold bg-gold text-black shadow-md transform scale-105"
                      : "border-gray-300 hover:border-gold hover:bg-gold/10"
                  )}
                  onClick={() => variant.stock > 0 && setSelectedSize(variant.size)}
                  disabled={variant.stock === 0}
                >
                  {variant.size}
                  {variant.stock <= 3 && variant.stock > 0 && (
                    <span className="block text-[10px] text-red-500">
                      {variant.stock} left
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
        </div>

        <Button 
          className={cn(
            "w-full transition-all duration-300",
            addSuccess 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-black hover:bg-gray-900 text-white shadow-md hover:shadow-lg transform hover:scale-105"
          )}
          onClick={isInStock ? handleAddToCart : undefined}
          disabled={!isInStock || (showQuickShop && !selectedSize)}
        >
          {addSuccess ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Added to Cart
            </>
          ) : isInStock ? (
            showQuickShop ? "Add to Cart" : "Quick Shop"
          ) : (
            "Notify Me"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}