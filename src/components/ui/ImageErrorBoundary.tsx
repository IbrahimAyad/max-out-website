\"use client\";

import React, { Component, ReactNode } from 'react';

interface ImageErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ImageErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

/**
 * Error boundary specifically for image loading errors
 * Prevents entire page crashes when images fail to load
 */
export class ImageErrorBoundary extends Component<ImageErrorBoundaryProps, ImageErrorBoundaryState> {
  constructor(props: ImageErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ImageErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Image Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className=\"flex items-center justify-center bg-gray-100 aspect-square rounded-lg\">
          <div className=\"text-center text-gray-500 p-4\">
            <svg 
              className=\"w-8 h-8 mx-auto mb-2\" 
              fill=\"none\" 
              viewBox=\"0 0 24 24\" 
              stroke=\"currentColor\"
            >
              <path 
                strokeLinecap=\"round\" 
                strokeLinejoin=\"round\" 
                strokeWidth={1.5} 
                d=\"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\" 
              />
            </svg>
            <p className=\"text-xs\">Image unavailable</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to handle image loading errors in functional components
 */
export function useImageErrorHandler() {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = React.useCallback((event?: React.SyntheticEvent<HTMLImageElement>) => {
    event?.preventDefault();
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleLoad = React.useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const reset = React.useCallback(() => {
    setHasError(false);
    setIsLoading(true);
  }, []);

  return {
    hasError,
    isLoading,
    handleError,
    handleLoad,
    reset
  };
}

/**
 * Higher-order component to wrap images with error handling
 */
export function withImageErrorHandling<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function ImageErrorWrapper(props: T) {
    return (
      <ImageErrorBoundary>
        <WrappedComponent {...props} />
      </ImageErrorBoundary>
    );
  };
}

/**
 * Safe image component that handles errors gracefully
 */
interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  onError?: () => void;
  category?: string;
}

export function SafeImage({ 
  src, 
  fallbackSrc = '/placeholder-product.svg', 
  onError,
  category,
  ...props 
}: SafeImageProps) {
  const { hasError, isLoading, handleError, handleLoad } = useImageErrorHandler();

  const finalSrc = React.useMemo(() => {
    if (hasError) {
      // Return category-specific placeholder if available
      if (category) {
        if (category.includes('suit') || category.includes('tuxedo')) {
          return '/placeholder-suit.jpg';
        }
        if (category.includes('shirt')) {
          return '/placeholder-shirt.jpg';
        }
        if (category.includes('shoe')) {
          return '/placeholder-shoes.jpg';
        }
        if (category.includes('tie') || category.includes('accessories')) {
          return '/placeholder-tie.jpg';
        }
      }
      return fallbackSrc;
    }
    return src;
  }, [hasError, src, fallbackSrc, category]);

  const handleImageError = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    handleError(event);
    onError?.();
  }, [handleError, onError]);

  return (
    <>
      {isLoading && (
        <div className=\"absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center\">
          <div className=\"w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin\" />
        </div>
      )}
      <img
        {...props}
        src={finalSrc}
        onError={handleImageError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${props.className || ''}`}
      />
    </>
  );
}