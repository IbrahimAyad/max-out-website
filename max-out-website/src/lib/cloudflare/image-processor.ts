import sharp from 'sharp';
import { r2Client } from './r2-client';

export interface ImageVariant {
  name: string;
  width: number;
  height?: number;
  quality: number;
  format: 'webp' | 'jpeg' | 'png';
}

// Define variants for different use cases
export const IMAGE_VARIANTS: Record<string, ImageVariant[]> = {
  'style-swiper': [
    { name: 'thumb', width: 150, quality: 80, format: 'webp' },
    { name: 'small', width: 400, quality: 85, format: 'webp' },
    { name: 'medium', width: 800, quality: 90, format: 'webp' },
    { name: 'large', width: 1200, quality: 90, format: 'webp' },
    { name: 'original', width: 1920, quality: 95, format: 'webp' }
  ],
  'product': [
    { name: 'thumb', width: 200, height: 200, quality: 85, format: 'webp' },
    { name: 'card', width: 400, height: 600, quality: 90, format: 'webp' },
    { name: 'detail', width: 1000, quality: 95, format: 'webp' },
    { name: 'zoom', width: 2000, quality: 95, format: 'webp' }
  ],
  'hero': [
    { name: 'mobile', width: 768, quality: 85, format: 'webp' },
    { name: 'tablet', width: 1024, quality: 90, format: 'webp' },
    { name: 'desktop', width: 1920, quality: 95, format: 'webp' },
    { name: '4k', width: 3840, quality: 95, format: 'webp' }
  ]
};

export interface ProcessedImage {
  key: string;
  url: string;
  variant: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

export class ImageProcessor {
  /**
   * Process an uploaded image and generate variants
   */
  static async processImage(
    imageBuffer: Buffer,
    key: string,
    variantType: keyof typeof IMAGE_VARIANTS = 'style-swiper'
  ): Promise<ProcessedImage[]> {
    const variants = IMAGE_VARIANTS[variantType];
    const processedImages: ProcessedImage[] = [];

    // Get original image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const originalWidth = metadata.width || 1920;
    const originalHeight = metadata.height || 1080;

    // Process each variant
    for (const variant of variants) {
      try {
        // Skip if variant is larger than original
        if (variant.width > originalWidth) {
          continue;
        }

        // Calculate dimensions maintaining aspect ratio
        let width = variant.width;
        let height = variant.height;
        
        if (!height) {
          // Maintain aspect ratio
          height = Math.round((originalHeight / originalWidth) * width);
        }

        // Process the image
        const processedBuffer = await sharp(imageBuffer)
          .resize(width, height, {
            fit: variant.height ? 'cover' : 'inside',
            withoutEnlargement: true
          })
          .toFormat(variant.format, { quality: variant.quality })
          .toBuffer();

        // Generate variant key
        const variantKey = `${key.replace(/\.[^.]+$/, '')}-${variant.name}.${variant.format}`;

        // Upload to R2
        const uploadResult = await r2Client.uploadImage(processedBuffer, variantKey);

        if (uploadResult) {
          processedImages.push({
            key: variantKey,
            url: uploadResult.url,
            variant: variant.name,
            width,
            height,
            size: processedBuffer.length,
            format: variant.format
          });
        }
      } catch (error) {
        console.error(`Error processing variant ${variant.name}:`, error);
      }
    }

    return processedImages;
  }

  /**
   * Generate optimized images for mobile
   */
  static async generateMobileOptimized(
    imageBuffer: Buffer,
    key: string
  ): Promise<ProcessedImage[]> {
    const mobileVariants: ImageVariant[] = [
      { name: 'mobile-1x', width: 375, quality: 85, format: 'webp' },
      { name: 'mobile-2x', width: 750, quality: 85, format: 'webp' },
      { name: 'mobile-3x', width: 1125, quality: 85, format: 'webp' }
    ];

    const processedImages: ProcessedImage[] = [];

    for (const variant of mobileVariants) {
      try {
        const processedBuffer = await sharp(imageBuffer)
          .resize(variant.width, undefined, {
            withoutEnlargement: true
          })
          .toFormat(variant.format, { quality: variant.quality })
          .toBuffer();

        const variantKey = `mobile/${key.replace(/\.[^.]+$/, '')}-${variant.name}.${variant.format}`;
        const uploadResult = await r2Client.uploadImage(processedBuffer, variantKey);

        if (uploadResult) {
          const metadata = await sharp(processedBuffer).metadata();
          processedImages.push({
            key: variantKey,
            url: uploadResult.url,
            variant: variant.name,
            width: metadata.width || variant.width,
            height: metadata.height || 0,
            size: processedBuffer.length,
            format: variant.format
          });
        }
      } catch (error) {
        console.error(`Error processing mobile variant ${variant.name}:`, error);
      }
    }

    return processedImages;
  }

  /**
   * Extract dominant colors from image for theming
   */
  static async extractColors(imageBuffer: Buffer): Promise<{
    dominant: string;
    palette: string[];
    average: string;
  }> {
    try {
      // Resize to small size for faster processing
      const smallBuffer = await sharp(imageBuffer)
        .resize(100, 100, { fit: 'cover' })
        .toBuffer();

      // Get raw pixel data
      const { data, info } = await sharp(smallBuffer)
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Simple color extraction (can be enhanced with color clustering)
      const pixels: Array<[number, number, number]> = [];
      for (let i = 0; i < data.length; i += info.channels) {
        pixels.push([data[i], data[i + 1], data[i + 2]]);
      }

      // Calculate average color
      const avgR = Math.round(pixels.reduce((sum, p) => sum + p[0], 0) / pixels.length);
      const avgG = Math.round(pixels.reduce((sum, p) => sum + p[1], 0) / pixels.length);
      const avgB = Math.round(pixels.reduce((sum, p) => sum + p[2], 0) / pixels.length);
      
      const average = `#${[avgR, avgG, avgB].map(c => c.toString(16).padStart(2, '0')).join('')}`;

      // For now, return simple palette (can be enhanced with proper color quantization)
      return {
        dominant: average,
        palette: [average],
        average
      };
    } catch (error) {
      console.error('Error extracting colors:', error);
      return {
        dominant: '#000000',
        palette: ['#000000'],
        average: '#000000'
      };
    }
  }

  /**
   * Generate blur placeholder for lazy loading
   */
  static async generateBlurPlaceholder(imageBuffer: Buffer): Promise<{
    placeholder: string;
    aspectRatio: number;
  }> {
    try {
      const { data, info } = await sharp(imageBuffer)
        .resize(10, 10, { fit: 'inside' })
        .blur()
        .toBuffer({ resolveWithObject: true });

      const base64 = `data:image/${info.format};base64,${data.toString('base64')}`;
      const aspectRatio = (info.width || 1) / (info.height || 1);

      return {
        placeholder: base64,
        aspectRatio
      };
    } catch (error) {
      console.error('Error generating blur placeholder:', error);
      return {
        placeholder: '',
        aspectRatio: 1
      };
    }
  }

  /**
   * Validate and optimize image before processing
   */
  static async validateAndOptimize(imageBuffer: Buffer): Promise<{
    valid: boolean;
    optimized?: Buffer;
    metadata?: sharp.Metadata;
    error?: string;
  }> {
    try {
      const metadata = await sharp(imageBuffer).metadata();

      // Validate image
      if (!metadata.width || !metadata.height) {
        return { valid: false, error: 'Invalid image dimensions' };
      }

      if (metadata.width > 4096 || metadata.height > 4096) {
        return { valid: false, error: 'Image dimensions too large (max 4096x4096)' };
      }

      // Check file size (10MB limit)
      if (imageBuffer.length > 10 * 1024 * 1024) {
        return { valid: false, error: 'Image file size too large (max 10MB)' };
      }

      // Auto-rotate based on EXIF orientation
      const optimized = await sharp(imageBuffer)
        .rotate() // Auto-rotate based on EXIF
        .withMetadata({
          orientation: undefined // Remove EXIF orientation after rotation
        })
        .toBuffer();

      return {
        valid: true,
        optimized,
        metadata
      };
    } catch (error) {
      return {
        valid: false,
        error: `Invalid image format: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}