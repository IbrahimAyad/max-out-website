import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product } from "@/lib/types";
import { adminClient } from "@/lib/api/adminClient";
import { getStripePriceId } from "@/lib/shared/supabase-products";

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: (products: Product[]) => number;
  syncCart: (customerId: string) => Promise<void>;
  restoreCart: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (product: Product, size: string, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id && item.size === size
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Get Stripe price ID for this product/size combination
          const stripePriceId = getStripePriceId(product, size);

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity,
                size,
                // Store additional product data
                name: product.name,
                price: product.price,
                image: product.images?.[0],
                metadata: product.metadata,
                stripePriceId, // Add Stripe price ID for checkout
                stripeProductId: product.metadata?.stripe_product_id,
              } as CartItem,
            ],
          };
        });
      },

      removeItem: (productId: string, size: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        }));
      },

      updateQuantity: (productId: string, size: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: (products?: Product[]) => {
        const { items } = get();
        return items.reduce((total, item) => {
          // Use the price stored on the cart item first
          if (item.price) {
            return total + item.price * item.quantity;
          }

          // Fallback to product lookup if no price on item
          if (products) {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return total;

            const variant = product.variants?.find((v) => v.size === item.size);
            const price = variant?.price || product.price;

            return total + price * item.quantity;
          }

          return total;
        }, 0);
      },

      syncCart: async (customerId: string) => {
        if (!customerId) return;

        set({ isLoading: true });
        try {
          const { items } = get();

          // Sync each item with the server
          for (const item of items) {
            await adminClient.updateCart(customerId, item);
          }

          // Fetch the latest cart from server
          const serverCart = await adminClient.getCart(customerId);
          set({ items: serverCart });
        } catch (error) {

        } finally {
          set({ isLoading: false });
        }
      },

      restoreCart: (items: CartItem[]) => {
        set({ items });
      },
    }),
    {
      name: "kct-cart-storage",
      storage: createJSONStorage(() => localStorage),
      version: 2, // Increment to clear old cart data
      migrate: (persistedState: unknown, version: number) => {
        // Clear old cart data that doesn't have metadata
        if (version < 2) {
          return { items: [], isLoading: false };
        }
        return persistedState;
      },
      // Prevent hydration mismatches
      partialize: (state) => ({
        items: state.items,
        // Don't persist loading state to prevent SSR mismatches
      }),
      // Skip hydration on server side
      skipHydration: typeof window === 'undefined',
      // Handle rehydration errors gracefully
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to rehydrate cart store:', error);
          // Reset to safe state on hydration error
          return { items: [], isLoading: false };
        }
        // Ensure loading state is reset after hydration
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);