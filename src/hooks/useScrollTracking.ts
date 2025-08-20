import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@/lib/analytics/google-analytics';

export function useScrollTracking() {
  const hasTracked = useRef({
    25: false,
    50: false,
    75: false,
    90: false,
    100: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100);

      // Track scroll milestones
      if (scrollPercentage >= 25 && !hasTracked.current[25]) {
        trackScrollDepth(25);
        hasTracked.current[25] = true;
      }
      if (scrollPercentage >= 50 && !hasTracked.current[50]) {
        trackScrollDepth(50);
        hasTracked.current[50] = true;
      }
      if (scrollPercentage >= 75 && !hasTracked.current[75]) {
        trackScrollDepth(75);
        hasTracked.current[75] = true;
      }
      if (scrollPercentage >= 90 && !hasTracked.current[90]) {
        trackScrollDepth(90);
        hasTracked.current[90] = true;
      }
      if (scrollPercentage >= 95 && !hasTracked.current[100]) {
        trackScrollDepth(100);
        hasTracked.current[100] = true;
      }
    };

    // Debounce scroll events
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedHandleScroll);
    
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, []);
}