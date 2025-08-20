import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { ShoppingBag } from "lucide-react";
import { trackProductClick } from "@/lib/analytics/google-analytics";
import { WishlistButton } from "@/components/products/WishlistButton";

interface ProductCardProps {
  product: Product;
  listName?: string;
  index?: number;
}

export function ProductCard({ product, listName = 'product_list', index = 0 }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleQuickAdd = async () => {
    if (!selectedSize) return;

    try {
      await addToCart(product, selectedSize);
      setSelectedSize("");
      setShowQuickAdd(false);
    } catch (error) {

    }
  };

  const availableSizes = product.variants.filter(v => v.stock > 0);

  return (
    <article 
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow"
      onMouseEnter={() => setShowQuickAdd(true)}
      onMouseLeave={() => setShowQuickAdd(false)}
      aria-label={`${product.name} - ${formatPrice(product.price)}`}
    >
      <Link 
        href={`/products/${product.id}`}
        onClick={() => {
          trackProductClick(product, listName, index);
        }}
        aria-label={`View details for ${product.name}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
          <Image
            src={imageError ? "/placeholder.jpg" : product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          {product.stock && Object.values(product.stock).every(s => s === 0) && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center" role="status" aria-live="polite">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <WishlistButton productId={product.id} variant="icon" className="bg-white/90 backdrop-blur-sm" />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`} tabIndex={-1}>
          <h3 className="font-medium text-gray-900 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-lg font-semibold text-gray-900" aria-label={`Price: ${formatPrice(product.price)}`}>
          {formatPrice(product.price)}
        </p>

        {/* Quick Add */}
        {showQuickAdd && availableSizes.length > 0 && (
          <div className="mt-3 space-y-2" role="group" aria-label="Quick add to cart">
            <div className="flex flex-wrap gap-1" role="group" aria-label="Select size">
              {availableSizes.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`
                    px-3 py-1 text-sm border rounded
                    ${selectedSize === variant.size
                      ? "bg-gold text-black border-gold"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }
                  `}
                  aria-label={`Select size ${variant.size}`}
                  aria-pressed={selectedSize === variant.size}
                >
                  {variant.size}
                </button>
              ))}
            </div>
            <button
              onClick={handleQuickAdd}
              disabled={!selectedSize}
              className="w-full flex items-center justify-center space-x-2 bg-gold hover:bg-gold/90 disabled:bg-gray-300 text-black disabled:text-gray-500 font-medium py-2 rounded transition-colors"
              aria-label={selectedSize ? `Add ${product.name} size ${selectedSize} to cart` : "Select a size first"}
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              <span>Quick Add</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}