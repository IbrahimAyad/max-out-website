'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSimpleCart } from '@/hooks/useSimpleCart';
import { stripeProducts } from '@/lib/services/stripeProductService';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutButton() {
  const { items, cartSummary, clearCart } = useSimpleCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get Stripe price ID for a product
  const getStripePriceId = (product: any) => {
    // First check if product has metadata with stripePriceId
    if (product.metadata?.stripePriceId) {
      return product.metadata.stripePriceId;
    }

    // Also check direct stripePriceId property
    if (product.stripePriceId) {
      return product.stripePriceId;
    }

    // Check if it's a suit
    const category = product.category?.toLowerCase();

    if (category === 'suits') {
      // Find the color in our stripe products mapping
      const colorKey = product.metadata?.suitColor || 
        Object.keys(stripeProducts.suits).find(key => 
          product.name.toLowerCase().includes(key.toLowerCase().replace(/([A-Z])/g, ' $1').trim())
        );

      if (colorKey) {
        const suitData = stripeProducts.suits[colorKey as keyof typeof stripeProducts.suits];
        // Check if it's 2-piece or 3-piece
        const is3Piece = product.name.includes('3 Piece') || product.metadata?.suitType === 'threePiece';
        return is3Piece ? suitData.threePiece : suitData.twoPiece;
      }
    }

    // Check if it's a dress shirt
    if (category === 'dress-shirts') {
      // Dress shirts have fixed price IDs based on fit
      if (product.name.includes('Slim Cut')) {
        return 'price_1RpvWnCHc12x7sCzzioA64qD';
      } else if (product.name.includes('Classic Fit')) {
        return 'price_1RpvXACHc12x7sCz2Ngkmp64';
      }
    }

    // Check if it's a tie
    if (category === 'ties') {
      // Ties have fixed price IDs based on style
      if (product.name.includes('Pre-tied Bow Tie') || product.name.includes('Bow Tie')) {
        return 'price_1RpvIMCHc12x7sCzj6ZTx21q';
      } else if (product.name.includes('Classic') && product.name.includes('3.25')) {
        return 'price_1RpvI9CHc12x7sCzE8Q9emhw';
      } else if (product.name.includes('Skinny') && product.name.includes('2.75')) {
        return 'price_1RpvHyCHc12x7sCzjX1WV931';
      } else if (product.name.includes('Slim') && product.name.includes('2.25')) {
        return 'price_1RpvHlCHc12x7sCzp0TVNS92';
      }
    }

    // Check if it's a tie bundle
    if (category === 'tie-bundle') {
      if (product.metadata?.bundleType === 'five') {
        return 'price_1RpvQqCHc12x7sCzfRrWStZb';
      } else if (product.metadata?.bundleType === 'eight') {
        return 'price_1RpvRACHc12x7sCzVYFZh6Ia';
      } else if (product.metadata?.bundleType === 'eleven') {
        return 'price_1RpvRSCHc12x7sCzpo0fgH6A';
      }
    }

    // For other products, you would add similar mappings
    // For now, return null if we can't find a mapping
    return null;
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare cart items for checkout
      const checkoutItems = items.map(item => {
        // The stripePriceId should already be set by useSimpleCart
        if (!item.stripePriceId) {
          throw new Error(`No Stripe price found for ${item.name}. Please clear your cart and add items again.`);
        }

        return {
          stripePriceId: item.stripePriceId,
          quantity: item.quantity,
          name: item.name || `Product ${item.productId}`,
          selectedSize: item.size,
          selectedColor: item.metadata?.color || 'default',
          id: item.productId,
          price: item.price,
          category: item.metadata?.category,
          metadata: item.metadata
        };
      });

      // Log what we're sending to checkout

      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutItems,
          customerEmail: '', // Optional: collect email before checkout
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(errorData.error || errorData.details || 'Checkout failed');
      }

      const { sessionId, url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        // Clear cart only after successful redirect starts
        setTimeout(() => clearCart(), 100);
        window.location.href = url;
      } else if (sessionId) {
        // Fallback to Stripe.js redirect
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to load');

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw error;
      }
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full bg-black text-white py-4 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Checkout - ${cartSummary.totalPriceFormatted}`
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <p className="text-xs text-gray-500 text-center">
        Secure checkout powered by Stripe
      </p>
    </div>
  );
}