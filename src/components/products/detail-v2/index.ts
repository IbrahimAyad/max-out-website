// Main export for the V2 Product Detail System
export { default as ProductDetailBase } from './ProductDetailBase';

// Template exports
export { default as PremiumTemplate } from './templates/PremiumTemplate';
export { default as StandardTemplate } from './templates/StandardTemplate';
export { default as AccessoryTemplate } from './templates/AccessoryTemplate';
export { default as SimpleTemplate } from './templates/SimpleTemplate';

// Module exports
export { default as ComplexSizingModule } from './modules/ComplexSizingModule';
export { default as StandardSizingModule } from './modules/StandardSizingModule';
export { default as StyleVariationModule } from './modules/StyleVariationModule';
export { default as BundleBuilderModule } from './modules/BundleBuilderModule';
export { default as AIRecommendationModule } from './modules/AIRecommendationModule';

// Utility exports
export { classifyProduct, getSizingSystem, getTrustSignalsLevel, getBundleOptions } from './utils/productClassifier';
export { resolveTemplate, getTemplateConfig } from './utils/templateResolver';

// Type exports
export type {
  ProductComplexity,
  SizingSystem,
  ProductTemplate,
  EnhancedProduct,
  SizingConfig,
  BundleConfig,
  TrustSignals,
  ProductModuleProps,
  TemplateProps
} from './types';