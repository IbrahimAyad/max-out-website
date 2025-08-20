import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/lib/types';
import { toast } from 'sonner';

interface WishlistItem {
  productId: string;
  addedAt: Date;
}

interface UseWishlistReturn {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isLoading: boolean;
}

export function useWishlist(): UseWishlistReturn {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    const loadWishlist = () => {
      const key = user ? `wishlist_${user.id}` : 'wishlist_guest';
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const items = JSON.parse(stored);
          setWishlistItems(items.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          })));
        } catch (error) {

        }
      }
    };

    loadWishlist();
  }, [user]);

  // Save wishlist to localStorage
  const saveWishlist = (items: WishlistItem[]) => {
    const key = user ? `wishlist_${user.id}` : 'wishlist_guest';
    localStorage.setItem(key, JSON.stringify(items));
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const addToWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      toast.info('Already in wishlist');
      return;
    }

    const newItem: WishlistItem = {
      productId,
      addedAt: new Date()
    };

    const updatedItems = [...wishlistItems, newItem];
    setWishlistItems(updatedItems);
    saveWishlist(updatedItems);

    toast.success('Added to wishlist', {
      action: {
        label: 'View',
        onClick: () => window.location.href = '/account/wishlist'
      }
    });

    // Track event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_wishlist', {
        currency: 'USD',
        value: 0,
        items: [{ item_id: productId }]
      });
    }
  };

  const removeFromWishlist = (productId: string) => {
    const updatedItems = wishlistItems.filter(item => item.productId !== productId);
    setWishlistItems(updatedItems);
    saveWishlist(updatedItems);

    toast.success('Removed from wishlist');

    // Track event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'remove_from_wishlist', {
        currency: 'USD',
        value: 0,
        items: [{ item_id: productId }]
      });
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    const key = user ? `wishlist_${user.id}` : 'wishlist_guest';
    localStorage.removeItem(key);
    toast.success('Wishlist cleared');
  };

  return {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isLoading
  };
}

// Hook to get wishlist with full product data
export function useWishlistWithProducts() {
  const { wishlistItems } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // For now, we'll get products from the store
        const { products: allProducts } = await import('@/lib/store/productStore').then(m => m.useProductStore.getState());

        const wishlistProducts = wishlistItems
          .map(item => allProducts.find(p => p.id === item.productId))
          .filter(Boolean) as Product[];

        setProducts(wishlistProducts);
      } catch (error) {

      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [wishlistItems]);

  return { products, isLoading, wishlistItems };
}