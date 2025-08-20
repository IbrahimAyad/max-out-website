'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface R2ImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackColor?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  quality?: number;
}

export function R2Image({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  fallbackColor = '#e5e7eb',
  sizes,
  priority = false,
  onLoad,
  onError,
  quality = 85,
}: R2ImageProps) {
  const [imageState, setImageState] = useState<'loading' | 'error' | 'loaded'>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const maxRetries = 3;
  const baseRetryDelay = 2000; // 2 seconds

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Reset state when src changes
  useEffect(() => {
    setImageState('loading');
    setRetryCount(0);
    setCurrentSrc(src);
  }, [src]);

  const handleImageError = () => {
    console.warn(`Image failed to load: ${currentSrc}, retry ${retryCount}/${maxRetries}`);
    
    if (retryCount < maxRetries) {
      // Exponential backoff with jitter
      const delay = baseRetryDelay * Math.pow(2, retryCount) + Math.random() * 1000;
      
      retryTimeoutRef.current = setTimeout(() => {
        // Add timestamp to force reload
        const separator = currentSrc.includes('?') ? '&' : '?';
        const newSrc = `${src}${separator}retry=${retryCount + 1}&t=${Date.now()}`;
        
        setRetryCount(prev => prev + 1);
        setCurrentSrc(newSrc);
        setImageState('loading');
      }, delay);
    } else {
      setImageState('error');
      onError?.();
    }
  };

  const handleImageLoad = () => {
    setImageState('loaded');
    setRetryCount(0);
    onLoad?.();
  };

  // Generate a gradient based on the fallback color
  const gradientStyle = {
    background: `linear-gradient(135deg, ${fallbackColor}20 0%, ${fallbackColor}40 50%, ${fallbackColor}20 100%)`,
  };

  return (
    <div className={cn('relative overflow-hidden bg-gray-100', className)}>
      {/* Loading shimmer */}
      {imageState === 'loading' && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={gradientStyle}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Error fallback */}
      {imageState === 'error' && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: fallbackColor }}
        >
          <div className="text-center p-4">
            <div 
              className="w-full h-full absolute inset-0 opacity-10"
              style={gradientStyle}
            />
            <svg
              className="w-12 h-12 mx-auto mb-2 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium text-white/80">{alt}</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {imageState !== 'error' && (
        <Image
          src={currentSrc}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          className={cn(
            'transition-opacity duration-500',
            imageState === 'loaded' ? 'opacity-100' : 'opacity-0',
            className
          )}
          sizes={sizes}
          priority={priority}
          onLoad={handleImageLoad}
          onError={handleImageError}
          quality={quality}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}

// Add shimmer animation to globals.css if not already present
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;