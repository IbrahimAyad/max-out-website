import { useCartStore } from '@/lib/store/cartStore';
import { Product, ProductCategory } from '@/lib/types';
import { toast } from 'sonner';
import { useUIStore } from '@/store/uiStore';

interface CartItemData {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stripePriceId?: string;
  stripeProductId?: string;
  selectedColor?: string;
  selectedSize?: string;
  category?: string;
  bundleId?: string;
  metadata?: Record<string, any>;
}

export function useCart() {
  const store = useCartStore();
  const { setIsCartOpen } = useUIStore();

  const addItem = (item: CartItemData) => {
    try {
      // Convert to Product format expected by cart store
      const product: Product = {
        id: item.id,
        sku: item.id, // Use id as sku fallback
        name: item.name,
        price: item.price,
        images: [item.image],
        category: (item.category as ProductCategory) || 'accessories',
        stock: {}, // Empty stock object, will be handled by inventory system
        variants: [], // Empty variants array, size handled separately
        color: item.selectedColor,
        description: undefined,
        metadata: {
          ...item.metadata,
          stripePriceId: item.stripePriceId || '',
          stripeProductId: item.stripeProductId,
          category: item.category,
          bundleId: item.bundleId,
        }
      };

      store.addItem(product, item.selectedSize || 'default', item.quantity || 1);
      
      // Open cart drawer after adding item
      setTimeout(() => setIsCartOpen(true), 100);
      
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
      return false;
    }
  };

  const cartSummary = {
    itemCount: store.getTotalItems(),
    totalPrice: store.getTotalPrice([]),
    totalPriceFormatted: `$${(store.getTotalPrice([]) / 100).toFixed(2)}`
  };

  return {
    items: store.items,
    cartSummary,
    addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    getTotalItems: store.getTotalItems,
    getTotalPrice: store.getTotalPrice
  };
}