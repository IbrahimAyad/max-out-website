/**
 * Smart CDN URL Generator for KCT Menswear Products
 * Uses DEFINITIVE CDN URL patterns from verified scan
 */

import { getDefinitiveCDNUrl, fixToCDNUrl } from './definitive-cdn-urls';

// Product category patterns and their CDN paths
const CATEGORY_PATTERNS = {
  // Vests
  vests: {
    patterns: [/vest(\s*&?\s*tie\s*set)?$/i],
    path: 'menswear-accessories/vest-tie-set',
    modelFile: 'model.webp',
    productFile: 'vest.jpg',
    slugTransform: (name: string) => {
      // Extract color from name like "Hunter Green Vest" -> "hunter-green-vest"
      return name.toLowerCase()
        .replace(/\s*&?\s*tie\s*set/i, '')
        .replace(/\s+vest/i, '-vest')
        .replace(/\s+/g, '-');
    }
  },
  
  // Suspenders
  suspenders: {
    patterns: [/suspender\s*(&?\s*bowtie)?\s*set$/i],
    path: 'menswear-accessories/suspender-bowtie-set',
    modelFile: 'model.webp',
    productFile: 'product.jpg',
    slugTransform: (name: string) => {
      // "Hunter Green Suspender Bowtie Set" -> "hunter-green-suspender-bowtie-set"
      return name.toLowerCase()
        .replace(/\s*&\s*/g, '-')
        .replace(/\s+/g, '-');
    }
  },
  
  // Blazers
  blazers: {
    patterns: [/blazer$/i, /jacket$/i],
    path: 'blazers/prom',
    modelFile: 'main.webp',
    productFile: 'front-close.webp',
    slugTransform: (name: string) => {
      return name.toLowerCase().replace(/\s+/g, '-');
    }
  },
  
  // Tuxedos
  tuxedos: {
    patterns: [/tuxedo/i],
    path: 'tuxedos',
    modelFile: 'main.webp',
    productFile: 'front.webp',
    slugTransform: (name: string) => {
      return name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
    }
  },
  
  // Shirts
  shirts: {
    patterns: [/shirt$/i, /turtleneck$/i, /mock\s*neck$/i],
    path: 'mens-shirts',
    modelFile: 'main.webp',
    productFile: 'front.webp',
    slugTransform: (name: string) => {
      return name.toLowerCase().replace(/\s+/g, '-');
    }
  },
  
  // Double Breasted Suits
  doubleBreasted: {
    patterns: [/double\s*breasted/i],
    path: 'double-breasted-suits',
    modelFile: 'main.webp',
    productFile: 'front.webp',
    slugTransform: (name: string) => {
      return name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
    }
  },
  
  // Stretch Suits
  stretchSuits: {
    patterns: [/slim\s*stretch/i],
    path: 'stretch-suits',
    modelFile: 'main.webp',
    productFile: 'lifestyle.webp',
    slugTransform: (name: string) => {
      return name.toLowerCase().replace(/\s+/g, '-');
    }
  },
  
  // Regular Suits
  suits: {
    patterns: [/suit$/i],
    path: 'suits',
    modelFile: 'main.webp',
    productFile: 'main.webp',
    slugTransform: (name: string) => {
      return name.toLowerCase().replace(/\s+/g, '-');
    }
  }
};

// Special case overrides for products that don't follow standard patterns
const SPECIAL_CASES: Record<string, { model: string; product?: string }> = {
  'Carolina Blue Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/carolina-blue-vest/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/carolina-blue-vest/10-gg_10.jpg'
  },
  'Rose Gold Vest': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/rose-gold-vest/vest.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/vest-tie-set/rose-gold-vest/rose-gold-vest.jpg'
  },
  'Black Suspender Bowtie Set': {
    model: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/black-suspender-bowtie-set/model.webp',
    product: 'https://cdn.kctmenswear.com/menswear-accessories/suspender-bowtie-set/black-suspender-bowtie-set/main.webp'
  }
};

/**
 * Generates CDN URLs for a product based on its name
 * @param productName The name of the product
 * @returns Object with model and product image URLs
 */
export function generateCDNUrls(productName: string): { model: string; product?: string } {
  // Check special cases first
  if (SPECIAL_CASES[productName]) {
    return SPECIAL_CASES[productName];
  }
  
  // Find matching category pattern
  for (const [_, config] of Object.entries(CATEGORY_PATTERNS)) {
    const matches = config.patterns.some(pattern => pattern.test(productName));
    
    if (matches) {
      const slug = config.slugTransform(productName);
      const basePath = `https://cdn.kctmenswear.com/${config.path}/${slug}`;
      
      return {
        model: `${basePath}/${config.modelFile}`,
        product: `${basePath}/${config.productFile}`
      };
    }
  }
  
  // Fallback to placeholder
  return {
    model: '/placeholder-product.jpg',
    product: '/placeholder-product.jpg'
  };
}

/**
 * Fixes legacy R2 URLs to use CDN domain
 * @param url The original URL
 * @param productName Optional product name for smart mapping
 * @returns Fixed CDN URL
 */
export function fixLegacyUrl(url: string | null, productName?: string): string | null {
  if (!url) return null;
  
  // Use the definitive CDN URL functions
  if (productName) {
    // First try the definitive URL generator
    const definitiveUrl = getDefinitiveCDNUrl(productName);
    if (definitiveUrl && !definitiveUrl.includes('placeholder')) {
      return definitiveUrl;
    }
    
    // Fallback to original generator
    const generated = generateCDNUrls(productName);
    if (generated.model !== '/placeholder-product.jpg') {
      return generated.model;
    }
  }
  
  // Fix the URL using definitive patterns
  return fixToCDNUrl(url, productName);
}

/**
 * Validates if a CDN URL is accessible
 * @param url The URL to check
 * @returns Promise<boolean> indicating if URL is valid
 */
export async function validateCDNUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Gets the best available image URL for a product
 * @param productName Product name
 * @param fallbackUrl Optional fallback URL
 * @returns Promise<string> with the best available URL
 */
export async function getBestImageUrl(
  productName: string,
  fallbackUrl?: string
): Promise<string> {
  // Try to generate CDN URL
  const generated = generateCDNUrls(productName);
  
  // Validate generated URL
  if (generated.model !== '/placeholder-product.jpg') {
    const isValid = await validateCDNUrl(generated.model);
    if (isValid) return generated.model;
  }
  
  // Try fallback URL if provided
  if (fallbackUrl) {
    const fixedFallback = fixLegacyUrl(fallbackUrl, productName);
    if (fixedFallback) {
      const isValid = await validateCDNUrl(fixedFallback);
      if (isValid) return fixedFallback;
    }
  }
  
  // Return placeholder as last resort
  return '/placeholder-product.jpg';
}

/**
 * Batch process multiple products for CDN URLs
 * @param products Array of product names
 * @returns Map of product names to CDN URLs
 */
export function batchGenerateCDNUrls(
  products: string[]
): Map<string, { model: string; product?: string }> {
  const urlMap = new Map();
  
  for (const productName of products) {
    urlMap.set(productName, generateCDNUrls(productName));
  }
  
  return urlMap;
}