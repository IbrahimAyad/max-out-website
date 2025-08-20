'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Tag } from 'lucide-react';
import { Product } from '@/lib/types';

interface TimelineMarker {
  time: number;
  productId: string;
  label: string;
  product: Product;
}

interface TimelineMarkersProps {
  markers: TimelineMarker[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onProductClick: (product: Product) => void;
}

export function TimelineMarkers({
  markers,
  currentTime,
  duration,
  onSeek,
  onProductClick
}: TimelineMarkersProps) {
  const [hoveredMarker, setHoveredMarker] = useState<TimelineMarker | null>(null);

  const getMarkerPosition = (time: number) => {
    return duration > 0 ? (time / duration) * 100 : 0;
  };

  const handleMarkerClick = (marker: TimelineMarker) => {
    onSeek(marker.time);
    onProductClick(marker.product);
  };

  return (
    <div className="relative h-2 w-full">
      {/* Timeline base */}
      <div className="absolute inset-0 bg-white/20 rounded-full" />
      
      {/* Progress bar */}
      <div 
        className="absolute left-0 top-0 h-full bg-gold rounded-full transition-all duration-100"
        style={{ width: `${getMarkerPosition(currentTime)}%` }}
      />

      {/* Markers */}
      {markers.map((marker, index) => (
        <div key={marker.productId}>
          <motion.button
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gold rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform z-10"
            style={{ left: `${getMarkerPosition(marker.time)}%` }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMarkerClick(marker)}
            onMouseEnter={() => setHoveredMarker(marker)}
            onMouseLeave={() => setHoveredMarker(null)}
          >
            <div className="absolute inset-0 rounded-full bg-gold animate-pulse" />
          </motion.button>

          {/* Hover tooltip */}
          <AnimatePresence>
            {hoveredMarker?.productId === marker.productId && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-8 z-20"
                style={{ 
                  left: `${getMarkerPosition(marker.time)}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 text-white shadow-xl border border-gold/20 min-w-64">
                  <div className="flex items-start gap-3">
                    <img
                      src={marker.product.images[0]}
                      alt={marker.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{marker.product.name}</h4>
                      <p className="text-gold text-lg font-bold">
                        ${(marker.product.price / 100).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Tag className="w-3 h-3" />
                        <span className="text-xs text-gray-300">{marker.label}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-3 px-3 py-2 bg-gold text-black rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Quick Add
                  </button>
                  
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black/90" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}