'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoTabs, WeddingCollection } from '@/components/video/VideoTabs';
import { TimelineMarkers } from '@/components/video/TimelineMarkers';
import { ProductHotspot } from '@/components/video/ProductHotspot';
import { WeddingPartyBuilder } from '@/components/wedding/WeddingPartyBuilder';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Heart, 
  Share2, 
  Users,
  ShoppingBag,
  Bookmark,
  Star,
  ArrowLeft,
  Youtube
} from 'lucide-react';
import { Product } from '@/lib/types';
import Link from 'next/link';

// Wedding video data
const weddingVideos = {
  rustic: {
    id: '5f8c9e72c9b4aaaa0f6882af7f32edfb',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/5f8c9e72c9b4aaaa0f6882af7f32edfb/manifest/video.m3u8',
    title: 'Rustic Wedding Collection',
    description: 'Timeless charm meets natural elegance',
    poster: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/5f8c9e72c9b4aaaa0f6882af7f32edfb/thumbnails/thumbnail.jpg'
  },
  summer: {
    id: '13fd091d1a06c7cab8c60af9dffc6874',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/13fd091d1a06c7cab8c60af9dffc6874/manifest/video.m3u8',
    title: 'Summer Wedding Collection',
    description: 'Light and breezy for warm celebrations',
    poster: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/13fd091d1a06c7cab8c60af9dffc6874/thumbnails/thumbnail.jpg'
  },
  modern: {
    id: 'd42b8b6ac4df3b535a3b1e14203f5b55',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/d42b8b6ac4df3b535a3b1e14203f5b55/manifest/video.m3u8',
    title: 'Modern Wedding Collection',
    description: 'Contemporary style for the bold couple',
    poster: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/d42b8b6ac4df3b535a3b1e14203f5b55/thumbnails/thumbnail.jpg'
  },
  fall: {
    id: '5f8c9e72c9b4aaaa0f6882af7f32edfb',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/5f8c9e72c9b4aaaa0f6882af7f32edfb/manifest/video.m3u8',
    title: 'Fall Wedding Collection',
    description: 'Rich colors for autumn ceremonies',
    poster: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/5f8c9e72c9b4aaaa0f6882af7f32edfb/thumbnails/thumbnail.jpg'
  }
};

// Mock products for each collection
const collectionProducts: Record<WeddingCollection, Product[]> = {
  rustic: [
    {
      id: 'rustic-suit-1',
      sku: 'RUST-001',
      name: 'Earthy Brown Three-Piece Suit',
      price: 79900,
      images: ['/api/placeholder/400/500'],
      category: 'suits',
      stock: { '40R': 5, '42R': 8 },
      variants: []
    },
    {
      id: 'rustic-vest-1',
      sku: 'RUST-002',
      name: 'Textured Tweed Vest',
      price: 12900,
      images: ['/api/placeholder/400/500'],
      category: 'accessories',
      stock: { 'M': 10, 'L': 8 },
      variants: []
    },
    {
      id: 'rustic-tie-1',
      sku: 'RUST-003',
      name: 'Burlap Bow Tie',
      price: 4900,
      images: ['/api/placeholder/400/500'],
      category: 'accessories',
      stock: { 'OS': 15 },
      variants: []
    },
    {
      id: 'rustic-shoes-1',
      sku: 'RUST-004',
      name: 'Leather Boots',
      price: 18900,
      images: ['/api/placeholder/400/500'],
      category: 'shoes',
      stock: { '10': 5, '11': 8 },
      variants: []
    }
  ],
  summer: [
    {
      id: 'summer-suit-1',
      sku: 'SUM-001',
      name: 'Light Blue Linen Suit',
      price: 69900,
      images: ['/api/placeholder/400/500'],
      category: 'suits',
      stock: { '40R': 8, '42R': 6 },
      variants: []
    },
    {
      id: 'summer-shirt-1',
      sku: 'SUM-002',
      name: 'Crisp White Cotton Shirt',
      price: 8900,
      images: ['/api/placeholder/400/500'],
      category: 'shirts',
      stock: { 'M': 12, 'L': 10 },
      variants: []
    },
    {
      id: 'summer-tie-1',
      sku: 'SUM-003',
      name: 'Coral Silk Tie',
      price: 5900,
      images: ['/api/placeholder/400/500'],
      category: 'accessories',
      stock: { 'OS': 20 },
      variants: []
    },
    {
      id: 'summer-shoes-1',
      sku: 'SUM-004',
      name: 'Canvas Espadrilles',
      price: 12900,
      images: ['/api/placeholder/400/500'],
      category: 'shoes',
      stock: { '10': 6, '11': 8 },
      variants: []
    }
  ],
  modern: [
    {
      id: 'modern-suit-1',
      sku: 'MOD-001',
      name: 'Sleek Black Tuxedo',
      price: 99900,
      images: ['/api/placeholder/400/500'],
      category: 'suits',
      stock: { '40R': 4, '42R': 6 },
      variants: []
    },
    {
      id: 'modern-shirt-1',
      sku: 'MOD-002',
      name: 'Geometric Pattern Shirt',
      price: 14900,
      images: ['/api/placeholder/400/500'],
      category: 'shirts',
      stock: { 'M': 8, 'L': 6 },
      variants: []
    },
    {
      id: 'modern-accessories-1',
      sku: 'MOD-003',
      name: 'Metallic Cufflinks Set',
      price: 7900,
      images: ['/api/placeholder/400/500'],
      category: 'accessories',
      stock: { 'OS': 15 },
      variants: []
    },
    {
      id: 'modern-shoes-1',
      sku: 'MOD-004',
      name: 'Patent Leather Oxfords',
      price: 22900,
      images: ['/api/placeholder/400/500'],
      category: 'shoes',
      stock: { '10': 4, '11': 6 },
      variants: []
    }
  ],
  fall: [
    {
      id: 'fall-suit-1',
      sku: 'FALL-001',
      name: 'Burgundy Velvet Blazer',
      price: 89900,
      images: ['/api/placeholder/400/500'],
      category: 'suits',
      stock: { '40R': 6, '42R': 8 },
      variants: []
    },
    {
      id: 'fall-vest-1',
      sku: 'FALL-002',
      name: 'Gold Brocade Vest',
      price: 15900,
      images: ['/api/placeholder/400/500'],
      category: 'accessories',
      stock: { 'M': 8, 'L': 6 },
      variants: []
    },
    {
      id: 'fall-tie-1',
      sku: 'FALL-003',
      name: 'Autumn Plaid Tie',
      price: 6900,
      images: ['/api/placeholder/400/500'],
      category: 'accessories',
      stock: { 'OS': 12 },
      variants: []
    },
    {
      id: 'fall-shoes-1',
      sku: 'FALL-004',
      name: 'Cognac Leather Shoes',
      price: 19900,
      images: ['/api/placeholder/400/500'],
      category: 'shoes',
      stock: { '10': 5, '11': 7 },
      variants: []
    }
  ]
};

// Timeline markers for shoppable moments
const timelineMarkers = {
  rustic: [
    { time: 5, productId: 'rustic-suit-1', label: 'Groom Suit', product: collectionProducts.rustic[0] },
    { time: 12, productId: 'rustic-vest-1', label: 'Groomsmen Vest', product: collectionProducts.rustic[1] },
    { time: 20, productId: 'rustic-tie-1', label: 'Accessories', product: collectionProducts.rustic[2] }
  ],
  summer: [
    { time: 4, productId: 'summer-suit-1', label: 'Linen Suit', product: collectionProducts.summer[0] },
    { time: 15, productId: 'summer-tie-1', label: 'Summer Tie', product: collectionProducts.summer[2] },
    { time: 25, productId: 'summer-shoes-1', label: 'Footwear', product: collectionProducts.summer[3] }
  ],
  modern: [
    { time: 6, productId: 'modern-suit-1', label: 'Modern Tux', product: collectionProducts.modern[0] },
    { time: 14, productId: 'modern-accessories-1', label: 'Cufflinks', product: collectionProducts.modern[2] },
    { time: 22, productId: 'modern-shoes-1', label: 'Patent Shoes', product: collectionProducts.modern[3] }
  ],
  fall: [
    { time: 7, productId: 'fall-suit-1', label: 'Velvet Blazer', product: collectionProducts.fall[0] },
    { time: 16, productId: 'fall-vest-1', label: 'Brocade Vest', product: collectionProducts.fall[1] },
    { time: 24, productId: 'fall-tie-1', label: 'Plaid Tie', product: collectionProducts.fall[2] }
  ]
};

// Product hotspots with timestamps
const productHotspots = {
  rustic: [
    { time: 8, x: 45, y: 60, product: collectionProducts.rustic[0] },
    { time: 18, x: 55, y: 40, product: collectionProducts.rustic[1] }
  ],
  summer: [
    { time: 10, x: 50, y: 55, product: collectionProducts.summer[0] },
    { time: 20, x: 48, y: 35, product: collectionProducts.summer[2] }
  ],
  modern: [
    { time: 9, x: 52, y: 50, product: collectionProducts.modern[0] },
    { time: 19, x: 46, y: 45, product: collectionProducts.modern[1] }
  ],
  fall: [
    { time: 11, x: 49, y: 58, product: collectionProducts.fall[0] },
    { time: 21, x: 51, y: 42, product: collectionProducts.fall[1] }
  ]
};

export default function WeddingVideoLookbook() {
  const [activeTab, setActiveTab] = useState<WeddingCollection>('rustic');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPartyBuilder, setShowPartyBuilder] = useState(false);
  const [savedToWishlist, setSavedToWishlist] = useState(false);
  const [liked, setLiked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentVideo = weddingVideos[activeTab];
  const currentProducts = collectionProducts[activeTab];
  const currentMarkers = timelineMarkers[activeTab];
  const currentHotspots = productHotspots[activeTab];

  // Auto-hide controls
  useEffect(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
    };
  }, [activeTab]);

  // Preload videos
  useEffect(() => {
    Object.values(weddingVideos).forEach(video => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = video.hls;
      link.as = 'video';
      document.head.appendChild(link);
    });
  }, []);

  const handleTabChange = (tab: WeddingCollection) => {
    setActiveTab(tab);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleProductClick = (product: Product) => {

    // Handle product click (open modal, add to cart, etc.)
  };

  const addCompleteSetToCart = () => {

    // Calculate bundle discount and add to cart
  };

  const calculateCompleteSetPrice = () => {
    const total = currentProducts.reduce((sum, product) => sum + product.price, 0);
    const discount = 12000; // $120 savings
    return total - discount;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentVideo.title} - KCT Menswear`,
          text: currentVideo.description,
          url: window.location.href
        });
      } catch (error) {

      }
    }
  };

  const getCurrentHotspots = () => {
    return currentHotspots.filter(hotspot => 
      Math.abs(currentTime - hotspot.time) < 2
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="relative z-40 bg-black/50 backdrop-blur-sm border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/weddings" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Weddings
            </Link>

            <div className="flex items-center gap-4">
              <a
                href="https://www.youtube.com/@kctmenswear"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-colors"
                title="Subscribe on YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>

              <button
                onClick={() => setLiked(!liked)}
                className={`p-2 rounded-full transition-colors ${liked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/70 hover:text-white'}`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => setSavedToWishlist(!savedToWishlist)}
                className={`p-2 rounded-full transition-colors ${savedToWishlist ? 'bg-gold/20 text-gold' : 'bg-white/10 text-white/70 hover:text-white'}`}
              >
                <Bookmark className={`w-5 h-5 ${savedToWishlist ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Tabs */}
        <VideoTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Video Player Section */}
        <div className="relative mb-12">
          <motion.div
            ref={containerRef}
            className="relative bg-black/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-gold/20 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Video */}
            <div 
              className="relative aspect-video cursor-pointer"
              onClick={togglePlayPause}
              onMouseMove={() => setShowControls(true)}
            >
              <video
                ref={videoRef}
                src={currentVideo.hls}
                poster={currentVideo.poster}
                className="w-full h-full object-cover"
                playsInline
                muted={isMuted}
              />

              {/* Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              {/* Product Hotspots */}
              {getCurrentHotspots().map((hotspot, index) => (
                <ProductHotspot
                  key={`${hotspot.product.id}-${index}`}
                  product={hotspot.product}
                  x={hotspot.x}
                  y={hotspot.y}
                  isVisible={true}
                  onClick={handleProductClick}
                />
              ))}

              {/* Play/Pause Overlay */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Video Controls */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
                  >
                    {/* Timeline with Markers */}
                    <div className="mb-4">
                      <TimelineMarkers
                        markers={currentMarkers}
                        currentTime={currentTime}
                        duration={duration}
                        onSeek={handleSeek}
                        onProductClick={handleProductClick}
                      />
                    </div>

                    {/* Video Info and Controls */}
                    <div className="flex items-end justify-between">
                      <div className="text-white">
                        <h2 className="text-2xl font-serif font-bold mb-1">
                          {currentVideo.title}
                        </h2>
                        <p className="text-white/70 mb-3">
                          {currentVideo.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlayPause();
                            }}
                            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMute();
                            }}
                            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          >
                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => setShowPartyBuilder(true)}
                          className="bg-gold/20 backdrop-blur-sm border border-gold/30 text-gold hover:bg-gold/30 gap-2"
                        >
                          <Users className="w-4 h-4" />
                          Build Your Party Look
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Products Section */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-serif text-white mb-2">
              Currently Featured in {currentVideo.title}
            </h3>
            <p className="text-white/70">
              Complete your wedding look with these carefully curated pieces
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {currentProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-gold/20 overflow-hidden hover:bg-white/20 transition-all duration-300 group">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-gold/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="w-3 h-3 text-gold fill-current" />
                        <span className="text-xs text-white">Featured</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold text-white mb-2">{product.name}</h4>
                    <p className="text-2xl font-bold text-gold mb-3">
                      ${(product.price / 100).toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-gold hover:bg-gold/90 text-black"
                      onClick={() => handleProductClick(product)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Complete Look CTA */}
          <Card className="bg-gradient-to-r from-gold/20 to-gold/10 backdrop-blur-sm border-gold/30 p-8 text-center">
            <h3 className="text-2xl font-serif text-white mb-2">Complete Wedding Look</h3>
            <p className="text-white/70 mb-4">
              Get everything shown in this collection and save $120
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-white/60 line-through text-xl">
                ${(currentProducts.reduce((sum, p) => sum + p.price, 0) / 100).toFixed(2)}
              </span>
              <span className="text-3xl font-bold text-gold">
                ${(calculateCompleteSetPrice() / 100).toFixed(2)}
              </span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                Save $120
              </span>
            </div>
            <Button
              size="lg"
              onClick={addCompleteSetToCart}
              className="bg-gold hover:bg-gold/90 text-black px-8 py-4 text-lg font-semibold"
            >
              Add Complete Look to Cart
            </Button>

            {/* YouTube CTA */}
            <div className="mt-6 pt-6 border-t border-gold/20">
              <p className="text-white/70 mb-3">Want to see more wedding looks and styling tips?</p>
              <a
                href="https://www.youtube.com/@kctmenswear"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Youtube className="w-5 h-5" />
                Subscribe on YouTube
              </a>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Wedding Party Builder Modal */}
      <WeddingPartyBuilder
        isOpen={showPartyBuilder}
        onClose={() => setShowPartyBuilder(false)}
        availableProducts={currentProducts}
        onSaveParty={(party) => {

        }}
      />
    </div>
  );
}