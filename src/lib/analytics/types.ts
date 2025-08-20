export interface AnalyticsEvent {
  name: string;
  properties?: AnalyticsProperties;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface PageViewEvent {
  url: string;
  title: string;
  referrer?: string;
  duration?: number;
  productId?: string;
  category?: string;
}

export interface EcommerceEvent {
  currency: string;
  value: number;
  items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    size?: string;
  }>;
}

export interface AddToCartEvent {
  productId: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  size: string;
  source: "product_page" | "quick_add" | "recommendations" | "search";
}

export interface RemoveFromCartEvent {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size: string;
}

export interface CheckoutEvent {
  step: "started" | "shipping" | "payment" | "completed";
  orderId?: string;
  value?: number;
  items?: number;
}

export interface StyleQuizEvent {
  step: "started" | "completed" | "abandoned";
  stepNumber?: number;
  totalSteps?: number;
  results?: {
    fit: string;
    colors: string[];
    occasions: string[];
    stylePersona: string;
  };
}

export interface SearchEvent {
  query: string;
  resultsCount: number;
  clickedPosition?: number;
  filters?: SearchFilters;
}

export interface FilterEvent {
  filterType: "category" | "size" | "color" | "price" | "sort";
  value: string | string[] | number[];
  resultsCount: number;
}

export interface ConversionFunnel {
  sessionId: string;
  steps: Array<{
    name: string;
    timestamp: number;
    completed: boolean;
  }>;
}

export interface UserProfile {
  userId: string;
  traits: {
    email?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
    lifetimeValue?: number;
    purchaseCount?: number;
    averageOrderValue?: number;
    preferredCategories?: string[];
    preferredSizes?: string[];
  };
}

// Supporting interface definitions
export interface AnalyticsProperties {
  // Page view properties
  url?: string;
  title?: string;
  referrer?: string;
  duration?: number;
  
  // Product properties
  productId?: string;
  productName?: string;
  category?: string;
  price?: number;
  quantity?: number;
  size?: string;
  
  // E-commerce properties
  currency?: string;
  value?: number;
  orderId?: string;
  
  // Search properties
  query?: string;
  resultsCount?: number;
  clickedPosition?: number;
  
  // User properties
  userId?: string;
  sessionId?: string;
  
  // Context properties
  source?: string;
  medium?: string;
  campaign?: string;
  
  // Custom properties
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}

export interface SearchFilters {
  category?: string[];
  size?: string[];
  color?: string[];
  price?: {
    min: number;
    max: number;
  };
  occasion?: string[];
  brand?: string[];
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}