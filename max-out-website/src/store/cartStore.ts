import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  productName?: string
  productImage?: string
  price: number
  quantity: number
  size?: string
  color?: string
  variant?: string
  customizations?: Record<string, any>
}

interface AddItemParams {
  productId: string
  quantity: number
  size?: string
  color?: string
  variant?: string
  customizations?: Record<string, any>
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (params: AddItemParams) => Promise<void>
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  
  // Computed
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: async (params) => {
        const { productId, quantity, size, color, variant, customizations } = params
        
        // Generate unique item ID based on product and variations
        const itemId = `${productId}-${size || 'default'}-${color || 'default'}-${Date.now()}`
        
        // In a real app, fetch product details from API
        // For now, we'll use placeholder data
        const productData = {
          name: 'Product',
          image: '/placeholder.jpg',
          price: 100 // Default price
        }
        
        const newItem: CartItem = {
          id: itemId,
          productId,
          productName: productData.name,
          productImage: productData.image,
          price: productData.price,
          quantity,
          size,
          color,
          variant,
          customizations
        }
        
        set((state) => ({
          items: [...state.items, newItem],
          isOpen: true // Open cart when item is added
        }))
      },
      
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId)
        }))
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'kct-cart-storage',
      version: 1
    }
  )
)