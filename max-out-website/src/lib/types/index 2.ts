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
  metadata?: any;
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
  metadata?: any;
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