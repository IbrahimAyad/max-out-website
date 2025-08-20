import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { facebookTracking } from '@/lib/analytics/FacebookTrackingService';

// Track high-value pages automatically
export const useFacebookPageTracking = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Define high-value pages and their tracking
    const highValuePages: Record<string, string> = {
      '/wedding': 'wedding-collection',
      '/weddings': 'wedding-collection',
      '/custom-suits': 'custom-tailoring',
      '/builder': 'custom-tailoring',
      '/bundles': 'bundle-deals',
      '/occasions': 'bundle-deals',
      '/style-quiz': 'style-quiz',
      '/prom': 'prom-collection'
    };

    // Check if current path is a high-value page
    const pageType = highValuePages[pathname];
    if (pageType) {
      facebookTracking.trackHighValuePageView(pageType);
    }

    // Track specific page interests
    if (pathname.includes('/wedding')) {
      facebookTracking.trackSpecialEventInterest('wedding', { action: 'page_view' });
    } else if (pathname.includes('/prom')) {
      facebookTracking.trackSpecialEventInterest('prom');
    }
  }, [pathname]);
};

// Hook for tracking user engagement time
export const useFacebookEngagementTracking = (contentId?: string) => {
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const engagementTime = Math.round((Date.now() - startTime) / 1000);
      
      // Only track if user spent more than 10 seconds
      if (engagementTime > 10 && contentId) {
        if (contentId.includes('video')) {
          facebookTracking.trackVideoEngagement(contentId, engagementTime);
        }
      }
    };
  }, [contentId]);
};