'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { Product } from '@/lib/types';

interface HotspotProduct {
  product: Product;
  timestamp: number;
  position: { x: number; y: number };
  duration: number;
}

interface ShoppableVideoProps {
  videoId: string;
  hotspots: HotspotProduct[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ShoppableVideo({ videoId, hotspots, onProductClick, onAddToCart }: ShoppableVideoProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeHotspots, setActiveHotspots] = useState<HotspotProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', updateTime);
    return () => video.removeEventListener('timeupdate', updateTime);
  }, []);

  useEffect(() => {
    const active = hotspots.filter(
      hotspot => 
        currentTime >= hotspot.timestamp && 
        currentTime <= hotspot.timestamp + hotspot.duration
    );
    setActiveHotspots(active);
  }, [currentTime, hotspots]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div ref={containerRef} className="relative aspect-video bg-black rounded-lg overflow-hidden group">
        <VideoPlayer
          videoId={videoId}
          className="w-full h-full"
          autoPlay={true}
          muted={isMuted}
          loop={true}
          controls={false}
        />
        
        <div className="absolute inset-0 pointer-events-none">
          <video
            ref={videoRef}
            className="hidden"
            src={`https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/${videoId}/manifest/video.m3u8`}
            autoPlay
            muted={isMuted}
            loop
          />
        </div>

        <AnimatePresence>
          {activeHotspots.map((hotspot) => (
            <motion.button
              key={`${hotspot.product.id}-${hotspot.timestamp}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedProduct(hotspot.product)}
              className="absolute w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors pointer-events-auto"
              style={{
                left: `${hotspot.position.x}%`,
                top: `${hotspot.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <ShoppingBag className="w-6 h-6 text-black" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white"
                initial={{ scale: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.button>
          ))}
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
          <div className="flex gap-2">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleMute}
              className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />

              <h3 className="text-2xl font-serif mb-2">{selectedProduct.name}</h3>
              <p className="text-2xl font-bold mb-4">${(selectedProduct.price / 100).toFixed(2)}</p>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onProductClick(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white rounded-sm font-semibold transition-colors"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}