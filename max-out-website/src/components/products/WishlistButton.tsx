'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { cn } from '@/lib/utils/cn';

interface WishlistButtonProps {
  productId: string;
  variant?: 'default' | 'icon';
  className?: string;
}

export function WishlistButton({ productId, variant = 'default', className }: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          "hover:bg-gray-100 hover:scale-110",
          isWishlisted && "text-red-500",
          className
        )}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart 
          className={cn(
            "h-5 w-5 transition-all duration-300",
            isWishlisted && "fill-current"
          )} 
        />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-2 transition-all duration-300",
        isWishlisted && "border-red-500 text-red-500 hover:bg-red-50",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-all duration-300",
          isWishlisted && "fill-current"
        )} 
      />
      {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
    </Button>
  );
}