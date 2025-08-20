import { UnifiedProduct } from '@/types/unified-shop';
import { ProductComplexity } from '../types';

export function classifyProduct(product: UnifiedProduct): ProductComplexity {
  // Check category for premium items
  if (product.category === 'suits' || product.category === 'tuxedos') {
    return 'premium';
  }
  
  // Check name for premium indicators
  const nameLower = product.name.toLowerCase();
  if (nameLower.includes('suit') || nameLower.includes('tuxedo')) {
    return 'premium';
  }
  
  // Check for accessories
  if (product.category === 'ties' || 
      product.category === 'bowties' || 
      product.category === 'accessories' ||
      nameLower.includes('tie') || 
      nameLower.includes('bowtie') ||
      nameLower.includes('cummerbund') ||
      nameLower.includes('suspender')) {
    return 'accessory';
  }
  
  // Check for standard items
  if (product.category === 'shirts' || 
      product.category === 'pants' ||
      nameLower.includes('shirt') || 
      nameLower.includes('pant')) {
    return 'standard';
  }
  
  // Check for bundles
  if (product.isBundle || product.type === 'bundle') {
    return 'premium'; // Bundles get premium treatment
  }
  
  // Default to simple for everything else
  return 'simple';
}

export function getSizingSystem(product: UnifiedProduct, complexity: ProductComplexity) {
  switch (complexity) {
    case 'premium':
      if (product.category === 'suits' || product.name.toLowerCase().includes('suit')) {
        return 'grid'; // Suits use complex grid sizing
      }
      return 'buttons';
      
    case 'standard':
      if (product.category === 'shirts' || product.name.toLowerCase().includes('shirt')) {
        return 'buttons'; // Shirts use simple button sizing
      }
      return 'buttons';
      
    case 'accessory':
      if (product.category === 'ties' || product.name.toLowerCase().includes('tie')) {
        return 'styles'; // Ties use style variations
      }
      return 'buttons';
      
    default:
      return 'none';
  }
}

export function getTrustSignalsLevel(complexity: ProductComplexity) {
  return complexity === 'premium' ? 'premium' : 'standard';
}

export function getBundleOptions(complexity: ProductComplexity, product: UnifiedProduct) {
  if (complexity === 'accessory' && 
      (product.category === 'ties' || product.name.toLowerCase().includes('tie'))) {
    return 'full'; // Ties get full bundle builder
  }
  
  if (complexity === 'premium') {
    return 'simple'; // Premium items get simple bundle options
  }
  
  return 'none';
}