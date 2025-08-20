'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedBannerProps {
  alt?: string;
  priority?: boolean;
  className?: string;
  fallbackSrc?: string;
}

export function OptimizedBanner({
  alt = 'KCT Menswear - Premium Men\'s Fashion',
  priority = true,
  className = '',
  fallbackSrc = '/KCT-Home-Banner-Update.jpg'
}: OptimizedBannerProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('/optimized/banner-desktop.webp');

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      // Try JPEG fallback first
      if (currentSrc.includes('.webp')) {
        setCurrentSrc('/optimized/banner-desktop.jpg');
      } else {
        // Final fallback to original image
        setCurrentSrc(fallbackSrc);
      }
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <picture>
        {/* WebP sources for modern browsers */}
        <source
          media="(min-width: 768px)"
          srcSet="/optimized/banner-desktop.webp"
          type="image/webp"
        />
        <source
          media="(max-width: 767px)"
          srcSet="/optimized/banner-mobile.webp"
          type="image/webp"
        />
        
        {/* JPEG fallbacks */}
        <source
          media="(min-width: 768px)"
          srcSet="/optimized/banner-desktop.jpg"
          type="image/jpeg"
        />
        <source
          media="(max-width: 767px)"
          srcSet="/optimized/banner-mobile.jpg"
          type="image/jpeg"
        />
        
        {/* Next.js Image component with optimization */}
        <Image
          src={currentSrc}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          onError={handleImageError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          quality={75}
        />
      </picture>
    </div>
  );
}

// Export a simplified version for immediate use
export function HomeBanner({ className = '' }: { className?: string }) {
  return (
    <OptimizedBanner
      alt="KCT Menswear - Elevate Your Style"
      priority={true}
      className={className}
    />
  );
}