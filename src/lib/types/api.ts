// API Response and Request Types

import { Product, CartItem, Customer, OrderData } from './index';

// Generic API Response wrapper
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
}

// Authentication API Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  marketingEmails?: boolean;
}

// Product API Types
export interface ProductsRequest {
  category?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  filters?: {
    colors?: string[];
    sizes?: string[];
    priceRange?: { min: number; max: number };
    inStock?: boolean;
  };
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  hasMore: boolean;
  filters: {
    availableColors: string[];
    availableSizes: string[];
    priceRange: { min: number; max: number };
  };
}

export interface ProductDetailResponse {
  product: Product;
  recommendations: Product[];
  inventory: {
    [size: string]: {
      quantity: number;
      reserved: number;
      available: number;
    };
  };
}

// Search API Types
export interface SearchRequest {
  query: string;
  category?: string;
  limit?: number;
  filters?: Record<string, unknown>;
}

export interface SearchResponse {
  results: Product[];
  total: number;
  suggestions: string[];
  facets: {
    categories: Array<{ name: string; count: number }>;
    colors: Array<{ name: string; count: number; hex?: string }>;
    sizes: Array<{ name: string; count: number }>;
  };
  searchTime: number;
}

// Cart API Types
export interface AddToCartRequest {
  productId: string;
  size: string;
  quantity: number;
  metadata?: {
    source?: string;
    campaign?: string;
  };
}

export interface UpdateCartRequest {
  items: Array<{
    productId: string;
    size: string;
    quantity: number;
  }>;
}

export interface CartResponse {
  items: CartItem[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  itemCount: number;
  estimatedShipping?: {
    standard: { price: number; days: string };
    express: { price: number; days: string };
    overnight: { price: number; days: string };
  };
}

// Order API Types
export interface CreateOrderRequest {
  items: CartItem[];
  customer: Customer;
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'stripe' | 'paypal' | 'klarna';
  shippingMethod: 'standard' | 'express' | 'overnight';
  specialInstructions?: string;
}

export interface OrderResponse {
  orderId: string;
  paymentIntent?: {
    clientSecret: string;
    paymentIntentId: string;
  };
  checkoutUrl?: string;
  estimatedDelivery: string;
  trackingInfo?: {
    carrier: string;
    trackingNumber: string;
  };
}

export interface OrderStatusResponse {
  order: {
    id: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: CartItem[];
    totals: {
      subtotal: number;
      tax: number;
      shipping: number;
      total: number;
    };
    createdAt: string;
    updatedAt: string;
    shippingAddress: Record<string, string>;
    trackingInfo?: {
      carrier: string;
      trackingNumber: string;
      trackingUrl: string;
      estimatedDelivery: string;
    };
  };
}

// AI Services API Types
export interface OutfitRecommendationRequest {
  occasion: string;
  budget?: { min: number; max: number };
  preferences?: {
    colors?: string[];
    style?: string;
    fit?: string;
  };
  measurements?: Record<string, number>;
  excludeItems?: string[];
}

export interface OutfitRecommendationResponse {
  recommendations: Array<{
    id: string;
    confidence: number;
    items: Array<{
      productId: string;
      category: string;
      reason: string;
    }>;
    totalPrice: number;
    occasionFit: number;
    stylingNotes: string[];
  }>;
}

export interface SizePredictionRequest {
  productId: string;
  measurements: {
    chest?: number;
    waist?: number;
    height?: number;
    weight?: number;
  };
  previousPurchases?: Array<{
    productId: string;
    size: string;
    fit: 'perfect' | 'too-small' | 'too-large';
  }>;
}

export interface SizePredictionResponse {
  recommendedSize: string;
  confidence: number;
  alternativeSizes: Array<{
    size: string;
    fitDescription: string;
    confidence: number;
  }>;
  sizeChart: Array<{
    size: string;
    measurements: Record<string, number>;
  }>;
}

export interface StyleAnalysisRequest {
  imageUrl?: string;
  imageBase64?: string;
  analysisType: 'color' | 'style' | 'occasion' | 'complete';
}

export interface StyleAnalysisResponse {
  analysis: {
    dominantColors: Array<{ color: string; percentage: number; hex: string }>;
    detectedItems: Array<{
      category: string;
      confidence: number;
      attributes: Record<string, string>;
    }>;
    styleCategory: string;
    occasionSuggestions: string[];
    formalityLevel: number;
  };
  productMatches: Array<{
    productId: string;
    matchScore: number;
    matchingAttributes: string[];
  }>;
}

// Analytics API Types
export interface AnalyticsEventRequest {
  event: string;
  properties: Record<string, unknown>;
  userId?: string;
  sessionId: string;
  timestamp?: number;
}

export interface AnalyticsResponse {
  tracked: boolean;
  eventId: string;
}

// Webhook Types
export interface WebhookPayload<T = Record<string, unknown>> {
  id: string;
  type: string;
  data: T;
  timestamp: number;
  source: 'stripe' | 'supabase' | 'shopify' | 'internal';
  webhookVersion?: string;
}

export interface StripeWebhookPayload extends WebhookPayload {
  stripeEvent: {
    id: string;
    object: 'event';
    type: string;
    data: {
      object: Record<string, unknown>;
      previous_attributes?: Record<string, unknown>;
    };
    created: number;
    livemode: boolean;
  };
}

export interface SupabaseWebhookPayload extends WebhookPayload {
  table: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  record: Record<string, unknown>;
  old_record?: Record<string, unknown>;
  schema: string;
}

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  requestId: string;
  statusCode: number;
}

export interface ValidationError extends Omit<APIError, 'details'> {
  code: 'VALIDATION_ERROR';
  details: {
    field: string;
    message: string;
    value?: unknown;
  }[];
}

export interface AuthenticationError extends APIError {
  code: 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR';
  details: {
    reason: 'invalid_token' | 'expired_token' | 'missing_token' | 'insufficient_permissions';
  };
}

export interface RateLimitError extends APIError {
  code: 'RATE_LIMIT_EXCEEDED';
  details: {
    limit: number;
    remaining: number;
    resetTime: string;
  };
}

// Admin Webhook Data Types
export interface InventoryAdjustment {
  sku: string;
  productId: string;
  changes: {
    [size: string]: {
      previous: number;
      new: number;
      adjustment: number;
      reason: 'recount' | 'damage' | 'theft' | 'correction';
    };
  };
  adjustedBy: string;
  timestamp: string;
  notes?: string;
}

export interface InventoryReservation {
  sku: string;
  productId: string;
  size: string;
  quantity: number;
  orderId?: string;
  customerId?: string;
  expiresAt: string;
  reservedBy: string;
  timestamp: string;
}

export interface PriceChange {
  sku: string;
  productId: string;
  changes: {
    previous: number;
    new: number;
    discount?: {
      type: 'percentage' | 'fixed';
      value: number;
      startDate: string;
      endDate: string;
    };
    reason: 'sale' | 'clearance' | 'cost_change' | 'market_adjustment';
  };
  updatedBy: string;
  timestamp: string;
}

export interface ProductChange {
  productId: string;
  sku: string;
  action: 'created' | 'updated' | 'deleted' | 'published' | 'unpublished';
  changes?: {
    field: string;
    previousValue: unknown;
    newValue: unknown;
  }[];
  updatedBy: string;
  timestamp: string;
}

// SSE Client interface for real-time updates
export interface SSEClient {
  id: string;
  write: (data: string) => void;
  close: () => void;
  userId?: string;
  subscriptions: string[];
}

// Admin notification types
export interface AdminNotification {
  id: string;
  type: 'inventory_low' | 'price_change' | 'product_update' | 'security_alert';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  read: boolean;
}