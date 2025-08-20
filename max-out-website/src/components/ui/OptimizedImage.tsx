'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getCloudflareOptimizedUrl, imagePresets } from '@/lib/cloudflare/imageTransform';
import type { ImageTransformOptions } from '@/lib/cloudflare/imageTransform';
import { cn } from '@/lib/utils';

interface ImageVariant {
  url: string;
  width: number;
  variant: string;
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  preset?: keyof typeof imagePresets;
  transformOptions?: ImageTransformOptions;
  lazy?: boolean;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  // New props for R2 variants
  variants?: ImageVariant[];
  placeholder?: string;
  aspectRatio?: number;
  colors?: {
    dominant: string;
    palette: string[];
  };
}

export default function OptimizedImage({
  src,
  alt,
  preset = 'card',
  transformOptions,
  lazy = true,
  priority = false,
  className = '',
  onLoad,
  onError,
  fallbackSrc = '/placeholder-suit.jpg',
  sizes,
  fill = false,
  width,
  height,
  variants,
  placeholder,
  aspectRatio,
  colors,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(!lazy);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imageRef = useRef<HTMLDivElement>(null);

  // Select best variant based on viewport
  useEffect(() => {
    if (variants && variants.length > 0 && typeof window !== 'undefined') {
      const selectVariant = () => {
        const containerWidth = window.innerWidth;
        const pixelRatio = window.devicePixelRatio || 1;
        const targetWidth = containerWidth * pixelRatio;

        // Find the best matching variant
        const bestVariant = variants.reduce((best, variant) => {
          const bestDiff = Math.abs(best.width - targetWidth);
          const variantDiff = Math.abs(variant.width - targetWidth);
          return variantDiff < bestDiff ? variant : best;
        });

        setCurrentSrc(bestVariant.url);
      };

      selectVariant();
      window.addEventListener('resize', selectVariant);
      return () => window.removeEventListener('resize', selectVariant);
    }
  }, [variants]);

  // Get optimized URL
  const optimizedSrc = variants && variants.length > 0 
    ? currentSrc 
    : getCloudflareOptimizedUrl(
        imageSrc,
        transformOptions || preset
      );

  // Get placeholder for lazy loading
  const placeholderSrc = placeholder || (lazy 
    ? getCloudflareOptimizedUrl(imageSrc, { width: 40, quality: 20, blur: 10 })
    : undefined);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  const handleError = () => {
    setImageSrc(fallbackSrc);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  // Get dimensions from preset if not provided
  const dimensions = !fill && !width && !height && preset
    ? imagePresets[preset]
    : { width, height };

  // Generate srcSet from variants
  const srcSet = variants && variants.length > 0
    ? variants.map(v => `${v.url} ${v.width}w`).join(', ')
    : undefined;

  return (
    <div 
      ref={imageRef} 
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Loading skeleton with dominant color */}
      {isLoading && (
        <div 
          className="absolute inset-0 animate-pulse rounded-lg" 
          style={{ backgroundColor: colors?.dominant || '#e5e7eb' }}
        />
      )}

      {/* Blur placeholder background */}
      {placeholder && isLoading && (
        <div
          className="absolute inset-0 transform scale-110 filter blur-xl"
          style={{
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      {/* Main image */}
      {isInView && (
        <Image
          src={optimizedSrc}
          alt={alt}
          fill={fill}
          width={fill ? undefined : dimensions.width}
          height={fill ? undefined : dimensions.height}
          sizes={responsiveSizes}
          priority={priority}
          placeholder={placeholderSrc ? 'blur' : undefined}
          blurDataURL={placeholderSrc}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={handleLoad}
          onError={handleError}
          quality={100} // Let Cloudflare handle quality
          unoptimized={false} // Let Next.js optimize too
          {...(srcSet && { srcSet })}
        />
      )}

      {/* Low quality placeholder for lazy loading */}
      {!isInView && placeholderSrc && (
        <Image
          src={placeholderSrc}
          alt={alt}
          fill={fill}
          width={fill ? undefined : dimensions.width}
          height={fill ? undefined : dimensions.height}
          className="blur-sm"
          priority={false}
          unoptimized
        />
      )}
    </div>
  );
}

// Preload component for critical images
export function PreloadImages({ images }: { images: string[] }) {
  useEffect(() => {
    images.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getCloudflareOptimizedUrl(src, 'gallery');
      link.type = 'image/webp';
      document.head.appendChild(link);
    });
  }, [images]);

  return null;
}