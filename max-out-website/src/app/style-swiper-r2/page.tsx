'use client';

import { useState } from 'react';
import { SimpleStyleSwiper } from '@/components/style/SimpleStyleSwiper';
import { StyleSwiperImage, SwipeAnalytics } from '@/lib/types';
import { ArrowLeft, Sparkles, Upload, Trophy, Target, Zap, Heart, TrendingUp, Award, Crown, Star, Ruler } from 'lucide-react';
import Link from 'next/link';
import { EnhancedSizeBot } from '@/components/sizing/EnhancedSizeBot';
import { motion } from 'framer-motion';
import { SmartTips } from '@/components/ai/SmartTips';

const CATEGORIES = [
  { value: 'all', label: 'All Styles' },
  { value: 'suits', label: 'Suits & Tuxedos' },
  { value: 'shirts', label: 'Shirts' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'trending', label: 'Trending' },
  { value: 'seasonal', label: 'Seasonal' },
];

export default function StyleSwiperR2Page() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [swipeData, setSwipeData] = useState<any[]>([]);
  const [styleScore, setStyleScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [dailyStreak, setDailyStreak] = useState(1);
  const [completedProfiles, setCompletedProfiles] = useState<any[]>([]);
  const [showSizeBot, setShowSizeBot] = useState(false);
  const [userSize, setUserSize] = useState<any>(null);
  const [likedImages, setLikedImages] = useState<string[]>([]);

  const handleSwipe = (image: StyleSwiperImage, direction: 'left' | 'right', velocity?: number) => {
    // Update swipe data
    setSwipeData(prev => [...prev, { 
      imageId: image.id, 
      category: image.category,
      direction, 
      velocity, 
      timestamp: Date.now() 
    }]);
    
    // Update style score for engagement gamification
    if (direction === 'right') {
      setStyleScore(prev => prev + 10);
      setLikedImages(prev => [...prev, image.id]);
      
      // Check for achievements
      const newAchievements = [];
      if (swipeData.filter(d => d.direction === 'right').length === 4) {
        newAchievements.push('first-love');
      }
      if (velocity && Math.abs(velocity) > 800) {
        newAchievements.push('speed-demon');
      }
      setAchievements(prev => [...prev, ...newAchievements.filter(a => !prev.includes(a))]);
    }
  };

  const handleComplete = (likedImages: StyleSwiperImage[], analytics: SwipeAnalytics) => {
    setCompletedProfiles(prev => [...prev, { 
      likedImages, 
      analytics, 
      category: selectedCategory,
      completedAt: new Date().toISOString()
    }]);
  };

  const handleProductClick = (productId: string) => {
    setCompletedProfiles([]);
    window.location.reload();
  };

  const resetDemo = () => {
    setCompletedProfiles([]);
    setSwipeData([]);
    setLikedImages([]);
    setCurrentIndex(0);
    // Clear any saved data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('style_swiper_data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black-50 via-white to-gold-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gold-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-black-600 hover:text-burgundy transition-colors group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            
            <Link 
              href="/admin/style-swiper" 
              className="inline-flex items-center gap-2 bg-burgundy hover:bg-burgundy-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              <Upload className="w-4 h-4" />
              Manage Images
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 text-burgundy mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-burgundy to-transparent"></div>
            <Crown className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Luxury Style Discovery</span>
            <Crown className="w-5 h-5" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-burgundy to-transparent"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif mb-6 bg-gradient-to-r from-burgundy via-black to-burgundy bg-clip-text text-transparent">
            Your Style DNA Awaits
          </h1>
          <p className="text-black-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Discover your unique style preferences through our intelligent swipe experience. 
            Each choice builds your personal style profile for curated recommendations.
          </p>
          
          {/* Gamification Stats */}
          <div className="flex justify-center items-center gap-8 mt-8 mb-4">
            <div className="text-center">
              <div className="bg-gradient-to-br from-gold-400 to-gold-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-black-500">Style Score</p>
              <p className="text-lg font-bold text-burgundy">{styleScore}</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-burgundy-400 to-burgundy-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-black-500">Daily Streak</p>
              <p className="text-lg font-bold text-burgundy">{dailyStreak}</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-gold-400 to-burgundy-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-black-500">Achievements</p>
              <p className="text-lg font-bold text-burgundy">{achievements.length}</p>
            </div>
          </div>
          
          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <div className="flex justify-center gap-2 mt-4">
              {achievements.slice(-3).map((achievement, i) => (
                <div key={i} className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm font-medium border border-gold-200">
                  {achievement === 'first-love' && '💫 First Love'}
                  {achievement === 'speed-demon' && '⚡ Speed Demon'}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Premium Swiper Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gold-100 relative overflow-hidden">
            {/* Luxury background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-burgundy-100 via-transparent to-gold-100"></div>
            </div>
            <div className="relative z-10">
            <div className="mb-8">
              <label className="block text-sm font-semibold text-black-700 mb-3 tracking-wide">
                <Target className="w-4 h-4 inline-block mr-2 text-burgundy" />
                Style Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gold-200 rounded-xl focus:ring-2 focus:ring-burgundy focus:border-burgundy bg-gradient-to-r from-white to-gold-50 font-medium shadow-sm transition-all hover:shadow-md"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <SimpleStyleSwiper
              key={`${selectedCategory}-${completedProfiles.length}`}
              category={selectedCategory}
              onSwipe={handleSwipe}
              onComplete={handleComplete}
              onProductClick={handleProductClick}
            />
            </div>
          </div>

          {/* Premium Analytics & Features */}
          <div className="space-y-8">
            {/* AI Size Finder Card */}
            <motion.div 
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-burgundy/20 via-white to-gold/20 rounded-3xl shadow-2xl p-8 border-2 border-burgundy/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-burgundy/40 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-gold/30 to-transparent rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-serif mb-2 text-black-800 flex items-center gap-2">
                      <Ruler className="w-6 h-6 text-burgundy" />
                      AI Size Finder
                    </h3>
                    <p className="text-gray-600 text-sm">Get your perfect fit with our AI-powered sizing technology</p>
                  </div>
                  {userSize && (
                    <div className="text-center bg-white rounded-lg p-2 shadow-sm border border-gold-200">
                      <p className="text-xs text-gray-500">Your Size</p>
                      <p className="text-2xl font-bold text-burgundy">{userSize.primarySize}</p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setShowSizeBot(true)}
                  className="w-full bg-gradient-to-r from-burgundy to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  {userSize ? 'Update My Size' : 'Find My Perfect Size'}
                  <Sparkles className="w-5 h-5" />
                </button>
                
                {userSize && (
                  <div className="mt-4 p-3 bg-white/70 rounded-lg border border-gold-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Confidence</span>
                      <span className="font-semibold text-burgundy">{Math.round((userSize.confidence || 0.9) * 100)}%</span>
                    </div>
                    <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(userSize.confidence || 0.9) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-burgundy to-gold"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Style Profile Progress */}
            <div className="bg-gradient-to-br from-white via-gold-50 to-white rounded-3xl shadow-2xl p-8 border border-gold-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-burgundy via-gold to-burgundy"></div>
              <h3 className="text-2xl font-serif mb-6 text-black-800">
                <TrendingUp className="w-6 h-6 inline-block mr-3 text-burgundy" />
                Your Style DNA
              </h3>
              
              {/* Progress visualization */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-black-600">Discovery Progress</span>
                  <span className="text-sm text-burgundy font-bold">{swipeData.length} swipes</span>
                </div>
                <div className="h-3 bg-gold-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-burgundy to-gold transition-all duration-500"
                    style={{ width: `${Math.min((swipeData.length / 20) * 100, 100)}%` }}
                  ></div>
                </div>
                
                {swipeData.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-white/70 rounded-xl border border-gold-200">
                      <Heart className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-black-500">Loved</p>
                      <p className="text-lg font-bold text-green-600">
                        {swipeData.filter(d => d.direction === 'right').length}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white/70 rounded-xl border border-gold-200">
                      <TrendingUp className="w-5 h-5 text-burgundy mx-auto mb-1" />
                      <p className="text-xs text-black-500">Style Score</p>
                      <p className="text-lg font-bold text-burgundy">{styleScore}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Premium Features */}
            <div className="bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-black-800 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Crown className="w-8 h-8 text-gold opacity-20" />
              </div>
              <h3 className="text-2xl font-serif mb-6 text-white">
                <Sparkles className="w-6 h-6 inline-block mr-3 text-gold" />
                Luxury Features
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mt-1.5 flex-shrink-0 shadow-lg"></div>
                  <div className="text-gold-100">
                    <strong className="text-white">AI-Powered Curation:</strong> Machine learning algorithms analyze your preferences for personalized recommendations
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mt-1.5 flex-shrink-0 shadow-lg"></div>
                  <div className="text-gold-100">
                    <strong className="text-white">Style DNA Profiling:</strong> Build a comprehensive style profile based on your preferences and behavior
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mt-1.5 flex-shrink-0 shadow-lg"></div>
                  <div className="text-gold-100">
                    <strong className="text-white">Instant Shopping:</strong> Seamlessly shop curated looks with one-click purchase integration
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mt-1.5 flex-shrink-0 shadow-lg"></div>
                  <div className="text-gold-100">
                    <strong className="text-white">Personal Stylist:</strong> Get expert recommendations based on your discovered style preferences
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mt-1.5 flex-shrink-0 shadow-lg"></div>
                  <div className="text-gold-100">
                    <strong className="text-white">Exclusive Access:</strong> Early access to new collections and personalized style events
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Live Analytics */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gold-100">
              <h3 className="text-2xl font-serif mb-6 text-black-800">
                <Star className="w-6 h-6 inline-block mr-3 text-gold" />
                Live Style Analytics
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {swipeData.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-burgundy" />
                    </div>
                    <p className="text-black-500 text-lg">Start discovering your style</p>
                    <p className="text-black-400 text-sm mt-1">Swipe through looks to build your profile</p>
                  </div>
                ) : (
                  swipeData.slice(-8).reverse().map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gold-50 rounded-xl border border-gold-100 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          data.direction === 'right' ? 'bg-green-500' : 'bg-red-400'
                        }`}></div>
                        <span className="text-sm font-medium text-black-700">
                          <span className="capitalize font-bold">{data.category}</span> style
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                          data.direction === 'right' 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-red-700 bg-red-100'
                        }`}>
                          {data.direction === 'right' ? '💖 Loved' : '❌ Passed'}
                        </span>
                        {data.velocity && (
                          <span className="text-xs text-burgundy font-medium bg-burgundy-100 px-2 py-1 rounded-full">
                            {Math.abs(data.velocity).toFixed(0)}px/s
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {swipeData.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-black-600">
                    <strong>{swipeData.length}</strong> style discoveries
                  </div>
                  <button
                    onClick={() => setSwipeData([])}
                    className="text-sm text-burgundy hover:text-burgundy-600 font-medium bg-burgundy-50 hover:bg-burgundy-100 px-3 py-1 rounded-full transition-all"
                  >
                    Reset Session
                  </button>
                </div>
              )}
            </div>

            {/* Premium Actions */}
            <div className="bg-gradient-to-br from-gold-50 via-white to-burgundy-50 rounded-3xl shadow-2xl p-8 border border-gold-200">
              <h3 className="text-2xl font-serif mb-6 text-black-800">
                <Trophy className="w-6 h-6 inline-block mr-3 text-gold" />
                Your Style Journey
              </h3>
              <div className="space-y-4">
                <Link 
                  href="/admin/style-swiper"
                  className="group block w-full bg-gradient-to-r from-burgundy to-burgundy-600 hover:from-burgundy-600 hover:to-burgundy-700 text-white py-4 rounded-xl font-semibold text-center transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl border border-burgundy-400"
                >
                  <Crown className="w-5 h-5 inline-block mr-2 group-hover:rotate-12 transition-transform" />
                  Curate Your Collection
                </Link>
                <button
                  onClick={resetDemo}
                  className="block w-full bg-white hover:bg-gold-50 text-black-700 py-4 rounded-xl font-semibold border border-gold-300 hover:border-gold-400 transition-all shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-5 h-5 inline-block mr-2" />
                  Start Fresh Discovery
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-white/70 rounded-xl border border-gold-200">
                <p className="font-semibold mb-3 text-black-700 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-burgundy" />
                  Build Your Style Empire:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center text-black-600">
                    <div className="w-2 h-2 bg-burgundy rounded-full mr-2"></div>
                    Discover preferences
                  </div>
                  <div className="flex items-center text-black-600">
                    <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
                    Get recommendations
                  </div>
                  <div className="flex items-center text-black-600">
                    <div className="w-2 h-2 bg-burgundy rounded-full mr-2"></div>
                    Shop curated looks
                  </div>
                  <div className="flex items-center text-black-600">
                    <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
                    Build style DNA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Completed Profiles */}
        {completedProfiles.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-white via-gold-50 to-burgundy-50 rounded-3xl shadow-2xl p-8 border border-gold-200">
            <h3 className="text-3xl font-serif mb-8 text-center text-black-800">
              <Crown className="w-8 h-8 inline-block mr-3 text-gold" />
              Your Style DNA Results
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {completedProfiles.map((profile, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 border border-gold-100 hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg text-black-800">
                      {profile.category === 'all' ? 'Complete Style Profile' : `${profile.category} Specialist`}
                    </h4>
                    <div className="bg-gradient-to-r from-gold-400 to-burgundy-400 w-10 h-10 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gold-50 to-burgundy-50 p-4 rounded-xl mb-4">
                    <p className="text-center text-2xl font-bold text-burgundy mb-1">
                      {profile.likedImages.length}
                    </p>
                    <p className="text-center text-sm text-black-600">Curated Favorites</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                    <div className="text-center p-2 bg-gold-50 rounded-lg border border-gold-100">
                      <p className="font-semibold text-black-700">Total Swipes</p>
                      <p className="text-lg font-bold text-burgundy">{profile.analytics.totalSwipes}</p>
                    </div>
                    <div className="text-center p-2 bg-burgundy-50 rounded-lg border border-burgundy-100">
                      <p className="font-semibold text-black-700">Love Rate</p>
                      <p className="text-lg font-bold text-gold">
                        {((profile.analytics.rightSwipes / profile.analytics.totalSwipes) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(profile.analytics.categoryPreferences)
                      .filter(([_, score]) => score > 0)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 4)
                      .map(([cat, score]) => (
                        <span key={cat} className="bg-gradient-to-r from-burgundy-100 to-gold-100 text-burgundy font-medium px-3 py-1 rounded-full text-xs border border-burgundy-200">
                          {cat}: +{score}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Size Bot Modal */}
      {showSizeBot && (
        <EnhancedSizeBot
          onClose={() => setShowSizeBot(false)}
          onSizeSelected={(recommendation) => {
            setUserSize(recommendation);
            setShowSizeBot(false);
          }}
          productType="suit"
        />
      )}

      {/* Atelier AI Smart Tips */}
      <SmartTips
        pageContext="style-swiper"
        swipeCount={swipeData.length}
        likedItems={likedImages}
      />
    </div>
  );
}