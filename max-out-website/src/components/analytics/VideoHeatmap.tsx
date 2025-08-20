'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
  userId: string;
  action: 'click' | 'hover' | 'scroll' | 'pause';
}

interface VideoAnalytics {
  videoId: string;
  totalViews: number;
  averageWatchTime: number;
  completionRate: number;
  clickThroughRate: number;
  heatmapData: HeatmapPoint[];
  hotspotPerformance: Array<{
    hotspotId: string;
    clicks: number;
    conversions: number;
    timestamp: number;
  }>;
  timelineEngagement: Array<{
    time: number;
    engagement: number;
    dropoffRate: number;
  }>;
}

interface VideoHeatmapProps {
  videoElement: HTMLVideoElement | null;
  analytics: VideoAnalytics;
  isRecording?: boolean;
  onAnalyticsUpdate?: (data: Partial<VideoAnalytics>) => void;
}

export function VideoHeatmap({ 
  videoElement, 
  analytics, 
  isRecording = true,
  onAnalyticsUpdate 
}: VideoHeatmapProps) {
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>(analytics.heatmapData);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Track video time
  useEffect(() => {
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    return () => videoElement.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoElement]);

  // Record user interactions
  useEffect(() => {
    if (!isRecording || !overlayRef.current) return;

    const overlay = overlayRef.current;

    const recordInteraction = (e: MouseEvent, action: HeatmapPoint['action']) => {
      const rect = overlay.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const point: HeatmapPoint = {
        x,
        y,
        intensity: 1,
        timestamp: currentTime,
        userId: generateUserId(),
        action
      };

      setHeatmapPoints(prev => [...prev, point]);
      onAnalyticsUpdate?.({ 
        heatmapData: [...heatmapPoints, point] 
      });

      // Track analytics events
      trackAnalyticsEvent('video_interaction', {
        videoId: analytics.videoId,
        action,
        position: { x, y },
        timestamp: currentTime
      });
    };

    const handleClick = (e: MouseEvent) => recordInteraction(e, 'click');
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle hover events
      if (Math.random() > 0.95) {
        recordInteraction(e, 'hover');
      }
    };

    overlay.addEventListener('click', handleClick);
    overlay.addEventListener('mousemove', handleMouseMove);

    return () => {
      overlay.removeEventListener('click', handleClick);
      overlay.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isRecording, currentTime, heatmapPoints]);

  // Draw heatmap on canvas
  useEffect(() => {
    if (!canvasRef.current || !isVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size to match overlay
    const rect = overlayRef.current?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Draw heatmap points
    heatmapPoints.forEach(point => {
      const x = (point.x / 100) * canvas.width;
      const y = (point.y / 100) * canvas.height;
      
      // Create gradient for heat point
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
      
      // Color intensity based on action type and frequency
      const alpha = Math.min(point.intensity * 0.3, 0.7);
      const color = point.action === 'click' ? 'red' : 
                   point.action === 'hover' ? 'blue' : 'yellow';
      
      gradient.addColorStop(0, `rgba(${getColorRGB(color)}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${getColorRGB(color)}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 30, y - 30, 60, 60);
    });
  }, [heatmapPoints, isVisible]);

  const generateUserId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const getColorRGB = (color: string) => {
    switch (color) {
      case 'red': return '255, 0, 0';
      case 'blue': return '0, 100, 255';
      case 'yellow': return '255, 255, 0';
      default: return '255, 0, 0';
    }
  };

  const trackAnalyticsEvent = (eventName: string, data: any) => {
    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, data);
    }
    
    // Also send to custom analytics
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, data })
    }).catch(console.error);
  };

  const getHotspotAt = (x: number, y: number) => {
    // Find hotspots near this position
    return heatmapPoints.filter(point => 
      Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5
    ).length;
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement > 80) return 'bg-green-500';
    if (engagement > 60) return 'bg-yellow-500';
    if (engagement > 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="relative">
      {/* Heatmap Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-auto z-20"
        style={{ mixBlendMode: isVisible ? 'multiply' : 'normal' }}
      >
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            isVisible ? 'opacity-70' : 'opacity-0'
          }`}
          style={{ pointerEvents: 'none' }}
        />
      </div>

      {/* Analytics Controls */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-sm space-y-2">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className={`px-3 py-1 rounded transition-colors ${
              isVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isVisible ? 'Hide Heatmap' : 'Show Heatmap'}
          </button>
          
          <div className="text-xs space-y-1">
            <div>Views: {analytics.totalViews.toLocaleString()}</div>
            <div>Avg Watch: {Math.round(analytics.averageWatchTime)}s</div>
            <div>Completion: {analytics.completionRate}%</div>
            <div>CTR: {analytics.clickThroughRate}%</div>
          </div>
        </div>
      </div>

      {/* Timeline Engagement Visualization */}
      <div className="absolute bottom-16 left-4 right-4 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white text-xs font-semibold">Engagement Timeline</span>
          </div>
          <div className="flex gap-1 h-8">
            {analytics.timelineEngagement.map((segment, index) => (
              <motion.div
                key={index}
                className={`flex-1 rounded-sm ${getEngagementColor(segment.engagement)}`}
                style={{ 
                  height: `${Math.max(segment.engagement, 10)}%`,
                  opacity: currentTime >= segment.time ? 1 : 0.3
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: index * 0.1 }}
                title={`Time: ${segment.time}s, Engagement: ${segment.engagement}%`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-white/70 mt-1">
            <span>0s</span>
            <span>{Math.round(currentTime)}s</span>
            <span>{analytics.timelineEngagement[analytics.timelineEngagement.length - 1]?.time || 0}s</span>
          </div>
        </div>
      </div>

      {/* Hotspot Performance Indicators */}
      {analytics.hotspotPerformance.map((hotspot, index) => (
        <motion.div
          key={hotspot.hotspotId}
          className="absolute z-25"
          style={{
            left: `${20 + (index * 15)}%`,
            top: `${30 + (index * 10)}%`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.2 }}
        >
          <div className="bg-gold/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-black text-xs font-bold border-2 border-white">
            {hotspot.clicks}
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {((hotspot.conversions / hotspot.clicks) * 100).toFixed(1)}% CVR
          </div>
        </motion.div>
      ))}

      {/* Real-time Click Indicators */}
      {heatmapPoints
        .filter(point => Date.now() - point.timestamp * 1000 < 2000) // Show recent points
        .map((point, index) => (
          <motion.div
            key={`${point.timestamp}-${index}`}
            className="absolute z-30 pointer-events-none"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <div className={`w-4 h-4 rounded-full ${
              point.action === 'click' ? 'bg-red-500' :
              point.action === 'hover' ? 'bg-blue-500' : 'bg-yellow-500'
            }`} />
          </motion.div>
        ))}
    </div>
  );
}

// Hook for video analytics
export function useVideoAnalytics(videoId: string) {
  const [analytics, setAnalytics] = useState<VideoAnalytics>({
    videoId,
    totalViews: 0,
    averageWatchTime: 0,
    completionRate: 0,
    clickThroughRate: 0,
    heatmapData: [],
    hotspotPerformance: [],
    timelineEngagement: []
  });

  useEffect(() => {
    // Load analytics data
    fetch(`/api/analytics/video/${videoId}`)
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(console.error);
  }, [videoId]);

  const updateAnalytics = (data: Partial<VideoAnalytics>) => {
    setAnalytics(prev => ({ ...prev, ...data }));
    
    // Send to backend
    fetch(`/api/analytics/video/${videoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(console.error);
  };

  return { analytics, updateAnalytics };
}