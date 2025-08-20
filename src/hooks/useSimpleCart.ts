// Simplified cart hook that works with Stripe checkout
import { useCallback } from 'react';
import { useCartStore } from '@/lib/store/cartStore';
import { CartItem } from '@/lib/types';

// Default Stripe price IDs for different product types
const DEFAULT_STRIPE_PRICES = {
  suits: {
    twoPiece: 'price_1RpvN9CHc12x7sCzYy8ocrQs', // Navy 2-piece
    threePiece: 'price_1RpvNKCHc12x7sCzOkQTTRJM', // Navy 3-piece
  },
  bundle: {
    starter: 'price_1RpvQqCHc12x7sCzfRrWStZb', // Starter bundle
    professional: 'price_1RpvRACHc12x7sCzVYFZh6Ia', // Professional bundle
    executive: 'price_1RpvRSCHc12x7sCzpo0fgH6A', // Executive bundle
  },
  shirts: 'price_1RpvWnCHc12x7sCzzioA64qD', // Slim cut dress shirt
  ties: 'price_1RpvHyCHc12x7sCzjX1WV931', // Skinny tie
  default: 'price_1RpvN9CHc12x7sCzYy8ocrQs', // Default to navy suit
};

interface SimpleCartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  category?: string;
  stripePriceId?: string;
}

export function useSimpleCart() {
  const {
    items,
    addItem: storeAddItem,
    removeItem: storeRemoveItem,
    updateQuantity: storeUpdateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  // Helper to get Stripe price ID based on product category
  const getStripePriceId = (item: SimpleCartItem): string => {
    // If already has a Stripe price ID, use it
    if (item.stripePriceId) return item.stripePriceId;
    
    // Determine based on category and price
    const category = item.category?.toLowerCase() || '';
    
    if (category.includes('bundle')) {
      // Determine bundle tier based on price
      if (item.price <= 200) return DEFAULT_STRIPE_PRICES.bundle.starter;
      if (item.price <= 400) return DEFAULT_STRIPE_PRICES.bundle.professional;
      return DEFAULT_STRIPE_PRICES.bundle.executive;
    }
    
    if (category.includes('suit')) {
      // Check if 3-piece based on name or price
      const is3Piece = item.name.toLowerCase().includes('3') || 
                       item.name.toLowerCase().includes('three') ||
                       item.price > 350;
      return is3Piece ? DEFAULT_STRIPE_PRICES.suits.threePiece : DEFAULT_STRIPE_PRICES.suits.twoPiece;
    }
    
    if (category.includes('shirt')) return DEFAULT_STRIPE_PRICES.shirts;
    if (category.includes('tie')) return DEFAULT_STRIPE_PRICES.ties;
    
    // Default fallback
    return DEFAULT_STRIPE_PRICES.default;
  };

  // Add item to cart with proper Stripe metadata
  const addItem = useCallback((item: SimpleCartItem) => {
    const stripePriceId = getStripePriceId(item);
    
    const product = {
      id: item.id,
      sku: item.id,
      name: item.name,
      price: item.price,
      images: [item.image],
      category: item.category as any || 'suits',
      stock: {},
      variants: [],
      color: item.color,
      description: undefined,
      metadata: {
        stripePriceId,
        category: item.category,
        color: item.color,
      }
    };

    storeAddItem(product, item.size || 'default', item.quantity || 1);
  }, [storeAddItem]);

  // Remove item from cart
  const removeFromCart = useCallback((productId: string, size?: string) => {
    storeRemoveItem(productId, size || 'default');
  }, [storeRemoveItem]);

  // Update quantity
  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      storeUpdateQuantity(productId, size || 'default', quantity);
    }
  }, [storeUpdateQuantity, removeFromCart]);

  // Get cart summary with proper pricing
  const cartSummary = {
    itemCount: getTotalItems(),
    totalPrice: getTotalPrice([]), // Pass empty array since prices are on items
    totalPriceFormatted: `$${(getTotalPrice([]) / 100).toFixed(2)}`,
  };

  // Format items for display
  const formattedItems = items.map(item => ({
    ...item,
    displayPrice: `$${((item.price || 0) / 100).toFixed(2)}`,
    stripePriceId: item.metadata?.stripePriceId || getStripePriceId({
      id: item.productId,
      name: item.name || '',
      price: item.price || 0,
      image: item.image || '',
      quantity: item.quantity,
      category: item.metadata?.category,
    }),
  }));

  return {
    items: formattedItems,
    cartSummary,
    addItem,
    removeFromCart,
    updateQuantity,
    clearCart,
    isEmpty: items.length === 0,
  };
}