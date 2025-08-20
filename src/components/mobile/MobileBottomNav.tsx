'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { 
  Home, 
  Search, 
  Heart, 
  ShoppingBag, 
  User,
  Phone,
  MapPin,
  Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  isActive?: boolean;
}

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { items: cartItems } = useCart();
  const { items: favoriteItems } = useFavorites();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Haptic feedback for touch interactions
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const navItems: NavItem[] = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      isActive: pathname === '/'
    },
    {
      href: '/search',
      icon: Search,
      label: 'Search',
      isActive: pathname.startsWith('/search')
    },
    {
      href: '/favorites',
      icon: Heart,
      label: 'Favorites',
      badge: favoriteItems?.length || 0,
      isActive: pathname === '/favorites'
    },
    {
      href: '/cart',
      icon: ShoppingBag,
      label: 'Cart',
      badge: cartItems?.length || 0,
      isActive: pathname === '/cart'
    },
    {
      href: '/account',
      icon: User,
      label: 'Account',
      isActive: pathname.startsWith('/account') || pathname.startsWith('/profile')
    }
  ];

  // Quick action buttons for long press
  const quickActions = [
    { icon: Phone, label: 'Call Store', action: () => window.open('tel:+12693421234') },
    { icon: MapPin, label: 'Directions', action: () => window.open('https://maps.google.com/?q=213+S+Kalamazoo+Mall+Kalamazoo+MI') },
    { icon: Star, label: 'Reviews', action: () => window.open('https://g.page/r/reviews') }
  ];

  const [showQuickActions, setShowQuickActions] = useState(false);

  return (
    <>
      {/* Quick Actions Overlay */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowQuickActions(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-20 left-4 right-4"
            >
              <div className="bg-white rounded-2xl shadow-xl p-4">
                <div className="text-center text-sm font-medium text-gray-600 mb-3">
                  Quick Actions
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        setShowQuickActions(false);
                        triggerHaptic();
                      }}
                      className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <action.icon className="w-6 h-6 text-gray-700 mb-1" />
                      <span className="text-xs text-gray-600">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 md:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex justify-around items-center py-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={triggerHaptic}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (index === 0) { // Home button long press
                      setShowQuickActions(true);
                      triggerHaptic();
                    }
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all duration-200 relative",
                    item.isActive 
                      ? "text-amber-600" 
                      : "text-gray-600 hover:text-gray-900 active:scale-95"
                  )}
                >
                  <div className="relative">
                    <item.icon 
                      className={cn(
                        "w-6 h-6 transition-all duration-200",
                        item.isActive && "scale-110"
                      )} 
                    />
                    
                    {/* Active indicator */}
                    {item.isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -inset-1 bg-amber-100 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    {/* Badge */}
                    {item.badge && item.badge > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </motion.div>
                    )}
                  </div>
                  
                  <span className={cn(
                    "text-xs mt-1 font-medium transition-all duration-200",
                    item.isActive ? "text-amber-600 scale-105" : "text-gray-600"
                  )}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
            
            {/* Safe area indicator */}
            <div className="h-safe-area-inset-bottom bg-white/95" />
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileBottomNav;