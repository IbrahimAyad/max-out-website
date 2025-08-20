import { useCallback } from 'react';
import {
  trackAddToCart,
  trackRemoveFromCart,
  trackViewItem,
  trackSelectItem,
  trackViewItemList,
  trackQuickView,
  trackAddToWishlist,
  trackFilterCollection,
  trackRecommendationClick,
  formatProductForGA4,
  type Product
} from '@/lib/analytics/ga4';

export function useGA4() {
  // Track product view
  const trackProductView = useCallback((product: any) => {
    const ga4Product = formatProductForGA4(product);
    trackViewItem(ga4Product, product.price);
  }, []);

  // Track product click in list
  const trackProductClick = useCallback((product: any, listName: string) => {
    const ga4Product = formatProductForGA4(product);
    trackSelectItem(ga4Product, listName);
  }, []);

  // Track collection view
  const trackCollectionView = useCallback((collectionName: string, products: any[]) => {
    const ga4Products = products.map((p, index) => ({
      ...formatProductForGA4(p),
      index
    }));
    trackViewItemList(collectionName, ga4Products);
  }, []);

  // Track add to cart
  const trackAddCart = useCallback((product: any) => {
    const ga4Product = formatProductForGA4(product);
    trackAddToCart(ga4Product, product.price * (product.quantity || 1));
  }, []);

  // Track remove from cart
  const trackRemoveCart = useCallback((product: any) => {
    const ga4Product = formatProductForGA4(product);
    trackRemoveFromCart(ga4Product, product.price * (product.quantity || 1));
  }, []);

  // Track quick view modal
  const trackQuickViewModal = useCallback((product: any) => {
    const ga4Product = formatProductForGA4(product);
    trackQuickView(ga4Product);
  }, []);

  // Track wishlist add
  const trackWishlistAdd = useCallback((product: any) => {
    const ga4Product = formatProductForGA4(product);
    trackAddToWishlist(ga4Product);
  }, []);

  // Track filter change
  const trackFilterChange = useCallback((collectionName: string, filters: any) => {
    trackFilterCollection(collectionName, filters);
  }, []);

  // Track recommendation click
  const trackRecommendationInteraction = useCallback(
    (fromProduct: any, toProduct: any, reason: string) => {
      trackRecommendationClick(
        fromProduct.name,
        toProduct.name,
        reason
      );
    },
    []
  );

  return {
    trackProductView,
    trackProductClick,
    trackCollectionView,
    trackAddCart,
    trackRemoveCart,
    trackQuickViewModal,
    trackWishlistAdd,
    trackFilterChange,
    trackRecommendationInteraction
  };
}