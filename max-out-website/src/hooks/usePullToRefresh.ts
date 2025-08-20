'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true
}: UsePullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || isRefreshing || window.scrollY > 5) return;
    
    setStartY(e.touches[0].clientY);
    setIsPulling(false);
    setPullDistance(0);
  }, [enabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || isRefreshing || startY === 0) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    // Only pull down when at the top of the page
    if (deltaY > 0 && window.scrollY === 0) {
      e.preventDefault();
      
      if (!isPulling) {
        setIsPulling(true);
        triggerHaptic();
      }

      const distance = Math.min(deltaY / resistance, threshold * 1.5);
      setPullDistance(distance);

      // Haptic feedback at threshold
      if (distance >= threshold && pullDistance < threshold) {
        triggerHaptic([10, 50, 10]);
      }
    }
  }, [enabled, isRefreshing, startY, isPulling, threshold, resistance, pullDistance, triggerHaptic]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || isRefreshing || !isPulling) {
      setStartY(0);
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      triggerHaptic(50);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setStartY(0);
    setIsPulling(false);
    setPullDistance(0);
  }, [enabled, isRefreshing, isPulling, pullDistance, threshold, onRefresh, triggerHaptic]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Add touch event listeners with passive: false to allow preventDefault
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  const getPullToRefreshStyles = () => {
    const isActive = isPulling || isRefreshing;
    const progress = Math.min(pullDistance / threshold, 1);
    
    return {
      transform: `translateY(${isActive ? pullDistance : 0}px)`,
      transition: isActive && !isPulling ? 'transform 0.3s ease-out' : 'none',
      overflow: isActive ? 'hidden' : 'auto'
    };
  };

  const getIndicatorStyles = () => {
    const progress = Math.min(pullDistance / threshold, 1);
    const opacity = Math.min(progress * 2, 1);
    const scale = Math.min(0.8 + progress * 0.4, 1.2);
    
    return {
      opacity,
      transform: `scale(${scale}) rotate(${progress * 180}deg)`,
      transition: isPulling ? 'none' : 'all 0.3s ease-out'
    };
  };

  return {
    containerRef,
    isRefreshing,
    isPulling,
    pullDistance,
    progress: Math.min(pullDistance / threshold, 1),
    getPullToRefreshStyles,
    getIndicatorStyles,
    isActive: isPulling || isRefreshing
  };
};