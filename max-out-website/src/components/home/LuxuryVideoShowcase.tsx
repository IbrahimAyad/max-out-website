'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

// Premium video showcase component for luxury homepage
interface VideoItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

interface LuxuryVideoShowcaseProps {
  videos: VideoItem[];
  title?: string;
  subtitle?: string;
}

const LuxuryVideoShowcase = ({ 
  videos, 
  title = "Craftsmanship Stories",
  subtitle = "Behind every piece lies exceptional artistry" 
}: LuxuryVideoShowcaseProps) => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Take first 12 videos as specified in requirements
  const displayVideos = videos.slice(0, 12);

  if (displayVideos.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            {title}
          </h2>
          <div className="w-12 h-px bg-gray-300 mx-auto mb-6" />
          <p className="text-gray-600 text-base md:text-lg font-light max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Main Video Display */}
        <div className="mb-12">
          <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden bg-gray-900">
            <iframe
              src={`https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/${displayVideos[activeVideo].id}/iframe`}
              className="w-full h-full"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              title={displayVideos[activeVideo].title}
            />
          </div>
          
          {/* Video Info */}
          <div className="text-center mt-6">
            <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-2">
              {displayVideos[activeVideo].title}
            </h3>
            {displayVideos[activeVideo].description && (
              <p className="text-gray-600 font-light">
                {displayVideos[activeVideo].description}
              </p>
            )}
          </div>
        </div>

        {/* Video Grid - Luxury Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {displayVideos.map((video, index) => (
            <motion.button
              key={video.id}
              onClick={() => setActiveVideo(index)}
              className={`
                relative aspect-video rounded-lg overflow-hidden group transition-all duration-300
                ${index === activeVideo 
                  ? 'ring-2 ring-gray-900 shadow-lg' 
                  : 'hover:shadow-md'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Video Thumbnail */}
              <div className="w-full h-full bg-gray-200">
                <iframe
                  src={`https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/${video.id}/iframe?muted=true&autoplay=false&poster=true`}
                  className="w-full h-full pointer-events-none"
                  title={`${video.title} thumbnail`}
                />
              </div>
              
              {/* Overlay */}
              <div className={`
                absolute inset-0 transition-all duration-300
                ${index === activeVideo 
                  ? 'bg-black/20' 
                  : 'bg-black/40 group-hover:bg-black/30'
                }
              `} />
              
              {/* Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${index === activeVideo 
                    ? 'bg-white/90 text-gray-900' 
                    : 'bg-white/70 text-gray-900 group-hover:bg-white/90'
                  }
                `}>
                  <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                </div>
              </div>
              
              {/* Video Number */}
              <div className="absolute top-2 left-2">
                <span className={`
                  text-xs font-medium px-2 py-1 rounded transition-all duration-300
                  ${index === activeVideo 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white/80 text-gray-900'
                  }
                `}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LuxuryVideoShowcase;