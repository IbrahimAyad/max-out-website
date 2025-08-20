"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Ruler, 
  Palette, 
  MapPin, 
  Settings,
  Bell,
  CreditCard,
  Shield,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';

// Import all profile components
import EnhancedProfileDashboard from './EnhancedProfileDashboard';
import InteractiveSizeProfile from './InteractiveSizeProfile';
import StyleDNASection from './StyleDNASection';
import SmartAddressesSection from './SmartAddressesSection';
import { 
  LuxuryButton, 
  LuxuryCard, 
  luxuryAnimations,
  LuxuryStagger,
  LuxuryReveal 
} from './LuxuryMicroInteractions';

// Import services
import { enhancedUserProfileService, type EnhancedUserProfile } from '@/lib/services/enhancedUserProfileService';

interface EnhancedProfilePageProps {
  initialSection?: string;
}

export default function EnhancedProfilePage({ initialSection = 'dashboard' }: EnhancedProfilePageProps) {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [profile, setProfile] = useState<EnhancedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const profileSections = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Overview and quick stats',
      icon: User,
      component: EnhancedProfileDashboard,
      color: 'from-blue-500 to-blue-600',
      badge: null
    },
    {
      id: 'measurements',
      name: 'Size Profile',
      description: 'Body measurements and fit preferences',
      icon: Ruler,
      component: InteractiveSizeProfile,
      color: 'from-green-500 to-green-600',
      badge: profile?.size_profile?.chest ? null : 'New'
    },
    {
      id: 'style-dna',
      name: 'Style DNA',
      description: 'Your unique fashion identity',
      icon: Palette,
      component: StyleDNASection,
      color: 'from-purple-500 to-purple-600',
      badge: (profile?.style_dna?.signature_colors?.length || 0) < 3 ? 'Incomplete' : null
    },
    {
      id: 'addresses',
      name: 'Address Book',
      description: 'Shipping and billing addresses',
      icon: MapPin,
      component: SmartAddressesSection,
      color: 'from-orange-500 to-orange-600',
      badge: (profile?.address_book?.length || 0) === 0 ? 'Empty' : null
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'Manage your preferences',
      icon: Bell,
      component: NotificationSettings,
      color: 'from-yellow-500 to-yellow-600',
      badge: notifications.length > 0 ? notifications.length : null
    },
    {
      id: 'payment',
      name: 'Payment Methods',
      description: 'Saved cards and billing',
      icon: CreditCard,
      component: PaymentSettings,
      color: 'from-indigo-500 to-indigo-600',
      badge: null
    },
    {
      id: 'privacy',
      name: 'Privacy & Security',
      description: 'Account security settings',
      icon: Shield,
      component: PrivacySettings,
      color: 'from-red-500 to-red-600',
      badge: null
    }
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await enhancedUserProfileService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const handleProfileUpdate = async (updates: any) => {
    try {
      await enhancedUserProfileService.updateProfile(updates);
      await loadProfile(); // Refresh profile
      return true;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  };

  const currentSection = profileSections.find(section => section.id === activeSection);

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">Profile</h1>
              <p className="text-sm text-gray-600">{currentSection?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <ProfileSidebar
          sections={profileSections}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          profile={profile}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 lg:pl-80">
          <div className="p-4 lg:p-8">
            <LuxuryReveal>
              {/* Breadcrumb Navigation */}
              <div className="hidden lg:flex items-center space-x-3 mb-8">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Profile
                </button>
                <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
                <span className="text-gray-900 font-medium">{currentSection?.name}</span>
              </div>
            </LuxuryReveal>

            {/* Section Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={luxuryAnimations.pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {activeSection === 'dashboard' && (
                  <EnhancedProfileDashboard
                    onSectionChange={handleSectionChange}
                    activeSection={activeSection}
                  />
                )}
                
                {activeSection === 'measurements' && (
                  <InteractiveSizeProfile
                    initialData={profile?.size_profile}
                    onSave={async (sizeProfile) => {
                      await enhancedUserProfileService.updateSizeProfile(sizeProfile);
                      await loadProfile();
                    }}
                  />
                )}
                
                {activeSection === 'style-dna' && (
                  <StyleDNASection
                    initialData={profile?.style_dna}
                    onSave={async (styleDNA) => {
                      await enhancedUserProfileService.updateStyleDNA(styleDNA);
                      await loadProfile();
                    }}
                  />
                )}
                
                {activeSection === 'addresses' && (
                  <SmartAddressesSection
                    addresses={profile?.address_book}
                    onAddressesChange={async (addresses) => {
                      setProfile(prev => prev ? { ...prev, address_book: addresses } : null);
                    }}
                  />
                )}
                
                {activeSection === 'notifications' && (
                  <NotificationSettings profile={profile} onUpdate={handleProfileUpdate} />
                )}
                
                {activeSection === 'payment' && (
                  <PaymentSettings profile={profile} onUpdate={handleProfileUpdate} />
                )}
                
                {activeSection === 'privacy' && (
                  <PrivacySettings profile={profile} onUpdate={handleProfileUpdate} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Sidebar Component
function ProfileSidebar({ 
  sections, 
  activeSection, 
  onSectionChange, 
  profile,
  isOpen,
  onClose 
}: {
  sections: any[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  profile: EnhancedUserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const profileCompletionScore = profile?.profile_completion_score || 0;
  
  return (
    <motion.div
      className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50
        w-80 transform transition-transform lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      initial={false}
      animate={{ x: isOpen ? 0 : -320 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B2635] to-[#6B1C28] rounded-xl flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {profile?.display_name || profile?.full_name || 'Your Profile'}
              </h2>
              <p className="text-sm text-gray-600">
                {profileCompletionScore}% Complete
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 bg-gradient-to-r from-[#8B2635] to-[#D4AF37] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${profileCompletionScore}%` }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-6 overflow-y-auto">
        <LuxuryStagger stagger={0.05}>
          {sections.map((section, index) => {
            const isActive = section.id === activeSection;
            
            return (
              <motion.button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`
                  w-full flex items-center space-x-4 px-6 py-4 text-left transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#8B2635]/10 to-transparent border-r-4 border-[#8B2635] text-[#8B2635]'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  }
                `}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`
                  p-2 rounded-xl transition-colors
                  ${isActive 
                    ? `bg-gradient-to-r ${section.color}` 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <section.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{section.name}</h3>
                    {section.badge && (
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${section.badge === 'New' 
                          ? 'bg-green-100 text-green-700'
                          : section.badge === 'Incomplete'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                        }
                      `}>
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                </div>
              </motion.button>
            );
          })}
        </LuxuryStagger>
      </div>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="space-y-3">
          <LuxuryButton
            variant="outline"
            size="small"
            className="w-full"
            icon={<Settings className="w-4 h-4" />}
          >
            Account Settings
          </LuxuryButton>
          
          <div className="text-xs text-gray-500 text-center">
            <p>Need help? <a href="/support" className="text-[#8B2635] hover:underline">Contact Support</a></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Placeholder components for additional sections
function NotificationSettings({ profile, onUpdate }: { profile: any; onUpdate: any }) {
  return (
    <LuxuryCard className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
      <div className="space-y-6">
        <p className="text-gray-600">Manage how you receive notifications from KCT Menswear.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Email Notifications</h3>
            <div className="space-y-3">
              {[
                'Order updates',
                'New arrivals',
                'Style recommendations',
                'Sales & promotions'
              ].map((item) => (
                <label key={item} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-[#8B2635] border-gray-300 rounded focus:ring-[#8B2635]"
                  />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
            <div className="space-y-3">
              {[
                'Shipping updates',
                'Appointment reminders',
                'Urgent alerts'
              ].map((item) => (
                <label key={item} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#8B2635] border-gray-300 rounded focus:ring-[#8B2635]"
                  />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t">
          <LuxuryButton>Save Preferences</LuxuryButton>
        </div>
      </div>
    </LuxuryCard>
  );
}

function PaymentSettings({ profile, onUpdate }: { profile: any; onUpdate: any }) {
  return (
    <LuxuryCard className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Payment Methods</h2>
        <LuxuryButton variant="outline" size="small">
          Add Payment Method
        </LuxuryButton>
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-600">Manage your saved payment methods and billing information.</p>
        
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No Payment Methods</h3>
          <p className="text-gray-600 mb-4">Add a payment method to make checkout faster and easier.</p>
          <LuxuryButton>Add Your First Card</LuxuryButton>
        </div>
      </div>
    </LuxuryCard>
  );
}

function PrivacySettings({ profile, onUpdate }: { profile: any; onUpdate: any }) {
  return (
    <LuxuryCard className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
      <div className="space-y-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Data Privacy</h3>
          <div className="space-y-3">
            {[
              'Share size and fit data for recommendations',
              'Allow personalized marketing',
              'Include in style research (anonymous)',
              'Share purchase history with stylists'
            ].map((item) => (
              <label key={item} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked={item.includes('recommendations')}
                  className="w-4 h-4 text-[#8B2635] border-gray-300 rounded focus:ring-[#8B2635]"
                />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Account Security</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-800">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Two-factor authentication enabled</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <LuxuryButton variant="outline" size="small">
                Change Password
              </LuxuryButton>
              <LuxuryButton variant="outline" size="small">
                Download Data
              </LuxuryButton>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t">
          <LuxuryButton>Save Privacy Settings</LuxuryButton>
        </div>
      </div>
    </LuxuryCard>
  );
}

// Profile Page Skeleton
function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-80 bg-white border-r border-gray-200">
          <div className="p-6 space-y-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded" />
                <div className="w-16 h-3 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded" />
          </div>
          
          <div className="p-6 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                  <div className="w-32 h-3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 p-8">
          <div className="space-y-6 animate-pulse">
            <div className="w-64 h-8 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

