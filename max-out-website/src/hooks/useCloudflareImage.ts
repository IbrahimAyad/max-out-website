'use client';

import { useMemo } from 'react';
import { getCloudflareOptimizedUrl, imagePresets, type ImageTransformOptions } from '@/lib/cloudflare/imageTransform';

/**
 * Hook to automatically optimize images with Cloudflare Image Resizing
 * This will dramatically reduce image sizes and improve load times
 */
export function useCloudflareImage(
  originalUrl: string,
  preset: keyof typeof imagePresets | ImageTransformOptions = 'card'
) {
  const optimizedUrl = useMemo(() => {
    if (!originalUrl) return '';
    return getCloudflareOptimizedUrl(originalUrl, preset);
  }, [originalUrl, preset]);

  const generateSrcSet = useMemo(() => {
    if (!originalUrl) return '';
    
    // Generate multiple sizes for responsive images
    const sizes = [400, 800, 1200, 1600];
    return sizes
      .map(width => {
        const url = getCloudflareOptimizedUrl(originalUrl, { 
          ...((typeof preset === 'string' ? imagePresets[preset] : preset) as ImageTransformOptions),
          width,
          format: 'auto'
        });
        return `${url} ${width}w`;
      })
      .join(', ');
  }, [originalUrl, preset]);

  const placeholderUrl = useMemo(() => {
    if (!originalUrl) return '';
    // Generate a tiny blurred placeholder
    return getCloudflareOptimizedUrl(originalUrl, {
      width: 40,
      quality: 20,
      blur: 10,
      format: 'webp'
    });
  }, [originalUrl]);

  return {
    src: optimizedUrl,
    srcSet: generateSrcSet,
    placeholder: placeholderUrl,
    original: originalUrl
  };
}

/**
 * Batch optimize multiple images
 */
export function useCloudflareImages(
  images: string[],
  preset: keyof typeof imagePresets | ImageTransformOptions = 'card'
) {
  return useMemo(() => {
    return images.map(url => ({
      original: url,
      optimized: getCloudflareOptimizedUrl(url, preset),
      thumbnail: getCloudflareOptimizedUrl(url, 'thumbnail')
    }));
  }, [images, preset]);
}