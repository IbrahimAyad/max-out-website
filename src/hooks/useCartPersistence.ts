import { useEffect } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { saveCartToStorage, loadCartFromStorage } from '@/lib/utils/cart-persistence';

export function useCartPersistence() {
  const { items, restoreCart } = useCart();

  // Save cart whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      saveCartToStorage(items);
    }
  }, [items]);

  // Load cart on mount
  useEffect(() => {
    const savedItems = loadCartFromStorage();
    if (savedItems && savedItems.length > 0) {
      restoreCart(savedItems);
    }
  }, []);

  return null;
}