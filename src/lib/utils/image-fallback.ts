/**
 * Image Fallback Utility
 * Provides comprehensive fallback handling for missing or broken images
 */

export interface ImageFallbackOptions {
  category?: string;
  productType?: string;
  size?: 'small' | 'medium' | 'large';
  useLocalPlaceholder?: boolean;
}

/**
 * Get appropriate placeholder image based on category
 */
export function getCategoryPlaceholder(category?: string): string {
  if (!category) return '/placeholder-product.svg';
  
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('suit') || categoryLower.includes('tuxedo') || categoryLower.includes('blazer')) {
    return '/placeholder-suit.jpg';
  }
  
  if (categoryLower.includes('shirt') || categoryLower.includes('dress shirt')) {
    return '/placeholder-shirt.jpg';
  }
  
  if (categoryLower.includes('shoe') || categoryLower.includes('footwear')) {
    return '/placeholder-shoes.jpg';
  }
  
  if (categoryLower.includes('tie') || categoryLower.includes('bowtie') || categoryLower.includes('accessories')) {
    return '/placeholder-tie.jpg';
  }
  
  return '/placeholder-product.svg';
}

/**
 * Validate if a URL is accessible and well-formed
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  
  // Check for common invalid patterns
  const invalidPatterns = [
    'undefined',
    'null',
    'image',
    'about',
    'favorites', 
    'pattern.svg',
    'product.webp', // This specific broken reference
    'placeholder', // Avoid circular references
  ];
  
  if (invalidPatterns.some(pattern => url.includes(pattern))) {
    return false;
  }
  
  // Validate URL format
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    // Check if it's a valid relative path
    return url.startsWith('/') && !url.includes('..');
  }
}

/**
 * Get fallback image with comprehensive error handling
 */
export function getImageWithFallback(
  primaryUrl: string | undefined | null,
  options: ImageFallbackOptions = {}
): string {
  // First, try the primary URL if valid
  if (isValidImageUrl(primaryUrl)) {
    return primaryUrl!;
  }
  
  // If using local placeholder is preferred, use category-based placeholder
  if (options.useLocalPlaceholder) {
    return getCategoryPlaceholder(options.category);
  }
  
  // Try high-quality stock images as fallbacks based on category
  if (options.category) {
    const categoryLower = options.category.toLowerCase();
    
    if (categoryLower.includes('suit') || categoryLower.includes('tuxedo')) {
      return 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80';
    }
    
    if (categoryLower.includes('shirt')) {
      return 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=80';
    }
    
    if (categoryLower.includes('shoe')) {
      return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80';
    }
    
    if (categoryLower.includes('tie') || categoryLower.includes('accessories')) {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80';
    }
  }
  
  // Final fallback to local placeholder
  return getCategoryPlaceholder(options.category);
}

/**
 * Multiple fallback attempts for product images
 */
export function getProductImageWithFallbacks(
  product: any,
  options: ImageFallbackOptions = {}
): string {
  // Try various product image properties in order of preference
  const imageCandidates = [
    product?.images?.hero?.url,
    product?.images?.primary?.cdn_url,
    product?.images?.primary?.url,
    product?.images?.[0]?.url,
    product?.images?.[0]?.src,
    product?.featured_image?.src,
    product?.primary_image,
    product?.imageUrl,
    product?.image_url,
    product?.image,
    product?.additional_images?.[0],
    product?.gallery?.[0]?.url,
  ];
  
  // Find first valid image
  for (const candidate of imageCandidates) {
    if (isValidImageUrl(candidate)) {
      return candidate;
    }
  }
  
  // Use category from product if not specified in options
  const category = options.category || product?.category || product?.product_type;
  
  return getImageWithFallback(null, { ...options, category });
}

/**
 * Image error handler for onError events
 */
export function createImageErrorHandler(
  fallbackUrl: string,
  onError?: () => void
) {
  return (event: any) => {
    const target = event.target || event.currentTarget;
    if (target && target.src !== fallbackUrl) {
      target.src = fallbackUrl;
      onError?.();
    }
  };
}

/**
 * Preload critical images to prevent loading errors
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Batch preload multiple images
 */
export async function preloadImages(urls: string[]): Promise<boolean[]> {
  const validUrls = urls.filter(isValidImageUrl);
  return Promise.all(validUrls.map(preloadImage));
}

/**
 * Get optimized image URL with size parameters
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality = 80
): string {
  if (!isValidImageUrl(url)) {
    return '/placeholder-product.svg';
  }
  
  // Handle Unsplash URLs
  if (url.includes('images.unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('fit', 'crop');
    
    return `${url.split('?')[0]}?${params.toString()}`;
  }
  
  // Handle other CDN URLs (add parameters as needed)
  if (url.includes('cdn.kctmenswear.com')) {
    return url; // CDN handles optimization internally
  }
  
  return url;
}