import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  CustomerProfile, 
  MeasurementProfile, 
  Address, 
  WishlistItem,
  StylePreferences,
  OrderSummary
} from '@/lib/customer/types'

interface CustomerStore {
  // Profile
  profile: CustomerProfile | null
  isAuthenticated: boolean
  
  // Actions - Auth
  login: (profile: CustomerProfile) => void
  logout: () => void
  updateProfile: (updates: Partial<CustomerProfile>) => void
  
  // Actions - Measurements
  addMeasurement: (measurement: MeasurementProfile) => void
  updateMeasurement: (id: string, updates: Partial<MeasurementProfile>) => void
  deleteMeasurement: (id: string) => void
  setDefaultMeasurement: (id: string) => void
  
  // Actions - Addresses
  addAddress: (address: Address) => void
  updateAddress: (id: string, updates: Partial<Address>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string, type: 'billing' | 'shipping') => void
  
  // Actions - Wishlist
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void
  shareWishlist: (itemIds: string[], recipientEmail: string) => Promise<void>
  
  // Actions - Style Preferences
  updateStylePreferences: (preferences: Partial<StylePreferences>) => void
  
  // Actions - Orders
  addOrder: (order: OrderSummary) => void
  getRecentOrders: (limit?: number) => OrderSummary[]
  
  // Computed
  getDefaultMeasurement: () => MeasurementProfile | undefined
  getDefaultShippingAddress: () => Address | undefined
  getDefaultBillingAddress: () => Address | undefined
  getLoyaltyStatus: () => { points: number; tier: string; nextTier: string; pointsToNext: number }
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isAuthenticated: false,
      
      // Auth
      login: (profile) => set({ profile, isAuthenticated: true }),
      
      logout: () => set({ profile: null, isAuthenticated: false }),
      
      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates, updatedAt: new Date() } : null
      })),
      
      // Measurements
      addMeasurement: (measurement) => set((state) => {
        if (!state.profile) return state
        
        const measurements = [...state.profile.measurements, measurement]
        // If this is the first measurement, make it default
        if (measurements.length === 1) {
          measurement.isDefault = true
        }
        
        return {
          profile: {
            ...state.profile,
            measurements,
            updatedAt: new Date()
          }
        }
      }),
      
      updateMeasurement: (id, updates) => set((state) => {
        if (!state.profile) return state
        
        const measurements = state.profile.measurements.map(m =>
          m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m
        )
        
        return {
          profile: {
            ...state.profile,
            measurements,
            updatedAt: new Date()
          }
        }
      }),
      
      deleteMeasurement: (id) => set((state) => {
        if (!state.profile) return state
        
        const measurements = state.profile.measurements.filter(m => m.id !== id)
        
        // If we deleted the default, make the first one default
        if (!measurements.find(m => m.isDefault) && measurements.length > 0) {
          measurements[0].isDefault = true
        }
        
        return {
          profile: {
            ...state.profile,
            measurements,
            updatedAt: new Date()
          }
        }
      }),
      
      setDefaultMeasurement: (id) => set((state) => {
        if (!state.profile) return state
        
        const measurements = state.profile.measurements.map(m => ({
          ...m,
          isDefault: m.id === id
        }))
        
        return {
          profile: {
            ...state.profile,
            measurements,
            updatedAt: new Date()
          }
        }
      }),
      
      // Addresses
      addAddress: (address) => set((state) => {
        if (!state.profile) return state
        
        const addresses = [...state.profile.addresses, address]
        
        // If this is the first address, make it default for both
        if (addresses.length === 1) {
          address.isDefault = true
        }
        
        return {
          profile: {
            ...state.profile,
            addresses,
            updatedAt: new Date()
          }
        }
      }),
      
      updateAddress: (id, updates) => set((state) => {
        if (!state.profile) return state
        
        const addresses = state.profile.addresses.map(a =>
          a.id === id ? { ...a, ...updates } : a
        )
        
        return {
          profile: {
            ...state.profile,
            addresses,
            updatedAt: new Date()
          }
        }
      }),
      
      deleteAddress: (id) => set((state) => {
        if (!state.profile) return state
        
        const addresses = state.profile.addresses.filter(a => a.id !== id)
        
        return {
          profile: {
            ...state.profile,
            addresses,
            updatedAt: new Date()
          }
        }
      }),
      
      setDefaultAddress: (id, type) => set((state) => {
        if (!state.profile) return state
        
        const addresses = state.profile.addresses.map(a => {
          if (a.type === type || type === 'shipping') {
            return { ...a, isDefault: a.id === id }
          }
          return a
        })
        
        return {
          profile: {
            ...state.profile,
            addresses,
            updatedAt: new Date()
          }
        }
      }),
      
      // Wishlist
      addToWishlist: (item) => set((state) => {
        if (!state.profile) return state
        
        // Check if item already exists
        if (state.profile.wishlist.find(w => w.productId === item.productId)) {
          return state
        }
        
        return {
          profile: {
            ...state.profile,
            wishlist: [...state.profile.wishlist, item],
            updatedAt: new Date()
          }
        }
      }),
      
      removeFromWishlist: (id) => set((state) => {
        if (!state.profile) return state
        
        return {
          profile: {
            ...state.profile,
            wishlist: state.profile.wishlist.filter(w => w.id !== id),
            updatedAt: new Date()
          }
        }
      }),
      
      updateWishlistItem: (id, updates) => set((state) => {
        if (!state.profile) return state
        
        const wishlist = state.profile.wishlist.map(w =>
          w.id === id ? { ...w, ...updates } : w
        )
        
        return {
          profile: {
            ...state.profile,
            wishlist,
            updatedAt: new Date()
          }
        }
      }),
      
      shareWishlist: async (itemIds, recipientEmail) => {
        const state = get()
        if (!state.profile) return
        
        // In a real app, this would make an API call
        // console.log('Sharing wishlist items:', itemIds, 'with:', recipientEmail)
        
        // Update shared status
        const wishlist = state.profile.wishlist.map(w => {
          if (itemIds.includes(w.id)) {
            return {
              ...w,
              sharedWith: [...(w.sharedWith || []), recipientEmail]
            }
          }
          return w
        })
        
        set({
          profile: {
            ...state.profile,
            wishlist,
            updatedAt: new Date()
          }
        })
      },
      
      // Style Preferences
      updateStylePreferences: (preferences) => set((state) => {
        if (!state.profile) return state
        
        return {
          profile: {
            ...state.profile,
            preferences: {
              ...state.profile.preferences,
              ...preferences
            },
            updatedAt: new Date()
          }
        }
      }),
      
      // Orders
      addOrder: (order) => set((state) => {
        if (!state.profile) return state
        
        // Add loyalty points (10 points per dollar)
        const pointsEarned = Math.floor(order.total * 10)
        
        return {
          profile: {
            ...state.profile,
            orderHistory: [order, ...state.profile.orderHistory],
            loyaltyPoints: state.profile.loyaltyPoints + pointsEarned,
            updatedAt: new Date()
          }
        }
      }),
      
      getRecentOrders: (limit = 5) => {
        const state = get()
        if (!state.profile) return []
        
        return state.profile.orderHistory
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, limit)
      },
      
      // Computed
      getDefaultMeasurement: () => {
        const state = get()
        if (!state.profile) return undefined
        
        return state.profile.measurements.find(m => m.isDefault)
      },
      
      getDefaultShippingAddress: () => {
        const state = get()
        if (!state.profile) return undefined
        
        return state.profile.addresses.find(a => a.isDefault && (a.type === 'shipping' || !a.type))
      },
      
      getDefaultBillingAddress: () => {
        const state = get()
        if (!state.profile) return undefined
        
        return state.profile.addresses.find(a => a.isDefault && a.type === 'billing')
      },
      
      getLoyaltyStatus: () => {
        const state = get()
        if (!state.profile) {
          return { points: 0, tier: 'Sterling', nextTier: 'Gold', pointsToNext: 1000 }
        }
        
        const points = state.profile.loyaltyPoints
        const currentTier = state.profile.tier.name
        
        const tiers = [
          { name: 'Sterling', min: 0, next: 'Gold', nextPoints: 1000 },
          { name: 'Gold', min: 1000, next: 'Platinum', nextPoints: 5000 },
          { name: 'Platinum', min: 5000, next: 'Crown', nextPoints: 10000 },
          { name: 'Crown', min: 10000, next: 'Crown', nextPoints: 0 }
        ]
        
        const tier = tiers.find(t => t.name === currentTier) || tiers[0]
        const pointsToNext = tier.nextPoints - points
        
        return {
          points,
          tier: currentTier,
          nextTier: tier.next,
          pointsToNext: Math.max(0, pointsToNext)
        }
      }
    }),
    {
      name: 'kct-customer-storage',
      version: 1,
      partialize: (state) => ({
        profile: state.profile,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)