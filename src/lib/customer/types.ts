export interface CustomerProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  dateOfBirth?: Date
  preferences: StylePreferences
  measurements: MeasurementProfile[]
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  orderHistory: OrderSummary[]
  wishlist: WishlistItem[]
  loyaltyPoints: number
  tier: LoyaltyTier
  createdAt: Date
  updatedAt: Date
}

export interface StylePreferences {
  favoriteColors: string[]
  preferredFit: 'slim' | 'regular' | 'relaxed'
  stylePersonality: 'classic' | 'modern' | 'trendy' | 'casual'
  occasionFrequency: {
    business: number
    formal: number
    casual: number
    special: number
  }
  brands: string[]
  avoidColors?: string[]
  notes?: string
}

export interface MeasurementProfile {
  id: string
  name: string
  isDefault: boolean
  measurements: {
    chest?: number
    waist?: number
    hips?: number
    neck?: number
    sleeve?: number
    inseam?: number
    outseam?: number
    shoulder?: number
    height?: number
    weight?: number
  }
  unit: 'inches' | 'cm'
  fitPreference: 'tight' | 'fitted' | 'regular' | 'loose'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  type: 'billing' | 'shipping'
  isDefault: boolean
  firstName: string
  lastName: string
  company?: string
  streetAddress1: string
  streetAddress2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'applePay' | 'googlePay'
  isDefault: boolean
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  billingAddress?: Address
}

export interface OrderSummary {
  id: string
  orderNumber: string
  date: Date
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: Address
  trackingNumber?: string
  estimatedDelivery?: Date
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  variant: string
  size: string
  color: string
  quantity: number
  price: number
  customizations?: Record<string, any>
}

export interface WishlistItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  price: number
  addedAt: Date
  notes?: string
  sharedWith?: string[]
  priorityLevel?: 1 | 2 | 3
}

export interface LoyaltyTier {
  name: 'Sterling' | 'Gold' | 'Platinum' | 'Crown'
  benefits: string[]
  pointsRequired: number
  discountPercentage: number
  freeShipping: boolean
  prioritySupport: boolean
  exclusiveAccess: boolean
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded'

export interface ReorderRequest {
  orderId: string
  items?: string[] // Optional: specific items to reorder
  updateSizes?: Record<string, string> // Optional: update sizes
  shippingAddressId?: string
  paymentMethodId?: string
}

export interface WishlistShareRequest {
  wishlistItems: string[]
  recipientEmail: string
  recipientName?: string
  message?: string
  occasion?: string
  expiryDate?: Date
}