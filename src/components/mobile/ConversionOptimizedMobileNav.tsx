"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  X, Search, ShoppingBag, Heart, User, ChevronRight, ChevronDown,
  Sparkles, Star, TrendingUp, Clock, MapPin, Phone, Calendar,
  Users, Shirt, Ruler, Award, Palette, Filter, Home, Gift,
  MessageCircle, Zap, Crown, Camera, Target, BookOpen,
  ThumbsUp, Shield, Percent, ArrowRight, Play
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/lib/hooks/useCart';
import { Button } from '@/components/ui/button';

interface ConversionOptimizedMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

// Event-based navigation structure (The Black Tux insight)
const eventBasedNavigation = [
  {
    id: 'wedding-season',
    label: 'Wedding Season',
    icon: Users,
    gradient: 'from-rose-500 to-pink-600',
    description: 'Perfect looks for your special day',
    urgency: 'Book now for spring dates',
    featured: true,
    visual: '/api/placeholder/120/80',
    children: [
      { 
        id: 'groom', 
        label: 'For the Groom', 
        href: '/wedding/groom',
        badge: { text: 'TRENDING', color: 'bg-emerald-500' },
        description: 'Classic & modern tuxedos',
        visual: '/api/placeholder/60/60'
      },
      { 
        id: 'groomsmen', 
        label: 'Groomsmen', 
        href: '/wedding/groomsmen',
        description: 'Coordinated party looks',
        visual: '/api/placeholder/60/60'
      },
      { 
        id: 'wedding-guest', 
        label: 'Wedding Guest', 
        href: '/wedding/guest',
        badge: { text: 'POPULAR', color: 'bg-blue-500' },
        description: 'Elegant guest attire',
        visual: '/api/placeholder/60/60'
      }
    ]
  },
  {
    id: 'prom-2025',
    label: 'Prom 2025',
    icon: Star,
    gradient: 'from-purple-500 to-indigo-600',
    description: 'Stand out at your prom',
    urgency: 'Early bird special ends soon',
    featured: true,
    visual: '/api/placeholder/120/80',
    children: [
      { 
        id: 'classic-tuxedo', 
        label: 'Classic Tuxedo', 
        href: '/prom/classic',
        description: 'Timeless elegance',
        visual: '/api/placeholder/60/60'
      },
      { 
        id: 'modern-colors', 
        label: 'Modern Colors', 
        href: '/prom/colors',
        badge: { text: 'HOT', color: 'bg-pink-500' },
        description: 'Bold & contemporary',
        visual: '/api/placeholder/60/60'
      },
      { 
        id: 'accessories', 
        label: 'Prom Accessories', 
        href: '/prom/accessories',
        description: 'Complete the look',
        visual: '/api/placeholder/60/60'
      }
    ]
  },
  {
    id: 'business-professional',
    label: 'Business Professional',
    icon: Award,
    gradient: 'from-slate-600 to-slate-700',
    description: 'Power suits for success',
    featured: false,
    children: [
      { 
        id: 'executive-suits', 
        label: 'Executive Suits', 
        href: '/business/executive',
        badge: { text: 'BEST SELLER', color: 'bg-emerald-500' },
        description: 'C-suite ready',
        visual: '/api/placeholder/60/60'
      },
      { 
        id: 'interview-ready', 
        label: 'Interview Ready', 
        href: '/business/interview',
        description: 'Make the right impression',
        visual: '/api/placeholder/60/60'
      }
    ]
  }
];

// AI-powered features (KCT differentiators)
const aiFeatures = [
  {
    id: 'size-predictor',
    label: 'AI Size Predictor',
    icon: Target,
    href: '/ai/size-predictor',
    description: 'Perfect fit guaranteed',
    gradient: 'from-blue-500 to-blue-600',
    badge: '99% Accurate'
  },
  {
    id: 'style-consultant',
    label: 'Virtual Stylist',
    icon: Sparkles,
    href: '/ai/stylist',
    description: 'AI-powered recommendations',
    gradient: 'from-purple-500 to-purple-600',
    badge: 'NEW'
  },
  {
    id: 'fit-scanner',
    label: 'Body Fit Scanner',
    icon: Camera,
    href: '/ai/fit-scanner',
    description: 'Scan for perfect measurements',
    gradient: 'from-emerald-500 to-emerald-600',
    badge: 'BETA'
  }
];

// Popular products with visuals (Suitsupply insight)
const popularProducts = [
  {
    id: 'navy-wedding-suit',
    name: 'Navy Wedding Suit',
    price: '$495',
    originalPrice: '$695',
    image: '/api/placeholder/80/80',
    href: '/products/navy-wedding-suit',
    badge: 'BEST SELLER',
    rating: 4.9
  },
  {
    id: 'black-tuxedo',
    name: 'Classic Black Tuxedo',
    price: '$595',
    image: '/api/placeholder/80/80',
    href: '/products/black-tuxedo',
    badge: 'TRENDING',
    rating: 4.8
  },
  {
    id: 'burgundy-vest',
    name: 'Burgundy Silk Vest',
    price: '$95',
    originalPrice: '$125',
    image: '/api/placeholder/80/80',
    href: '/products/burgundy-vest',
    badge: 'ON SALE',
    rating: 4.7
  }
];

// Fit guides prominence (Bonobos insight)
const fitGuides = [
  {
    id: 'suit-fit',
    label: 'Suit Fit Guide',
    icon: Ruler,
    href: '/fit-guide/suits',
    description: 'Find your perfect suit fit'
  },
  {
    id: 'size-chart',
    label: 'Size Chart',
    icon: BookOpen,
    href: '/size-chart',
    description: 'Comprehensive measurements'
  },
  {
    id: 'alterations',
    label: 'Alteration Guide',
    icon: Award,
    href: '/alterations/guide',
    description: 'Professional tailoring info'
  }
];

// Search suggestions with visual previews
const searchSuggestions = {
  trending: [
    { term: 'Navy wedding suit', count: '2.3k searches', visual: '/api/placeholder/40/40' },
    { term: 'Black tuxedo rental', count: '1.8k searches', visual: '/api/placeholder/40/40' },
    { term: 'Prom 2025 collection', count: '1.2k searches', visual: '/api/placeholder/40/40' },
    { term: 'Burgundy accessories', count: '890 searches', visual: '/api/placeholder/40/40' }
  ],
  occasions: [
    { label: 'Wedding Guest', icon: Users, href: '/occasions/wedding-guest', visual: '/api/placeholder/40/40' },
    { label: 'Prom Night', icon: Star, href: '/occasions/prom', visual: '/api/placeholder/40/40' },
    { label: 'Business Meeting', icon: Award, href: '/occasions/business', visual: '/api/placeholder/40/40' },
    { label: 'Black Tie Event', icon: Gift, href: '/occasions/black-tie', visual: '/api/placeholder/40/40' }
  ]
};

export default function ConversionOptimizedMobileNav({ isOpen, onClose }: ConversionOptimizedMobileNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('wedding-season'); // Auto-expand most converting category
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<'shop' | 'fit' | 'ai'>('shop');
  const router = useRouter();
  const pathname = usePathname();
  const { cartSummary } = useCart();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus search when menu opens (conversion optimization)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    } else {
      document.body.style.overflow = '';
      setSearchQuery('');
      setShowSearchSuggestions(false);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle search with analytics tracking
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Track search conversion intent
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'search', {
          search_term: searchQuery.trim(),
          search_source: 'mobile_menu'
        });
      }
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&source=mobile_menu`);
      onClose();
    }
  };

  // Handle navigation with conversion tracking
  const handleNavigation = (href: string, analyticsData?: any) => {
    if (typeof window !== 'undefined' && window.gtag && analyticsData) {
      window.gtag('event', 'mobile_menu_click', {
        ...analyticsData,
        destination: href
      });
    }
    router.push(href);
    onClose();
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Handle swipe to close
  const handlePanEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      onClose();
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const menuVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0%' }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
            className="absolute left-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl"
          >
            {/* Header with conversion-focused CTAs */}
            <div className="bg-gradient-to-b from-white via-gray-50 to-white p-4 pb-3 border-b border-gray-100">
              {/* Close button and loyalty badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-serif font-bold">
                    <span className="text-black">KCT</span>
                    <span className="text-burgundy-600 ml-1">Menswear</span>
                  </h2>
                  <div className="flex items-center gap-1 px-2 py-1 bg-gold-100 rounded-full">
                    <Crown className="h-3 w-3 text-gold-600" />
                    <span className="text-xs font-semibold text-gold-700">VIP</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Enhanced search with instant suggestions */}
              <form onSubmit={handleSearch} className="relative mb-3">
                <motion.div
                  animate={{ scale: isSearchFocused ? 1.02 : 1 }}
                  className="relative"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setShowSearchSuggestions(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setIsSearchFocused(false);
                        setShowSearchSuggestions(false);
                      }, 200);
                    }}
                    placeholder="Search suits, events, styles..."
                    className="w-full pl-12 pr-20 py-4 bg-white border-2 border-gray-200 rounded-2xl 
                             focus:border-burgundy-500 focus:shadow-lg transition-all text-base"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 
                             bg-burgundy-600 text-white rounded-xl font-semibold text-sm
                             hover:bg-burgundy-700 transition-colors"
                  >
                    Find
                  </button>
                </motion.div>
              </form>

              {/* Tab navigation */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'shop', label: 'Shop', icon: Shirt },
                  { id: 'fit', label: 'Fit Guide', icon: Ruler },
                  { id: 'ai', label: 'AI Tools', icon: Sparkles }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all',
                      activeTab === tab.id 
                        ? 'bg-white text-burgundy-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search suggestions overlay with visuals */}
            <AnimatePresence>
              {showSearchSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-[160px] left-4 right-4 bg-white rounded-xl shadow-xl z-50 
                           border border-gray-200 max-h-[60vh] overflow-y-auto"
                >
                  {searchQuery.length === 0 ? (
                    <>
                      {/* Trending with visuals */}
                      <div className="p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Trending Now
                        </h3>
                        <div className="space-y-3">
                          {searchSuggestions.trending.map((item) => (
                            <button
                              key={item.term}
                              onClick={() => {
                                setSearchQuery(item.term);
                                handleSearch(new Event('submit') as any);
                              }}
                              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                                <img src={item.visual} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="text-left flex-1">
                                <div className="text-sm font-medium text-gray-700">{item.term}</div>
                                <div className="text-xs text-gray-500">{item.count}</div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Popular products */}
                      <div className="border-t border-gray-100 p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Popular Right Now
                        </h3>
                        <div className="space-y-3">
                          {popularProducts.slice(0, 3).map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleNavigation(product.href, { 
                                product_name: product.name, 
                                product_price: product.price,
                                source: 'mobile_search_suggestions'
                              })}
                              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                <img src={product.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="text-left flex-1">
                                <div className="text-sm font-medium text-gray-700">{product.name}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-burgundy-600">{product.price}</span>
                                  {product.originalPrice && (
                                    <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-amber-400 fill-current" />
                                    <span className="text-xs text-gray-600">{product.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                                {product.badge}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Search Results for "{searchQuery}"
                      </h3>
                      <div className="space-y-2">
                        {popularProducts
                          .filter(item => 
                            item.name.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleNavigation(item.href)}
                              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="text-left flex-1">
                                <div className="text-sm font-medium">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.price}</div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main content based on active tab */}
            <div className="flex-1 overflow-y-auto px-4 pb-24">
              {activeTab === 'shop' && (
                <div className="pt-4">
                  {/* Event-based navigation */}
                  <div className="space-y-4">
                    {eventBasedNavigation.map((event) => (
                      <div key={event.id}>
                        {event.featured ? (
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => toggleCategory(event.id)}
                            className={cn(
                              'w-full p-4 rounded-xl text-white relative overflow-hidden',
                              'bg-gradient-to-r',
                              event.gradient
                            )}
                          >
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <event.icon className="h-6 w-6" />
                                  <div className="text-left">
                                    <div className="font-semibold text-lg">{event.label}</div>
                                    <div className="text-xs opacity-90">{event.description}</div>
                                  </div>
                                </div>
                                <ChevronDown 
                                  className={cn(
                                    'h-5 w-5 transition-transform',
                                    expandedCategory === event.id && 'rotate-180'
                                  )}
                                />
                              </div>
                              {event.urgency && (
                                <div className="flex items-center gap-2 text-xs bg-white/20 rounded-full px-3 py-1 w-fit">
                                  <Clock className="h-3 w-3" />
                                  {event.urgency}
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-white/10 rounded-xl" />
                          </motion.button>
                        ) : (
                          <button
                            onClick={() => toggleCategory(event.id)}
                            className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <event.icon className="h-5 w-5 text-gray-600" />
                                <div className="text-left">
                                  <div className="font-medium text-gray-900">{event.label}</div>
                                  <div className="text-xs text-gray-500">{event.description}</div>
                                </div>
                              </div>
                              <ChevronDown 
                                className={cn(
                                  'h-5 w-5 text-gray-400 transition-transform',
                                  expandedCategory === event.id && 'rotate-180'
                                )}
                              />
                            </div>
                          </button>
                        )}

                        {/* Expanded category items with visuals */}
                        <AnimatePresence>
                          {expandedCategory === event.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-3 space-y-2 overflow-hidden"
                            >
                              {event.children?.map((item) => (
                                <motion.button
                                  key={item.id}
                                  whileHover={{ x: 4 }}
                                  onClick={() => handleNavigation(item.href, { 
                                    category: event.label, 
                                    subcategory: item.label,
                                    source: 'mobile_menu_event_nav'
                                  })}
                                  className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  {item.visual && (
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 overflow-hidden">
                                      <img src={item.visual} alt="" className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                  <div className="text-left flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium text-gray-700">
                                        {item.label}
                                      </span>
                                      {item.badge && (
                                        <span className={cn(
                                          'px-2 py-0.5 text-xs font-bold text-white rounded-full',
                                          item.badge.color
                                        )}>
                                          {item.badge.text}
                                        </span>
                                      )}
                                    </div>
                                    {item.description && (
                                      <div className="text-xs text-gray-500">
                                        {item.description}
                                      </div>
                                    )}
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  {/* Popular products section */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-700">Trending Products</h3>
                      <button 
                        onClick={() => handleNavigation('/products?sort=popular')}
                        className="text-xs text-burgundy-600 font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {popularProducts.slice(0, 4).map((product) => (
                        <motion.button
                          key={product.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNavigation(product.href, { 
                            product_name: product.name,
                            source: 'mobile_menu_trending'
                          })}
                          className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:shadow-md transition-all"
                        >
                          <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-gray-900 line-clamp-2">
                              {product.name}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-burgundy-600">{product.price}</span>
                                {product.originalPrice && (
                                  <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-400 fill-current" />
                                <span className="text-xs text-gray-600">{product.rating}</span>
                              </div>
                            </div>
                            <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium w-fit">
                              {product.badge}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'fit' && (
                <div className="pt-4">
                  {/* Fit guide prominence */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="h-6 w-6 text-blue-600" />
                        <div>
                          <div className="font-semibold text-blue-900">Perfect Fit Guarantee</div>
                          <div className="text-xs text-blue-700">99% of customers find their perfect size</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNavigation('/ai/size-predictor', { source: 'fit_guide_cta' })}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                      >
                        Get My Size Now
                      </button>
                    </div>

                    {fitGuides.map((guide) => (
                      <motion.button
                        key={guide.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleNavigation(guide.href, { 
                          guide_type: guide.label,
                          source: 'mobile_fit_guide'
                        })}
                        className="w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <guide.icon className="h-6 w-6 text-gray-600 mr-4" />
                        <div className="text-left flex-1">
                          <div className="font-medium text-gray-900">{guide.label}</div>
                          <div className="text-xs text-gray-500">{guide.description}</div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </motion.button>
                    ))}

                    {/* Video tutorials */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Play className="h-5 w-5 text-burgundy-600" />
                        Video Tutorials
                      </h3>
                      <div className="space-y-3">
                        {[
                          'How to Measure for a Suit',
                          'Understanding Suit Fits',
                          'Alteration Tips & Tricks'
                        ].map((title) => (
                          <button
                            key={title}
                            onClick={() => handleNavigation('/tutorials/fitting')}
                            className="flex items-center gap-3 w-full p-2 hover:bg-white rounded-lg transition-colors"
                          >
                            <div className="w-10 h-8 bg-burgundy-100 rounded flex items-center justify-center">
                              <Play className="h-4 w-4 text-burgundy-600" />
                            </div>
                            <span className="text-sm text-gray-700">{title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="pt-4">
                  {/* AI features */}
                  <div className="space-y-4">
                    {aiFeatures.map((feature) => (
                      <motion.button
                        key={feature.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleNavigation(feature.href, { 
                          ai_feature: feature.label,
                          source: 'mobile_ai_tools'
                        })}
                        className={cn(
                          'w-full p-4 rounded-xl text-white relative overflow-hidden',
                          'bg-gradient-to-r',
                          feature.gradient
                        )}
                      >
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <feature.icon className="h-6 w-6" />
                            <div className="text-left">
                              <div className="font-semibold">{feature.label}</div>
                              <div className="text-xs opacity-90">{feature.description}</div>
                            </div>
                          </div>
                          <div className="text-xs bg-white/20 rounded-full px-3 py-1 font-semibold">
                            {feature.badge}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-white/10 rounded-xl" />
                      </motion.button>
                    ))}

                    {/* AI success stories */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ThumbsUp className="h-5 w-5 text-emerald-600" />
                        <span className="font-semibold text-emerald-900">AI Success Stories</span>
                      </div>
                      <div className="text-sm text-emerald-800 mb-3">
                        "The AI size predictor was spot on! Perfect fit on the first try." - Marcus K.
                      </div>
                      <div className="flex items-center gap-4 text-xs text-emerald-700">
                        <span>99.2% Accuracy Rate</span>
                        <span>•</span>
                        <span>15,000+ Happy Customers</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed bottom section with conversion CTAs */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              {/* Quick stats bar */}
              <div className="flex items-center justify-around py-2 mb-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-900">4.9★</div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-900">Same Day</div>
                  <div className="text-xs text-gray-600">Pickup</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-900">Expert</div>
                  <div className="text-xs text-gray-600">Fitting</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-900">Free</div>
                  <div className="text-xs text-gray-600">Alterations</div>
                </div>
              </div>

              {/* Bottom navigation */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleNavigation('/')}
                  className="flex flex-col items-center p-2"
                >
                  <Home className="h-5 w-5 text-gray-600" />
                  <span className="text-xs text-gray-600 mt-1">Home</span>
                </button>
                <button
                  onClick={() => {
                    searchInputRef.current?.focus();
                    setShowSearchSuggestions(true);
                  }}
                  className="flex flex-col items-center p-2"
                >
                  <Search className="h-5 w-5 text-burgundy-600" />
                  <span className="text-xs text-burgundy-600 mt-1 font-semibold">Search</span>
                </button>
                <button
                  onClick={() => handleNavigation('/cart')}
                  className="flex flex-col items-center p-2 relative"
                >
                  <ShoppingBag className="h-5 w-5 text-gray-600" />
                  <span className="text-xs text-gray-600 mt-1">Cart</span>
                  {cartSummary.itemCount > 0 && (
                    <span className="absolute -top-1 right-2 h-4 w-4 bg-red-500 text-white 
                                   text-xs font-bold rounded-full flex items-center justify-center">
                      {cartSummary.itemCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => window.open('tel:+13135252424')}
                  className="flex flex-col items-center p-2"
                >
                  <Phone className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs text-emerald-600 mt-1 font-semibold">Call</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}