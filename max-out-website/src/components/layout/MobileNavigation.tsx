"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import '@/styles/mobile-navigation.css';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  X,
  Search,
  ShoppingBag,
  Heart,
  User,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Crown,
  Zap,
  Gift,
  Calendar,
  Users,
  Shirt,
  Settings,
  Award,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/lib/hooks/useCart';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { Button } from '@/components/ui/button';

// Enhanced TypeScript interfaces
export interface MobileNavItem {
  id: string;
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    type: 'new' | 'hot' | 'sale' | 'trending';
    color: string;
  };
  children?: MobileNavItem[];
  isExternal?: boolean;
  description?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  color: string;
}

interface RecentItem {
  id: string;
  name: string;
  href: string;
  image?: string;
  type: 'product' | 'category' | 'search';
}

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

// Enhanced navigation data with modern structure
const navigationData: MobileNavItem[] = [
  {
    id: 'shop',
    href: '/products',
    label: 'Shop All',
    icon: Shirt,
    description: 'Browse our complete collection',
    children: [
      { id: 'suits', href: '/products/suits', label: 'Suits', badge: { text: 'TRENDING', type: 'trending', color: 'bg-emerald-500' } },
      { id: 'dress-shirts', href: '/collections/dress-shirts', label: 'Dress Shirts', badge: { text: 'NEW', type: 'new', color: 'bg-blue-500' } },
      { id: 'ties', href: '/collections/ties', label: 'Ties & Bowties', badge: { text: 'HOT', type: 'hot', color: 'bg-red-500' } },
      { id: 'tuxedos', href: '/products/tuxedos', label: 'Tuxedos' },
      { id: 'accessories', href: '/collections/accessories', label: 'Accessories' }
    ]
  },
  {
    id: 'occasions',
    href: '/occasions',
    label: 'Occasions',
    icon: Calendar,
    description: 'Perfect looks for every event',
    children: [
      { id: 'wedding', href: '/weddings', label: 'Wedding', icon: Users },
      { id: 'prom', href: '/prom-collection', label: 'Prom', badge: { text: 'HOT', type: 'hot', color: 'bg-pink-500' } },
      { id: 'cocktail', href: '/occasions/cocktail', label: 'Cocktail' },
      { id: 'business', href: '/occasions/business', label: 'Business' }
    ]
  },
  {
    id: 'custom',
    href: '/custom-suits',
    label: 'Custom Suits',
    icon: Crown,
    description: 'Tailored to perfection',
    badge: { text: 'LUXURY', type: 'new', color: 'bg-amber-500' }
  },
  {
    id: 'atelier-ai',
    href: '/atelier-ai',
    label: 'Atelier AI',
    icon: Sparkles,
    description: 'AI-powered styling assistant',
    badge: { text: 'AI', type: 'new', color: 'bg-violet-500' }
  },
  {
    id: 'style-quiz',
    href: '/style-quiz',
    label: "Stylin' Profilin'",
    icon: Palette,
    description: 'Discover your style DNA'
  }
];

const quickActions: QuickAction[] = [
  {
    id: 'call',
    label: 'Call Store',
    icon: Phone,
    action: () => window.open('tel:+13135252424'),
    color: 'bg-green-500'
  },
  {
    id: 'directions',
    label: 'Directions',
    icon: MapPin,
    action: () => window.open('https://maps.google.com/?q=KCT+Menswear+Detroit'),
    color: 'bg-blue-500'
  },
  {
    id: 'book',
    label: 'Book Now',
    icon: Calendar,
    action: () => window.open('/contact'),
    color: 'bg-burgundy-500'
  }
];

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [recentItems] = useState<RecentItem[]>([
    { id: '1', name: 'Navy Suit', href: '/products/suits/navy-suit', type: 'product' },
    { id: '2', name: 'White Dress Shirt', href: '/collections/dress-shirts/white', type: 'product' },
    { id: '3', name: 'Burgundy Tie', href: '/collections/ties/burgundy', type: 'product' }
  ]);
  
  const router = useRouter();
  const pathname = usePathname();
  const { cartSummary } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle escape key and focus management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Focus first interactive element
      setTimeout(() => {
        const firstButton = menuRef.current?.querySelector('button, a');
        if (firstButton instanceof HTMLElement) {
          firstButton.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Haptic feedback simulation
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Handle swipe to close
  const handlePanEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      onClose();
      triggerHaptic();
    }
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
    triggerHaptic();
  };

  // Handle navigation
  const handleNavigation = (href: string, isExternal = false) => {
    if (isExternal) {
      window.open(href, '_blank');
    } else {
      router.push(href);
    }
    onClose();
    triggerHaptic();
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  // Render badge component
  const renderBadge = (badge: MobileNavItem['badge']) => {
    if (!badge) return null;
    return (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn(
          'px-2 py-1 text-xs font-bold text-white rounded-full',
          badge.color
        )}
      >
        {badge.text}
      </motion.span>
    );
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const menuVariants = {
    hidden: { 
      x: '-100%',
      transition: { type: 'tween', duration: 0.3 }
    },
    visible: { 
      x: '0%',
      transition: { type: 'tween', duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop with glassmorphism */}
          <motion.div
            ref={overlayRef}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            onClick={onClose}
          />
          
          {/* Main menu panel */}
          <motion.div
            ref={menuRef}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onPanEnd={handlePanEnd}
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm mobile-nav-glass shadow-2xl"
          >
            {/* Header */}
            <div className="relative p-6 pb-4">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
              
              {/* Logo and greeting */}
              <div className="pr-12">
                <h2 className="text-2xl font-bold text-black mb-1">
                  KCT <span style={{ color: 'var(--burgundy)' }}>Menswear</span>
                </h2>
                <p className="text-sm text-gray-600">Luxury redefined</p>
              </div>
            </div>

            {/* Search bar */}
            <div className="px-6 mb-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </form>
            </div>

            {/* Quick stats */}
            <div className="px-6 mb-6">
              <div className="grid grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation('/cart')}
                  className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl relative"
                >
                  <ShoppingBag className="h-6 w-6 text-gray-600 mb-1" />
                  <span className="text-xs text-gray-600 font-medium">Cart</span>
                  {cartSummary.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartSummary.itemCount}
                    </span>
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation('/account/wishlist')}
                  className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                >
                  <Heart className="h-6 w-6 text-gray-600 mb-1" />
                  <span className="text-xs text-gray-600 font-medium">Wishlist</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation('/account')}
                  className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                >
                  <User className="h-6 w-6 text-gray-600 mb-1" />
                  <span className="text-xs text-gray-600 font-medium">Account</span>
                </motion.button>
              </div>
            </div>

            {/* Main navigation */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Featured section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Featured
                </h3>
                
                {/* Atelier AI highlight */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation('/atelier-ai')}
                  className="w-full p-4 mobile-nav-gradient-primary rounded-xl text-white mb-3 relative overflow-hidden mobile-nav-glow-burgundy"
                >
                  <div className="absolute inset-0 bg-white/10 rounded-xl mobile-nav-shimmer" />
                  <div className="relative flex items-center">
                    <Sparkles className="h-6 w-6 mr-3 mobile-nav-float" />
                    <div className="text-left">
                      <div className="font-semibold mobile-nav-text-luxury">Atelier AI</div>
                      <div className="text-xs opacity-90">AI-powered styling</div>
                    </div>
                    <div className="ml-auto">
                      <Zap className="h-5 w-5" />
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Main navigation items */}
              <div className="space-y-2">
                {navigationData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {item.children ? (
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleCategory(item.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            {item.icon && (
                              <item.icon className="h-5 w-5 text-gray-600 mr-3" />
                            )}
                            <div className="text-left">
                              <div className="font-medium text-gray-900">{item.label}</div>
                              {item.description && (
                                <div className="text-xs text-gray-500">{item.description}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {renderBadge(item.badge)}
                            <ChevronDown 
                              className={cn(
                                'h-5 w-5 text-gray-400 ml-2 transition-transform',
                                expandedCategories.has(item.id) && 'rotate-180'
                              )}
                            />
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {expandedCategories.has(item.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-gray-50 border-t border-gray-200"
                            >
                              {item.children.map((child) => (
                                <motion.button
                                  key={child.id}
                                  whileHover={{ x: 4 }}
                                  onClick={() => handleNavigation(child.href)}
                                  className="w-full flex items-center justify-between p-3 pl-12 hover:bg-white transition-colors text-left"
                                >
                                  <div className="flex items-center">
                                    {child.icon && (
                                      <child.icon className="h-4 w-4 text-gray-500 mr-2" />
                                    )}
                                    <span className="text-gray-700">{child.label}</span>
                                  </div>
                                  <div className="flex items-center">
                                    {renderBadge(child.badge)}
                                    <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                                  </div>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation(item.href, item.isExternal)}
                        className="w-full flex items-center justify-between p-4 mobile-nav-card-shadow rounded-xl hover:mobile-nav-gradient-accent transition-colors mobile-nav-ripple mobile-nav-haptic mobile-nav-focus"
                      >
                        <div className="flex items-center">
                          {item.icon && (
                            <item.icon className="h-5 w-5 text-gray-600 mr-3" />
                          )}
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-gray-500">{item.description}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {renderBadge(item.badge)}
                          <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
                        </div>
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Recently viewed */}
              {recentItems.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Recently Viewed
                  </h3>
                  <div className="space-y-2">
                    {recentItems.map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ x: 4 }}
                        onClick={() => handleNavigation(item.href)}
                        className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          <Shirt className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{item.type}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={action.action}
                      className={cn(
                        'flex flex-col items-center p-3 rounded-xl text-white',
                        action.color
                      )}
                    >
                      <action.icon className="h-6 w-6 mb-1" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Social proof */}
              <div className="mt-8 p-4 mobile-nav-gradient-secondary rounded-xl mobile-nav-glow-gold text-white">
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="text-sm font-semibold mobile-nav-text-luxury">4.9/5 Rating</span>
                </div>
                <p className="text-xs opacity-90">
                  Over 5,000 satisfied customers trust KCT Menswear
                </p>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="p-6 pt-0">
              <Button
                onClick={() => handleNavigation('/contact')}
                className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-semibold py-4 rounded-xl shadow-lg transform transition-all hover:scale-105"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Appointment
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}