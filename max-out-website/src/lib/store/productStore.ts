import { create } from "zustand";
import { Product, ProductCategory, StockLevel } from "@/lib/types";
import { adminClient } from "@/lib/api/adminClient";

interface ProductStore {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: ProductCategory | null;
  searchQuery: string;
  inventorySubscriptions: Map<string, () => void>;

  fetchProducts: () => Promise<void>;
  fetchProductsByCategory: (category: ProductCategory) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  updateProductStock: (sku: string, stock: StockLevel) => void;
  subscribeToInventory: (sku: string) => void;
  unsubscribeFromInventory: (sku: string) => void;
  setSelectedCategory: (category: ProductCategory | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  featuredProducts: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  searchQuery: "",
  inventorySubscriptions: new Map(),

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await adminClient.fetchProducts();
      set({ 
        products,
        featuredProducts: products.slice(0, 4), // Simple featured logic
      });
    } catch (error) {
      set({ error: "Failed to fetch products" });

    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductsByCategory: async (category: ProductCategory) => {
    set({ isLoading: true, error: null, selectedCategory: category });
    try {
      const products = await adminClient.fetchProductsByCategory(category);
      set({ products });
    } catch (error) {
      set({ error: "Failed to fetch products by category" });

    } finally {
      set({ isLoading: false });
    }
  },

  searchProducts: async (query: string) => {
    if (!query.trim()) {
      get().fetchProducts();
      return;
    }

    set({ isLoading: true, error: null, searchQuery: query });
    try {
      const products = await adminClient.searchProducts(query);
      set({ products });
    } catch (error) {
      set({ error: "Failed to search products" });

    } finally {
      set({ isLoading: false });
    }
  },

  getProductById: (id: string) => {
    return get().products.find((product) => product.id === id);
  },

  updateProductStock: (sku: string, stock: StockLevel) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.sku === sku
          ? { 
              ...product, 
              stock,
              variants: product.variants.map((v) => ({
                ...v,
                stock: stock[v.size] || 0,
              })),
            }
          : product
      ),
    }));
  },

  subscribeToInventory: (sku: string) => {
    const { inventorySubscriptions } = get();

    // Don't subscribe if already subscribed
    if (inventorySubscriptions.has(sku)) return;

    const unsubscribe = adminClient.subscribeToInventoryUpdates(
      sku,
      (stock) => get().updateProductStock(sku, stock)
    );

    set((state) => {
      const newSubscriptions = new Map(state.inventorySubscriptions);
      newSubscriptions.set(sku, unsubscribe);
      return { inventorySubscriptions: newSubscriptions };
    });
  },

  unsubscribeFromInventory: (sku: string) => {
    const { inventorySubscriptions } = get();
    const unsubscribe = inventorySubscriptions.get(sku);

    if (unsubscribe) {
      unsubscribe();
      set((state) => {
        const newSubscriptions = new Map(state.inventorySubscriptions);
        newSubscriptions.delete(sku);
        return { inventorySubscriptions: newSubscriptions };
      });
    }
  },

  setSelectedCategory: (category: ProductCategory | null) => {
    set({ selectedCategory: category });
    if (category) {
      get().fetchProductsByCategory(category);
    } else {
      get().fetchProducts();
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
}));