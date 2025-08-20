'use client';

import React, { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface EnhancedBuyButtonProps {
  productId: string;
  productName: string;
  price: number; // Price in cents
  size?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  showPrice?: boolean;
}

export function EnhancedBuyButton({
  productId,
  productName,
  price,
  size,
  className = '',
  variant = 'primary',
  showPrice = true
}: EnhancedBuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Create checkout session using temporary price_data approach
      const response = await fetch('/api/checkout/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          size: size || 'M', // Default to Medium if not specified
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const getButtonStyles = () => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg px-6 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'secondary':
        return `${base} bg-gray-100 text-gray-900 hover:bg-gray-200`;
      case 'outline':
        return `${base} border-2 border-black text-black hover:bg-black hover:text-white`;
      default:
        return `${base} bg-black text-white hover:bg-gray-800`;
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`${getButtonStyles()} ${className}`}
      aria-label={`Buy ${productName} now`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>
            Buy Now {showPrice && `- ${formatPrice(price)}`}
          </span>
        </>
      )}
    </button>
  );
}

// Quick Add to Cart Button (for future cart implementation)
export function EnhancedAddToCartButton({
  productId,
  productName,
  price,
  size,
  className = '',
  variant = 'secondary'
}: EnhancedBuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      
      // For now, just show a message
      // TODO: Implement actual cart functionality
      toast.success(`${productName} added to cart!`);
      
      // Store in localStorage for now
      const cartItems = JSON.parse(localStorage.getItem('enhanced_cart') || '[]');
      cartItems.push({
        productId,
        productName,
        price,
        size: size || 'M',
        quantity: 1,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('enhanced_cart', JSON.stringify(cartItems));
      
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const getButtonStyles = () => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'primary':
        return `${base} bg-black text-white hover:bg-gray-800`;
      case 'outline':
        return `${base} border border-gray-300 text-gray-700 hover:bg-gray-50`;
      default:
        return `${base} bg-gray-100 text-gray-900 hover:bg-gray-200`;
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`${getButtonStyles()} ${className}`}
      aria-label={`Add ${productName} to cart`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          <span className="text-sm">Add to Cart</span>
        </>
      )}
    </button>
  );
}