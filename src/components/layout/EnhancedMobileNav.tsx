"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  Calendar,
  Users,
  Shirt,
  Ruler,
  Award,
  Palette,
  Filter,
  Home,
  Gift,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/lib/hooks/useCart';
import { Button } from '@/components/ui/button';

interface EnhancedMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

// Search suggestions data
const searchSuggestions = {
  trending: [
    'Navy wedding suit',
    'Black tuxedo rental',
    'Prom 2025 collection',
    'Three-piece suit',
    'Burgundy accessories'
  ],
  occasions: [
    { label: 'Wedding Guest', icon: Users, href: '/products?preset=wedding-guest' },
    { label: 'Prom Night', icon: Star, href: '/products?preset=prom-special' },
    { label: 'Business Meeting', icon: Award, href: '/products?preset=business-professional' },
    { label: 'Black Tie Event', icon: Gift, href: '/products?preset=black-tie' }
  ],
  popular: [
    { name: 'Classic Navy Suit', price: '$495', image: '/api/placeholder/80/80' },
    { name: 'White Dress Shirt', price: '$95', image: '/api/placeholder/80/80' },
    { name: 'Silk Burgundy Tie', price: '$65', image: '/api/placeholder/80/80' }
  ]
};

// Primary navigation focused on user intent
const primaryNavigation = [
  {
    id: 'occasions',
    label: 'Shop by Occasion',
    icon: Calendar,
    description: 'Find the perfect look for your event',
    featured: true,
    gradient: 'from-burgundy-500 to-burgundy-600',
    children: [
      { 
        id: 'wedding', 
        label: 'Wedding', 
        href: '/products?preset=wedding-guest',
        badge: { text: 'POPULAR', color: 'bg-emerald-500' },
        description: 'Guest & groomsmen attire'
      },
      { 
        id: 'prom', 
        label: 'Prom 2025', 
        href: '/products?preset=prom-special',
        badge: { text: 'HOT', color: 'bg-pink-500' },
        description: 'Stand out at your prom'
      },
      { 
        id: 'business', 
        label: 'Business', 
        href: '/products?preset=business-professional',
        description: 'Professional & polished'
      },
      { 
        id: 'black-tie', 
        label: 'Black Tie', 
        href: '/products?preset=black-tie',
        badge: { text: 'LUXURY', color: 'bg-gold-500' },
        description: 'Formal evening wear'
      }
    ]
  },
  {
    id: 'products',
    label: 'Browse Products',
    icon: Shirt,
    description: 'Explore our complete collection',
    children: [
      { 
        id: 'complete-looks', 
        label: 'Complete Looks', 
        href: '/products?type=bundle',
        badge: { text: '$199', color: 'bg-green-500' }
      },
      { 
        id: 'suits', 
        label: 'Suits & Tuxedos', 
        href: '/products?category=suits',
        badge: { text: 'NEW', color: 'bg-blue-500' }
      },
      { id: 'dress-shirts', label: 'Dress Shirts', href: '/products?category=shirts' },
      { id: 'ties', label: 'Ties & Bowties', href: '/products?category=ties,bowties' },
      { id: 'accessories', label: 'Accessories', href: '/products?category=accessories' }
    ]
  },
  {
    id: 'services',
    label: 'Services',
    icon: Award,
    description: 'Tailoring & styling assistance',
    children: [
      { 
        id: 'custom', 
        label: 'Custom Suits', 
        href: '/custom-suits',
        badge: { text: 'BESPOKE', color: 'bg-purple-500' }
      },
      { id: 'alterations', label: 'Alterations', href: '/alterations' },
      { id: 'styling', label: 'Personal Styling', href: '/styling' },
      { id: 'rental', label: 'Rentals', href: '/rentals' }
    ]
  }
];

// Quick action buttons
const quickActions = [
  {
    id: 'size-guide',
    label: 'Size Guide',
    icon: Ruler,
    href: '/size-guide',
    color: 'bg-blue-500'
  },
  {
    id: 'appointment',
    label: 'Book Fitting',
    icon: Calendar,
    href: '/contact',
    color: 'bg-burgundy-500'
  },
  {
    id: 'style-quiz',
    label: 'Style Quiz',
    icon: Palette,
    href: '/style-quiz',
    color: 'bg-purple-500'
  }
];

export default function EnhancedMobileNav({ isOpen, onClose }: EnhancedMobileNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { cartSummary } = useCart();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus search when menu opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    } else {
      document.body.style.overflow = '';
      setSearchQuery('');
      setShowSearchSuggestions(false);
      setExpandedCategory(null);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  // Handle navigation
  const handleNavigation = (href: string) => {
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
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
            {/* Header with prominent search */}
            <div className="bg-gradient-to-b from-white to-gray-50 p-4 pb-2">
              {/* Close button and logo */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold">
                  <span className="text-black">KCT</span>
                  <span className="text-burgundy-600 ml-1">Menswear</span>
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Enhanced search bar */}
              <form onSubmit={handleSearch} className="relative">
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
                    placeholder="Search suits, occasions, styles..."
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
                    Search
                  </button>
                </motion.div>
              </form>

              {/* Quick filter chips */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                {['Wedding', 'Prom', 'Business', 'Tuxedo', 'Accessories'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSearchQuery(filter);
                      handleSearch(new Event('submit') as any);
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm 
                             font-medium whitespace-nowrap hover:bg-burgundy-50 hover:border-burgundy-300
                             transition-colors flex-shrink-0"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Search suggestions overlay */}
            <AnimatePresence>
              {showSearchSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-[140px] left-4 right-4 bg-white rounded-xl shadow-xl z-50 
                           border border-gray-200 max-h-[60vh] overflow-y-auto"
                >
                  {searchQuery.length === 0 ? (
                    <>
                      {/* Popular searches */}
                      <div className="p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Trending Searches
                        </h3>
                        <div className="space-y-2">
                          {searchSuggestions.trending.map((term) => (
                            <button
                              key={term}
                              onClick={() => {
                                setSearchQuery(term);
                                handleSearch(new Event('submit') as any);
                              }}
                              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50"
                            >
                              <TrendingUp className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Shop by occasion */}
                      <div className="border-t border-gray-100 p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Shop by Occasion
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {searchSuggestions.occasions.map((occasion) => (
                            <button
                              key={occasion.label}
                              onClick={() => handleNavigation(occasion.href)}
                              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                            >
                              <occasion.icon className="h-4 w-4 text-burgundy-600" />
                              <span className="text-sm font-medium">{occasion.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Search Results
                      </h3>
                      <div className="space-y-2">
                        {searchSuggestions.popular
                          .filter(item => 
                            item.name.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((item) => (
                            <button
                              key={item.name}
                              onClick={() => handleNavigation('/products')}
                              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
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

            {/* Main navigation content */}
            <div className="flex-1 overflow-y-auto px-4 pb-24">
              {/* Quick actions */}
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-3">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(action.href)}
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

              {/* Primary navigation categories */}
              <div className="mt-6 space-y-3">
                {primaryNavigation.map((category) => (
                  <div key={category.id}>
                    {category.featured ? (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => toggleCategory(category.id)}
                        className={cn(
                          'w-full p-4 rounded-xl text-white relative overflow-hidden',
                          'bg-gradient-to-r',
                          category.gradient || 'from-gray-700 to-gray-800'
                        )}
                      >
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <category.icon className="h-6 w-6" />
                            <div className="text-left">
                              <div className="font-semibold">{category.label}</div>
                              <div className="text-xs opacity-90">{category.description}</div>
                            </div>
                          </div>
                          <ChevronDown 
                            className={cn(
                              'h-5 w-5 transition-transform',
                              expandedCategory === category.id && 'rotate-180'
                            )}
                          />
                        </div>
                        <div className="absolute inset-0 bg-white/10 rounded-xl" />
                      </motion.button>
                    ) : (
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <category.icon className="h-5 w-5 text-gray-600" />
                            <div className="text-left">
                              <div className="font-medium text-gray-900">{category.label}</div>
                              <div className="text-xs text-gray-500">{category.description}</div>
                            </div>
                          </div>
                          <ChevronDown 
                            className={cn(
                              'h-5 w-5 text-gray-400 transition-transform',
                              expandedCategory === category.id && 'rotate-180'
                            )}
                          />
                        </div>
                      </button>
                    )}

                    {/* Expanded category items */}
                    <AnimatePresence>
                      {expandedCategory === category.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 space-y-1 overflow-hidden"
                        >
                          {category.children?.map((item) => (
                            <motion.button
                              key={item.id}
                              whileHover={{ x: 4 }}
                              onClick={() => handleNavigation(item.href)}
                              className="w-full flex items-center justify-between p-3 pl-12 
                                       bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <div className="text-left">
                                <div className="flex items-center gap-2">
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
                                  <div className="text-xs text-gray-500 mt-0.5">
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

              {/* Account actions */}
              <div className="mt-6 space-y-3">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">My Account</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </Link>
                
                <Link
                  href="/atelier-ai"
                  onClick={onClose}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 
                           border border-purple-200 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors"
                >
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium text-purple-900">Atelier AI</div>
                    <div className="text-xs text-purple-600">Get personalized styling</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-purple-400" />
                </Link>
              </div>

              {/* Help section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Need Help?</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('tel:+12693421234')}
                    className="flex items-center gap-3 w-full p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">(269) 342-1234</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/locations')}
                    className="flex items-center gap-3 w-full p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Store Locations</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/contact')}
                    className="flex items-center gap-3 w-full p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Live Chat</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Fixed bottom navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
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
                  onClick={() => handleNavigation('/account/wishlist')}
                  className="flex flex-col items-center p-2"
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                  <span className="text-xs text-gray-600 mt-1">Wishlist</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}