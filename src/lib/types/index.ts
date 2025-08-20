// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  images: string[];
  category: ProductCategory;
  stock: StockLevel;
  variants: ProductVariant[];
  color?: string;
  description?: string;
  metadata?: ProductMetadata;
}

export type ProductCategory = 'suits' | 'shirts' | 'accessories' | 'shoes';

export interface StockLevel {
  [size: string]: number; // e.g., { "40R": 10, "42R": 5 }
}

// Customer Types
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  measurements?: Measurements;
  stylePreferences?: StylePreferences;
}

// Wedding Types
export interface Wedding {
  id: string;
  weddingDate: Date;
  groomId: string;
  partyMembers: WeddingMember[];
  status: WeddingStatus;
}

export type WeddingStatus = 'planning' | 'confirmed' | 'completed' | 'cancelled';

export interface WeddingMember {
  id: string;
  name: string;
  email: string;
  role: 'groom' | 'best_man' | 'groomsman';
  measurements?: Measurements;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  customizations?: Customization[];
  // Additional fields for checkout
  name?: string;
  price?: number;
  image?: string;
  metadata?: CartItemMetadata;
  // Stripe integration fields
  stripePriceId?: string;
  stripeProductId?: string;
}

// Style Types
export interface StylePreferences {
  colors: string[];
  fit: 'slim' | 'classic' | 'modern';
  occasions: string[];
  stylePersona?: string;
}

// Additional types
export interface Measurements {
  chest: number;
  waist: number;
  hips: number;
  neck: number;
  inseam: number;
  sleeve: number;
}

export interface ProductVariant {
  size: string;
  stock: number;
  price?: number;
}

export interface Customization {
  type: string;
  value: string;
  price?: number;
}

// StyleSwiper Types
export interface StyleSwiperImage {
  id: string;
  key: string;
  url: string;
  category: string;
  metadata?: {
    productId?: string;
    tags?: string[];
    colors?: string[];
    occasions?: string[];
    season?: string;
    style?: string;
  };
  createdAt?: Date;
  lastModified?: Date;
}

export interface StyleSwiperProduct extends Product {
  matchScore?: number;
  reasons?: MatchReason[];
  r2ImageUrl?: string;
}

export interface MatchReason {
  type: 'color' | 'fit' | 'occasion' | 'style' | 'trending';
  description: string;
}

export interface SwipeAnalytics {
  totalSwipes: number;
  leftSwipes: number;
  rightSwipes: number;
  averageSwipeTime: number;
  swipeVelocities: number[];
  undoCount: number;
  categoryPreferences: Record<string, number>;
}

// Stripe Integration Types
export interface StripeProductData {
  productId: string;
  twoPiece: string;
  threePiece: string;
}

export interface StripeProducts {
  suits: Record<string, StripeProductData>;
}

export interface PaymentIntentRequest {
  amount: number;
  metadata?: PaymentMetadata;
  currency?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface CheckoutSessionRequest {
  items: CartItem[];
  customer?: Customer;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface StripeWebhookEvent {
  id: string;
  object: 'event';
  type: string;
  data: {
    object: Record<string, unknown>;
  };
  created: number;
}

export interface OrderData {
  customerId?: string;
  email: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  total: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

// Metadata interface definitions
export interface ProductMetadata {
  tags?: string[];
  fabric?: string;
  brand?: string;
  season?: string;
  occasions?: string[];
  colors?: string[];
  patterns?: string[];
  careInstructions?: string;
  countryOfOrigin?: string;
  seoKeywords?: string[];
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
}

export interface CartItemMetadata {
  addedFrom?: 'product_page' | 'quick_add' | 'recommendations' | 'search';
  bundleId?: string;
  personalizedFit?: boolean;
  alterationsRequired?: boolean;
  giftMessage?: string;
  occasionTag?: string;
  rushOrder?: boolean;
}

export interface PaymentMetadata {
  order_id?: string;
  customer_id?: string;
  items?: string;
  shipping_info?: string;
  gift_message?: string;
  referral_code?: string;
  campaign_id?: string;
  session_id?: string;
}