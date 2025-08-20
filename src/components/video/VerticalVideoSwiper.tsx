'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  Bookmark, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  MessageCircle,
  X,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  Tag,
  Plus,
  Minus,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/lib/types';
import { TikTokIcon } from '@/components/icons/SocialIcons';

interface PromVideo {
  id: string;
  title: string;
  description: string;
  hls: string;
  thumbnail: string;
  creator: string;
  likes: number;
  views: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: Array<{
    id: string;
    name: string;
    x: number;
    y: number;
    product: Product;
  }>;
  category: 'classic' | 'modern' | 'vintage' | 'trendy';
}

interface VerticalVideoSwiperProps {
  videos: PromVideo[];
  onVideoChange?: (videoIndex: number) => void;
  onProductClick?: (product: Product) => void;
  onLike?: (videoId: string) => void;
  onSave?: (videoId: string) => void;
  onShare?: (video: PromVideo) => void;
  onExit?: () => void;
}

export function VerticalVideoSwiper({
  videos,
  onVideoChange,
  onProductClick,
  onLike,
  onSave,
  onShare,
  onExit
}: VerticalVideoSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showShoppingDrawer, setShowShoppingDrawer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [progress, setProgress] = useState(0);
  const [showFirstTimeHint, setShowFirstTimeHint] = useState(true);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0, 100], [0.8, 1, 0.8]);

  const currentVideo = videos[currentIndex];

  // Auto-hide first time hint
  useEffect(() => {
    const timer = setTimeout(() => setShowFirstTimeHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Video management
  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      video.muted = isMuted;
      if (isPlaying) {
        video.play().catch(console.error);
      } else {
        video.pause();
      }
    }
  }, [currentIndex, isPlaying, isMuted]);

  // Progress tracking
  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      if (currentIndex < videos.length - 1) {
        handleNext();
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex]);

  // Preload next video
  useEffect(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < videos.length) {
      const nextVideo = videoRefs.current[nextIndex];
      if (nextVideo) {
        nextVideo.load();
      }
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(prev => prev + 1);
      onVideoChange?.(currentIndex + 1);
      vibrate();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      onVideoChange?.(currentIndex - 1);
      vibrate();
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;

    if (info.offset.y > threshold) {
      handlePrevious();
    } else if (info.offset.y < -threshold) {
      handleNext();
    }
  };

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
    vibrate();
  };

  const handleDoubleClick = () => {
    onLike?.(currentVideo.id);
    vibrate([50, 50, 50]);
  };

  const handleLike = () => {
    onLike?.(currentVideo.id);
    vibrate();
  };

  const handleSave = () => {
    onSave?.(currentVideo.id);
    vibrate();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentVideo.title,
          text: currentVideo.description,
          url: window.location.href
        });
      } catch (error) {

      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
    onShare?.(currentVideo);
    vibrate();
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowShoppingDrawer(true);
    onProductClick?.(product);
    vibrate();
  };

  const vibrate = (pattern: number | number[] = 10) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 overflow-hidden"
    >
      {/* Exit Button */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-40">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Video Container */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        style={{ y, opacity }}
        className="h-full w-full relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full relative"
          >
            <video
              ref={(el) => { videoRefs.current[currentIndex] = el; }}
              src={currentVideo.hls}
              className="w-full h-full object-cover"
              loop
              playsInline
              muted={isMuted}
              onClick={handleVideoClick}
              onDoubleClick={handleDoubleClick}
              poster={currentVideo.thumbnail}
            />

            {/* Video Overlay Controls */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-20 h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Product Tags */}
            <AnimatePresence>
              {showProducts && (
                <>
                  {currentVideo.tags.map((tag) => (
                    <motion.button
                      key={tag.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={() => handleProductClick(tag.product)}
                      className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-30"
                      style={{ 
                        left: `${tag.x}%`, 
                        top: `${tag.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Tag className="w-4 h-4 text-black" />
                    </motion.button>
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <div className="flex justify-between items-end">
                <div className="flex-1 mr-4">
                  <h3 className="text-xl font-semibold mb-2">{currentVideo.title}</h3>
                  <p className="text-sm text-gray-200 mb-2">{currentVideo.description}</p>
                  <p className="text-xs text-gray-300">
                    @{currentVideo.creator} • {currentVideo.views.toLocaleString()} views
                  </p>

                  {/* TikTok Follow Button */}
                  <a
                    href="https://www.tiktok.com/@kctmenswear"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    <TikTokIcon className="w-4 h-4" />
                    Follow on TikTok
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleLike}
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Heart 
                      className={`w-6 h-6 ${currentVideo.isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                    />
                  </button>
                  <span className="text-xs text-center">{currentVideo.likes}</span>

                  <button
                    onClick={() => setShowComments(true)}
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 text-white" />
                  </button>

                  <button
                    onClick={handleSave}
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Bookmark 
                      className={`w-6 h-6 ${currentVideo.isSaved ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`} 
                    />
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Share2 className="w-6 h-6 text-white" />
                  </button>

                  <button
                    onClick={() => setShowProducts(!showProducts)}
                    className="w-12 h-12 bg-burgundy/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-burgundy transition-colors"
                  >
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-40"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Navigation Hints */}
            <AnimatePresence>
              {showFirstTimeHint && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-white z-30"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ArrowUp className="w-6 h-6" />
                    <span className="text-sm">Swipe up for next video</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ArrowDown className="w-6 h-6" />
                    <span className="text-sm">Swipe down for previous</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Shopping Drawer */}
      <AnimatePresence>
        {showShoppingDrawer && selectedProduct && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 z-50 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
              <button
                onClick={() => setShowShoppingDrawer(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-2xl font-bold text-burgundy mb-2">
                  ${(selectedProduct.price / 100).toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Available in multiple sizes
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  // Add to favorites
                  setShowShoppingDrawer(false);
                }}
              >
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button 
                className="flex-1 bg-burgundy hover:bg-burgundy/90"
                onClick={() => {
                  // Add to cart
                  setShowShoppingDrawer(false);
                }}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Drawer */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 z-50 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Comments</h3>
              <button
                onClick={() => setShowComments(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm">@promking2024</p>
                  <p className="text-gray-600 text-sm">This look is absolutely perfect! 🔥</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm">@styleexpert</p>
                  <p className="text-gray-600 text-sm">Love the color coordination! Where can I get this?</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm">@fashionforward</p>
                  <p className="text-gray-600 text-sm">This is giving main character energy ✨</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-burgundy"
              />
              <Button size="sm" className="bg-burgundy hover:bg-burgundy/90 rounded-full">
                Post
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Counter */}
      <div className="absolute bottom-20 right-6 text-white text-sm z-40">
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  );
}