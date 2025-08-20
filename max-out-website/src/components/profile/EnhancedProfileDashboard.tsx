"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Ruler, 
  Palette, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Camera,
  Edit3,
  Award,
  Target,
  Eye,
  Settings,
  ChevronRight,
  Plus,
  Check
} from 'lucide-react';

import { enhancedUserProfileService, type EnhancedUserProfile } from '@/lib/services/enhancedUserProfileService';

interface ProfileDashboardProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
}

export default function EnhancedProfileDashboard({ onSectionChange, activeSection }: ProfileDashboardProps) {
  const [profile, setProfile] = useState<EnhancedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await enhancedUserProfileService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return <ProfileDashboardSkeleton />;
  }

  const completionSections = [
    {
      id: 'basic',
      name: 'Basic Info',
      icon: User,
      progress: profile.full_name && profile.avatar_url ? 100 : 50,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'measurements',
      name: 'Size Profile',
      icon: Ruler,
      progress: calculateSizeProfileProgress(profile.size_profile),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'style-dna',
      name: 'Style DNA',
      icon: Palette,
      progress: calculateStyleDNAProgress(profile.style_dna),
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'addresses',
      name: 'Addresses',
      icon: MapPin,
      progress: profile.address_book?.length > 0 ? 100 : 0,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const quickStats = [
    {
      id: 'orders',
      label: 'Total Orders',
      value: profile.total_orders || 0,
      icon: ShoppingBag,
      change: '+12%',
      changeType: 'positive' as const,
      color: 'bg-black'
    },
    {
      id: 'wishlist',
      label: 'Wishlist Items',
      value: profile.wishlist_items?.length || 0,
      icon: Heart,
      change: '+3 this week',
      changeType: 'positive' as const,
      color: 'bg-[#8B2635]'
    },
    {
      id: 'style-score',
      label: 'Style Score',
      value: profile.style_score || 0,
      icon: Star,
      change: '+15 pts',
      changeType: 'positive' as const,
      color: 'bg-[#D4AF37]'
    },
    {
      id: 'loyalty',
      label: 'Loyalty Points',
      value: profile.loyalty_points || 0,
      icon: Award,
      change: '+240 pts',
      changeType: 'positive' as const,
      color: 'bg-gradient-to-r from-[#8B2635] to-[#D4AF37]'
    }
  ];

  const profileSections = [
    {
      id: 'basic-info',
      title: 'Personal Information',
      description: 'Manage your basic profile details',
      icon: User,
      completionStatus: profile.full_name ? 'complete' : 'incomplete',
      action: 'Edit Profile'
    },
    {
      id: 'measurements',
      title: 'Size & Measurements',
      description: 'Your body measurements and fit preferences',
      icon: Ruler,
      completionStatus: profile.size_profile?.chest ? 'complete' : 'incomplete',
      action: 'Update Measurements'
    },
    {
      id: 'style-dna',
      title: 'Style DNA',
      description: 'Your unique style profile and preferences',
      icon: Palette,
      completionStatus: profile.style_dna?.signature_colors?.length ? 'complete' : 'incomplete',
      action: 'Define Style'
    },
    {
      id: 'addresses',
      title: 'Address Book',
      description: 'Manage shipping and billing addresses',
      icon: MapPin,
      completionStatus: profile.address_book?.length > 0 ? 'complete' : 'incomplete',
      action: 'Add Address'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 pb-safe"
    >
      {/* Profile Header */}
      <ProfileHeader profile={profile} onUploadAvatar={() => {}} />
      
      {/* Profile Completion Ring */}
      <CompletionProgressRing 
        sections={completionSections} 
        overallProgress={profile.profile_completion_score || 0}
      />
      
      {/* Quick Stats */}
      <QuickStats 
        stats={quickStats}
        hoveredStat={hoveredStat}
        onStatHover={setHoveredStat}
      />
      
      {/* Profile Sections */}
      <ProfileSectionCards
        sections={profileSections}
        onSectionClick={onSectionChange}
        activeSection={activeSection}
      />
      
      {/* Style Insights Preview */}
      <StyleInsightsPreview profile={profile} />
    </motion.div>
  );
}

// Profile Header Component
function ProfileHeader({ profile, onUploadAvatar }: { profile: EnhancedUserProfile; onUploadAvatar: () => void }) {
  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-gray-900 to-[#8B2635] p-8 text-white"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-gray-100 to-transparent" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <motion.div 
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={onUploadAvatar}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.display_name || profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
            </div>
            <motion.div 
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <Camera className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
          
          {/* Profile Info */}
          <div>
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {profile.display_name || profile.full_name || 'Complete Your Profile'}
            </motion.h1>
            <motion.p 
              className="text-white/80 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {profile.bio || 'Fashion enthusiast | Style discoverer'}
            </motion.p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{profile.location || 'Location not set'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(profile.created_at).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Edit Button */}
        <motion.button
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// Completion Progress Ring Component
function CompletionProgressRing({ sections, overallProgress }: { 
  sections: any[]; 
  overallProgress: number; 
}) {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Profile Completion</h2>
        <span className="text-3xl font-bold text-[#8B2635]">{overallProgress}%</span>
      </div>
      
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - overallProgress / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - overallProgress / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B2635" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Target className="w-8 h-8 text-[#8B2635] mb-2" />
            <span className="text-sm text-gray-500">Complete</span>
          </div>
        </div>
        
        {/* Section Progress */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{section.name}</span>
                    <span className="text-sm font-semibold text-gray-600">{section.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${section.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${section.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + 0.1 * index }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Quick Stats Component
function QuickStats({ stats, hoveredStat, onStatHover }: {
  stats: any[];
  hoveredStat: string | null;
  onStatHover: (id: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          className={`relative overflow-hidden rounded-2xl p-6 text-white cursor-pointer ${stat.color}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          onMouseEnter={() => onStatHover(stat.id)}
          onMouseLeave={() => onStatHover(null)}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-4 -right-4">
              <stat.icon className="w-24 h-24" />
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-6 h-6" />
              <AnimatePresence>
                {hoveredStat === stat.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-xs bg-black/20 px-2 py-1 rounded-full"
                  >
                    {stat.change}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="space-y-1">
              <motion.div 
                className="text-3xl font-bold"
                key={stat.value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {typeof stat.value === 'number' && stat.value > 999 
                  ? `${(stat.value / 1000).toFixed(1)}k` 
                  : stat.value}
              </motion.div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Profile Section Cards Component
function ProfileSectionCards({ sections, onSectionClick, activeSection }: {
  sections: any[];
  onSectionClick: (section: string) => void;
  activeSection: string;
}) {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900">Profile Sections</h2>
        <p className="text-gray-600 mt-1">Complete your profile to unlock personalized recommendations</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
            onClick={() => onSectionClick(section.id)}
            whileHover={{ x: 4 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${
                  section.completionStatus === 'complete' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                } group-hover:scale-110 transition-transform`}>
                  <section.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#8B2635] transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {section.completionStatus === 'complete' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete</span>
                  </motion.div>
                ) : (
                  <span className="text-sm font-medium text-[#8B2635] bg-[#8B2635]/10 px-3 py-1 rounded-full">
                    {section.action}
                  </span>
                )}
                
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#8B2635] transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Style Insights Preview Component
function StyleInsightsPreview({ profile }: { profile: EnhancedUserProfile }) {
  const insights = [
    {
      title: 'Your Style Archetype',
      value: profile.style_dna?.style_archetypes?.[0]?.name || 'Classic Gentleman',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Fit Preference',
      value: profile.size_profile?.preferred_fit?.jackets || 'Regular',
      icon: Ruler,
      color: 'text-blue-600'
    },
    {
      title: 'Color Confidence',
      value: `${profile.style_dna?.style_confidence_level || 70}% Confident`,
      icon: Eye,
      color: 'text-green-600'
    }
  ];

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Style Insights</h2>
          <p className="text-gray-600 text-sm mt-1">AI-powered analysis of your fashion profile</p>
        </div>
        <motion.button
          className="text-[#8B2635] hover:bg-[#8B2635]/10 p-2 rounded-lg transition-colors"
          whileHover={{ rotate: 90 }}
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center space-x-3">
              <insight.icon className={`w-5 h-5 ${insight.color}`} />
              <div>
                <p className="text-sm text-gray-600">{insight.title}</p>
                <p className="font-semibold text-gray-900">{insight.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Skeleton Loading Component
function ProfileDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-48 bg-gray-200 rounded-2xl" />
      
      {/* Progress Ring Skeleton */}
      <div className="h-64 bg-gray-200 rounded-2xl" />
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      
      {/* Sections Skeleton */}
      <div className="h-96 bg-gray-200 rounded-2xl" />
    </div>
  );
}

// Helper functions
function calculateSizeProfileProgress(sizeProfile: any): number {
  if (!sizeProfile) return 0;
  
  const requiredFields = ['chest', 'waist', 'inseam', 'neck'];
  const completedFields = requiredFields.filter(field => sizeProfile[field] !== undefined);
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
}

function calculateStyleDNAProgress(styleDNA: any): number {
  if (!styleDNA) return 0;
  
  let progress = 0;
  if (styleDNA.signature_colors?.length > 0) progress += 25;
  if (styleDNA.style_archetypes?.length > 0) progress += 25;
  if (styleDNA.occasion_priorities?.length > 0) progress += 25;
  if (styleDNA.budget_ranges?.length > 0) progress += 25;
  
  return progress;
}

// Missing Calendar import (using a placeholder)
function Calendar({ className }: { className?: string }) {
  return <div className={className}>📅</div>;
}