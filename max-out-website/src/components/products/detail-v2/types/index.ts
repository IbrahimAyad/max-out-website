import { UnifiedProduct } from '@/types/unified-shop';

export type ProductComplexity = 'premium' | 'standard' | 'accessory' | 'simple';
export type SizingSystem = 'grid' | 'buttons' | 'styles' | 'none';

export interface ProductTemplate {
  complexity: ProductComplexity;
  sizingSystem: SizingSystem;
  bundleOptions: 'full' | 'simple' | 'none';
  aiFeatures: boolean;
  trustSignals: 'premium' | 'standard';
}

export interface EnhancedProduct extends UnifiedProduct {
  templateType?: ProductComplexity;
  sizingConfig?: SizingConfig;
  bundleConfig?: BundleConfig;
}

export interface SizingConfig {
  type: SizingSystem;
  sizes?: string[];
  gridConfig?: {
    lengths: Array<{
      label: string;
      value: string;
      height: string;
      sizes: string[];
    }>;
  };
  fits?: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  styles?: Array<{
    name: string;
    image: string;
    description: string;
    options?: string[];
  }>;
}

export interface BundleConfig {
  enabled: boolean;
  tiers?: Array<{
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    savings: number;
  }>;
  colorGrid?: {
    enabled: boolean;
    maxColors: number;
    columns: number;
  };
}

export interface TrustSignals {
  level: 'premium' | 'standard';
  freeShipping?: {
    threshold: number;
    message: string;
  };
  alterations?: {
    available: boolean;
    price: string;
    message: string;
  };
  guarantee?: {
    period: string;
    message: string;
  };
  returns?: {
    period: string;
    message: string;
  };
}

export interface ProductModuleProps {
  product: EnhancedProduct;
  selectedSize?: string;
  selectedColor?: string;
  selectedFit?: string;
  onSizeSelect?: (size: string) => void;
  onColorSelect?: (color: string) => void;
  onFitSelect?: (fit: string) => void;
  className?: string;
}

export interface TemplateProps {
  product: EnhancedProduct;
  className?: string;
}