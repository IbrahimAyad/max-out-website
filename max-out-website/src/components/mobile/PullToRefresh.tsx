'use client';

import { RefreshCw, ArrowDown } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { ReactNode } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  enabled?: boolean;
  threshold?: number;
  className?: string;
}

export const PullToRefresh = ({
  children,
  onRefresh,
  enabled = true,
  threshold = 80,
  className = ''
}: PullToRefreshProps) => {
  const {
    containerRef,
    isRefreshing,
    isPulling,
    progress,
    getPullToRefreshStyles,
    getIndicatorStyles,
    isActive
  } = usePullToRefresh({
    onRefresh,
    threshold,
    enabled
  });

  const getRefreshMessage = () => {
    if (isRefreshing) return 'Refreshing...';
    if (progress >= 1) return 'Release to refresh';
    if (isPulling) return 'Pull to refresh';
    return '';
  };

  const getRefreshIcon = () => {
    if (isRefreshing) {
      return <RefreshCw className="w-5 h-5 animate-spin" />;
    }
    if (progress >= 1) {
      return <RefreshCw className="w-5 h-5" />;
    }
    return <ArrowDown className="w-5 h-5" />;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Pull to Refresh Indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-4 bg-white/95 backdrop-blur-sm border-b"
          style={{
            transform: `translateY(-100%) translateY(${Math.min(progress * 100, 100)}%)`
          }}
        >
          <div 
            className="flex items-center gap-2 text-gray-600"
            style={getIndicatorStyles()}
          >
            {getRefreshIcon()}
            <span className="text-sm font-medium">
              {getRefreshMessage()}
            </span>
          </div>
        </div>
      )}

      {/* Content Container */}
      <div
        ref={containerRef}
        style={getPullToRefreshStyles()}
        className="min-h-full"
      >
        {children}
      </div>

      {/* Pull Progress Indicator */}
      {isPulling && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
          <div 
            className="h-full bg-amber-500 transition-all duration-100 ease-out"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};