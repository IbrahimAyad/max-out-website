'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, BookOpen, Clock, Star, ChevronRight, Download, Share2, Heart } from 'lucide-react';
import { VideoPlayer } from '@/components/video/VideoPlayer';

interface VideoGuide {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoId: string;
  category: 'styling' | 'fitting' | 'etiquette' | 'trends';
  views: number;
  likes: number;
  chapters: {
    title: string;
    timestamp: number;
  }[];
}

interface GuideCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface PromGuidesProps {
  guides: VideoGuide[];
  onGuideView: (guide: VideoGuide) => void;
  onGuideShare: (guide: VideoGuide) => void;
}

export function PromGuides({ guides, onGuideView, onGuideShare }: PromGuidesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<VideoGuide | null>(null);
  const [likedGuides, setLikedGuides] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: GuideCategory[] = [
    { id: 'all', name: 'All Guides', icon: '📚', description: 'Everything you need to know' },
    { id: 'styling', name: 'Style Tips', icon: '👔', description: 'Look your absolute best' },
    { id: 'fitting', name: 'Perfect Fit', icon: '📏', description: 'Get the right measurements' },
    { id: 'etiquette', name: 'Prom Etiquette', icon: '🎩', description: 'Manners and behavior' },
    { id: 'trends', name: '2024 Trends', icon: '✨', description: 'What\'s hot this year' },
  ];

  const filteredGuides = selectedCategory === 'all' 
    ? guides 
    : guides.filter(g => g.category === selectedCategory);

  const popularGuides = [...guides]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const handleGuideSelect = (guide: VideoGuide) => {
    setSelectedGuide(guide);
    onGuideView(guide);
  };

  const toggleLike = (guideId: string) => {
    const newLikes = new Set(likedGuides);
    if (newLikes.has(guideId)) {
      newLikes.delete(guideId);
    } else {
      newLikes.add(guideId);
    }
    setLikedGuides(newLikes);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif mb-4"
        >
          Prom Style Guides
        </motion.h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Expert tips and tutorials to help you look and feel confident on your big night
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-gold text-black shadow-lg'
                  : 'bg-white hover:bg-gray-50 shadow-md'
              }`}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
              <span className="text-xs mt-1 opacity-70">{category.description}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Popular Guides Banner */}
      <div className="bg-gradient-to-r from-black to-gray-800 rounded-lg p-8 mb-8 text-white">
        <h3 className="text-2xl font-serif mb-6">Most Popular Guides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleGuideSelect(guide)}
              className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={guide.thumbnail}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1 line-clamp-1">{guide.title}</h4>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span>{formatViews(guide.views)} views</span>
                  <span>{guide.duration}</span>
                </div>
              </div>
              <div className="text-gold">
                #{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          {selectedCategory === 'all' ? 'All Guides' : categories.find(c => c.id === selectedCategory)?.name}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-sm transition-colors ${
              viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-sm transition-colors ${
              viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-100'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Guides Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredGuides.map((guide, index) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={viewMode === 'grid' ? '' : 'bg-white rounded-lg shadow-md overflow-hidden'}
          >
            {viewMode === 'grid' ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div 
                  className="relative aspect-video cursor-pointer group"
                  onClick={() => handleGuideSelect(guide)}
                >
                  <img
                    src={guide.thumbnail}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
                    >
                      <Play className="w-8 h-8 text-black ml-1" />
                    </motion.div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                    {guide.duration}
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-semibold mb-2 line-clamp-2">{guide.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{formatViews(guide.views)} views</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(guide.id);
                        }}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${likedGuides.has(guide.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        {guide.likes + (likedGuides.has(guide.id) ? 1 : 0)}
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGuideShare(guide);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 p-4">
                <div 
                  className="relative w-48 h-28 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                  onClick={() => handleGuideSelect(guide)}
                >
                  <img
                    src={guide.thumbnail}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {guide.duration}
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{guide.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatViews(guide.views)} views</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(guide.id);
                      }}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${likedGuides.has(guide.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      {guide.likes + (likedGuides.has(guide.id) ? 1 : 0)}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGuideShare(guide);
                      }}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedGuide(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video relative bg-black">
                <VideoPlayer
                  videoId={selectedGuide.videoId}
                  autoPlay={true}
                  controls={true}
                  muted={false}
                />
              </div>
              
              <div className="p-6 overflow-y-auto">
                <h3 className="text-2xl font-semibold mb-2">{selectedGuide.title}</h3>
                <p className="text-gray-600 mb-4">{selectedGuide.description}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => toggleLike(selectedGuide.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${likedGuides.has(selectedGuide.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{selectedGuide.likes + (likedGuides.has(selectedGuide.id) ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={() => onGuideShare(selectedGuide)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="w-5 h-5" />
                    Download Guide
                  </button>
                </div>

                {selectedGuide.chapters.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Chapters
                    </h4>
                    <div className="space-y-2">
                      {selectedGuide.chapters.map((chapter, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">{index + 1}</span>
                            <span>{chapter.title}</span>
                          </span>
                          <span className="text-sm text-gray-500">
                            {Math.floor(chapter.timestamp / 60)}:{(chapter.timestamp % 60).toString().padStart(2, '0')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}