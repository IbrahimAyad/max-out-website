'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
  duration: string;
  productCount: number;
  featured?: boolean;
}

interface VideoGalleryProps {
  videos: VideoItem[];
  onVideoSelect: (video: VideoItem) => void;
}

export function VideoGallery({ videos, onVideoSelect }: VideoGalleryProps) {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  
  const featuredVideo = videos.find(v => v.featured) || videos[0];
  const otherVideos = videos.filter(v => v.id !== featuredVideo?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-4">Shop The Look</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Watch our style videos and shop the featured products directly
        </p>
      </div>

      {featuredVideo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div
            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => onVideoSelect(featuredVideo)}
            onMouseEnter={() => setHoveredVideo(featuredVideo.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <img
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: hoveredVideo === featuredVideo.id ? 1 : 0.8,
                opacity: hoveredVideo === featuredVideo.id ? 1 : 0
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                <Play className="w-10 h-10 text-black ml-1" />
              </div>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-gold text-black px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </span>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{featuredVideo.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm">{featuredVideo.productCount} Products</span>
                </div>
              </div>
              <h3 className="text-3xl font-serif text-white mb-2">{featuredVideo.title}</h3>
              <p className="text-white/80">{featuredVideo.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => onVideoSelect(video)}
            onMouseEnter={() => setHoveredVideo(video.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: hoveredVideo === video.id ? 1 : 0.8,
                  opacity: hoveredVideo === video.id ? 1 : 0
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                  <Play className="w-6 h-6 text-black ml-0.5" />
                </div>
              </motion.div>

              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                {video.duration}
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2 group-hover:text-gold transition-colors">
              {video.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">{video.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ShoppingBag className="w-4 h-4" />
              <span>{video.productCount} Shoppable Products</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}