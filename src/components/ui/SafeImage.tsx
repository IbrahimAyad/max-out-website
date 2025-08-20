'use client';

import { Component, ReactNode, useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  onError?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error boundary for image components
class ImageErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn('Image component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="bg-gray-200 animate-pulse rounded-lg w-full h-full flex items-center justify-center">
          <span className="text-gray-400">Image unavailable</span>
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe image component with multiple fallbacks
export default function SafeImage({
  src,
  alt,
  fallbackSrc = '/placeholder-product.jpg',
  onError,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.warn(`Image failed to load: ${imgSrc}`);
    
    if (imgSrc !== fallbackSrc && !hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
    
    onError?.();
  };

  // Fix for hydration issues - use client-side only src
  const [mounted, setMounted] = useState(false);
  useState(() => {
    setMounted(true);
  });

  if (!mounted) {
    return (
      <div className="bg-gray-200 animate-pulse rounded-lg" style={{ width: props.width, height: props.height }}>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <ImageErrorBoundary
      fallback={
        <div className="bg-gray-200 rounded-lg w-full h-full flex items-center justify-center">
          <span className="text-gray-400">Image unavailable</span>
        </div>
      }
    >
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={handleError}
      />
    </ImageErrorBoundary>
  );
}

// Hook for preloading images
export function useImagePreload(urls: string[]) {
  useState(() => {
    if (typeof window !== 'undefined') {
      urls.forEach(url => {
        const img = new window.Image();
        img.src = url;
      });
    }
  });
}