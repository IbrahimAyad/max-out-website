// Cloudflare Image Transformation utilities
// Leverages Cloudflare's image resizing and optimization features

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'json';
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  gravity?: 'auto' | 'left' | 'right' | 'top' | 'bottom' | 'center';
  sharpen?: number;
  blur?: number;
  background?: string;
  dpr?: number; // Device pixel ratio
}

export class CloudflareImageOptimizer {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate optimized image URL with Cloudflare transformations
   */
  getOptimizedUrl(imagePath: string, options: ImageTransformOptions): string {
    // If using Cloudflare Images (separate product)
    // return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`;
    
    // For R2 with Cloudflare Transform Rules or Workers
    const params = new URLSearchParams();
    
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    if (options.format) params.append('format', options.format);
    if (options.fit) params.append('fit', options.fit);
    if (options.gravity) params.append('gravity', options.gravity);
    if (options.sharpen) params.append('sharpen', options.sharpen.toString());
    if (options.blur) params.append('blur', options.blur.toString());
    if (options.background) params.append('background', options.background);
    if (options.dpr) params.append('dpr', options.dpr.toString());

    const queryString = params.toString();
    return queryString ? `${imagePath}?${queryString}` : imagePath;
  }

  /**
   * Get responsive image set for different screen sizes
   */
  getResponsiveImageSet(imagePath: string, sizes: number[]): string {
    return sizes
      .map(size => {
        const url = this.getOptimizedUrl(imagePath, { 
          width: size, 
          format: 'auto',
          quality: 85 
        });
        return `${url} ${size}w`;
      })
      .join(', ');
  }

  /**
   * Get image URL for specific device types
   */
  getDeviceOptimizedUrl(imagePath: string, device: 'mobile' | 'tablet' | 'desktop'): string {
    const deviceSettings = {
      mobile: { width: 400, quality: 85, dpr: 2 },
      tablet: { width: 800, quality: 90, dpr: 2 },
      desktop: { width: 1200, quality: 95, dpr: 1 }
    };

    return this.getOptimizedUrl(imagePath, deviceSettings[device]);
  }

  /**
   * Preload critical images
   */
  preloadImage(imagePath: string, options: ImageTransformOptions): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = this.getOptimizedUrl(imagePath, options);
    
    // Add format hint for better browser optimization
    if (options.format === 'webp') {
      link.type = 'image/webp';
    }
    
    document.head.appendChild(link);
  }

  /**
   * Generate placeholder for lazy loading
   */
  getPlaceholderUrl(imagePath: string): string {
    return this.getOptimizedUrl(imagePath, {
      width: 40,
      quality: 20,
      blur: 10,
      format: 'webp'
    });
  }
}

// Preset configurations for common use cases
export const imagePresets = {
  thumbnail: { width: 150, height: 200, quality: 85, fit: 'cover' as const },
  card: { width: 400, height: 533, quality: 90, fit: 'cover' as const },
  gallery: { width: 800, height: 1067, quality: 95, fit: 'contain' as const },
  hero: { width: 1920, height: 1080, quality: 90, fit: 'cover' as const },
  productMain: { width: 1200, height: 1600, quality: 95, fit: 'contain' as const },
  productThumb: { width: 100, height: 133, quality: 85, fit: 'cover' as const }
};

// R2 URL handler with Cloudflare optimizations
export function getCloudflareOptimizedUrl(
  originalUrl: string,
  preset: keyof typeof imagePresets | ImageTransformOptions
): string {
  // Disable Cloudflare image optimization until properly configured
  // Cloudflare Image Resizing requires Pro plan and specific configuration
  const isCloudflareOptimizationEnabled = false;
  
  // Return original URL until optimization is fixed
  if (!isCloudflareOptimizationEnabled) {
    return originalUrl;
  }
  
  // Parse the URL to check if it's absolute or relative
  const isAbsoluteUrl = originalUrl.startsWith('http://') || originalUrl.startsWith('https://');
  
  // Check if it's an R2 URL
  const isR2Url = originalUrl.includes('.r2.dev') || originalUrl.includes('pub-');
  
  // For R2 URLs, we need to handle them specially
  if (isR2Url) {
    // R2 public URLs work directly with Cloudflare Image Resizing
    // when served through your domain with Transform Rules
    const options = typeof preset === 'string' ? imagePresets[preset] : preset;
    
    // Build Cloudflare Image Resizing parameters
    const cfParams: string[] = [];
    
    // Format (auto will choose WebP or AVIF based on browser support)
    cfParams.push(`format=${options.format || 'auto'}`);
    
    // Dimensions
    if (options.width) cfParams.push(`width=${options.width}`);
    if (options.height) cfParams.push(`height=${options.height}`);
    
    // Quality (default 85 for good balance)
    cfParams.push(`quality=${options.quality || 85}`);
    
    // Fit mode
    if (options.fit) cfParams.push(`fit=${options.fit}`);
    
    // Sharpen for better clarity on resize
    if (options.sharpen) cfParams.push(`sharpen=${options.sharpen}`);
    
    // DPR for retina displays
    if (options.dpr) cfParams.push(`dpr=${options.dpr}`);
    
    // For R2 URLs, use the cdn-cgi/image endpoint
    return `/cdn-cgi/image/${cfParams.join(',')}/${originalUrl}`;
  }
  
  // For relative URLs, make them absolute
  const absoluteUrl = isAbsoluteUrl 
    ? originalUrl 
    : `https://kctmenswear.com${originalUrl.startsWith('/') ? '' : '/'}${originalUrl}`;
  
  const options = typeof preset === 'string' ? imagePresets[preset] : preset;
  
  // Build Cloudflare Image Resizing parameters
  const cfParams: string[] = [];
  
  // Format (auto will choose WebP or AVIF based on browser support)
  cfParams.push(`format=${options.format || 'auto'}`);
  
  // Dimensions
  if (options.width) cfParams.push(`width=${options.width}`);
  if (options.height) cfParams.push(`height=${options.height}`);
  
  // Quality (default 85 for good balance)
  cfParams.push(`quality=${options.quality || 85}`);
  
  // Fit mode
  if (options.fit) cfParams.push(`fit=${options.fit}`);
  
  // Sharpen for better clarity on resize
  if (options.sharpen) cfParams.push(`sharpen=${options.sharpen}`);
  
  // DPR for retina displays
  if (options.dpr) cfParams.push(`dpr=${options.dpr}`);
  
  // Cloudflare Image Resizing URL format
  // This works with your Cloudflare Pro plan
  return `/cdn-cgi/image/${cfParams.join(',')}/${absoluteUrl}`;
}

// Batch preload images for gallery
export function preloadGalleryImages(images: string[], startIndex: number = 0): void {
  const optimizer = new CloudflareImageOptimizer('');
  
  // Preload current, next, and previous images
  const indicesToPreload = [
    startIndex,
    (startIndex + 1) % images.length,
    (startIndex - 1 + images.length) % images.length
  ];

  indicesToPreload.forEach(index => {
    if (images[index]) {
      optimizer.preloadImage(images[index], imagePresets.gallery);
    }
  });
}