'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageCircle, Lightbulb, TrendingUp, Heart, Crown } from 'lucide-react';

interface SmartTip {
  id: string;
  message: string;
  type: 'tip' | 'suggestion' | 'compliment' | 'insight' | 'celebration';
  icon?: React.ReactNode;
  duration?: number;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
}

const DEFAULT_TIPS: SmartTip[] = [
  {
    id: 'welcome',
    message: "Welcome! I'm Atelier AI, your personal style curator. Swipe right on styles you love!",
    type: 'tip',
    duration: 6000
  },
  {
    id: 'first-like',
    message: "Excellent taste! I'm learning your style preferences 🎨",
    type: 'compliment',
    duration: 4000
  },
  {
    id: 'style-match',
    message: "Based on your choices, you prefer classic elegance. Shall I curate more? 👔",
    type: 'insight',
    duration: 5000
  },
  {
    id: 'size-reminder',
    message: "Pro tip: Use my AI Size Finder for a guaranteed perfect fit ✨",
    type: 'suggestion',
    duration: 4000
  },
  {
    id: 'trending',
    message: "This piece is trending among style leaders this season 🔥",
    type: 'tip',
    duration: 3500
  },
  {
    id: 'achievement',
    message: "🏆 Achievement Unlocked: Style Explorer! 10 looks discovered!",
    type: 'celebration',
    duration: 5000
  }
];

interface SmartTipsProps {
  userId?: string;
  pageContext?: string;
  swipeCount?: number;
  likedItems?: string[];
  onTipShown?: (tipId: string) => void;
  onTipDismissed?: (tipId: string) => void;
}

export function SmartTips({ 
  userId, 
  pageContext = 'style-swiper',
  swipeCount = 0,
  likedItems = [],
  onTipShown,
  onTipDismissed 
}: SmartTipsProps) {
  const [currentTip, setCurrentTip] = useState<SmartTip | null>(null);
  const [shownTips, setShownTips] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);

  // Trigger tips based on user behavior
  useEffect(() => {
    // Welcome message on first visit
    if (swipeCount === 0 && !shownTips.has('welcome')) {
      showTip(DEFAULT_TIPS[0]);
    }
    
    // First like celebration
    if (likedItems.length === 1 && !shownTips.has('first-like')) {
      showTip(DEFAULT_TIPS[1]);
    }
    
    // Style insight after 5 swipes
    if (swipeCount === 5 && !shownTips.has('style-match')) {
      showTip(DEFAULT_TIPS[2]);
    }
    
    // Size reminder after 8 swipes
    if (swipeCount === 8 && !shownTips.has('size-reminder')) {
      showTip(DEFAULT_TIPS[3]);
    }
    
    // Achievement at 10 swipes
    if (swipeCount === 10 && !shownTips.has('achievement')) {
      showTip(DEFAULT_TIPS[5]);
    }
  }, [swipeCount, likedItems, shownTips]);

  const showTip = (tip: SmartTip) => {
    if (shownTips.has(tip.id)) return;
    
    setCurrentTip(tip);
    setIsVisible(true);
    setShownTips(prev => new Set([...prev, tip.id]));
    onTipShown?.(tip.id);
    
    // Auto-hide after duration
    if (tip.duration) {
      setTimeout(() => {
        hideTip();
      }, tip.duration);
    }
  };

  const hideTip = () => {
    setIsVisible(false);
    if (currentTip) {
      onTipDismissed?.(currentTip.id);
    }
    setTimeout(() => {
      setCurrentTip(null);
    }, 300);
  };

  const getIcon = (type: SmartTip['type']) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="w-4 h-4" />;
      case 'suggestion':
        return <Sparkles className="w-4 h-4" />;
      case 'compliment':
        return <Heart className="w-4 h-4" />;
      case 'insight':
        return <TrendingUp className="w-4 h-4" />;
      case 'celebration':
        return <Crown className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getPositionClasses = (position: SmartTip['position'] = 'bottom-right') => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-4 right-4 sm:bottom-6 sm:right-6';
      case 'bottom-left':
        return 'bottom-4 left-4 sm:bottom-6 sm:left-6';
      case 'top-right':
        return 'top-20 right-4 sm:top-24 sm:right-6';
      case 'top-left':
        return 'top-20 left-4 sm:top-24 sm:left-6';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-4 right-4 sm:bottom-6 sm:right-6';
    }
  };

  const getTypeStyles = (type: SmartTip['type']) => {
    switch (type) {
      case 'tip':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'suggestion':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'compliment':
        return 'bg-gradient-to-r from-pink-500 to-rose-500 text-white';
      case 'insight':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'celebration':
        return 'bg-gradient-to-r from-gold-500 to-gold-600 text-white';
      default:
        return 'bg-gradient-to-r from-burgundy to-burgundy-600 text-white';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && currentTip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`fixed z-50 ${getPositionClasses(currentTip.position)}`}
        >
          <div className={`${getTypeStyles(currentTip.type)} rounded-2xl shadow-2xl max-w-xs sm:max-w-sm overflow-hidden`}>
            {/* Atelier AI Header */}
            <div className="bg-black/20 px-4 py-2 border-b border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-semibold text-white/90 tracking-wide">ATELIER AI</span>
                <button
                  onClick={hideTip}
                  className="ml-auto hover:opacity-80 transition-opacity"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5 text-white/80" />
                </button>
              </div>
            </div>
            
            {/* Message Content */}
            <div className="px-4 py-3 sm:px-5 sm:py-4 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {currentTip.icon || getIcon(currentTip.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium leading-relaxed">
                  {currentTip.message}
                </p>
              </div>
            </div>
            
            {/* Subtle animation indicator */}
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: (currentTip.duration || 5000) / 1000, ease: 'linear' }}
            >
              <div className="h-0.5 bg-white/30 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Context-aware tip generator
export function useSmartTips() {
  const [tipQueue, setTipQueue] = useState<SmartTip[]>([]);
  
  const queueTip = (tip: SmartTip) => {
    setTipQueue(prev => [...prev, tip]);
  };
  
  const generateContextualTip = (context: {
    action?: string;
    item?: any;
    userPreferences?: any;
    timeOfDay?: string;
  }): SmartTip | null => {
    const { action, item, userPreferences, timeOfDay } = context;
    
    // Generate AI-powered contextual tips
    if (action === 'view-product' && item?.price > 500) {
      return {
        id: `premium-${Date.now()}`,
        message: "I've identified this as an investment piece. Premium quality with timeless appeal 💎",
        type: 'suggestion',
        duration: 5000
      };
    }
    
    if (action === 'add-to-cart') {
      return {
        id: `cart-${Date.now()}`,
        message: "Smart choice! I can suggest complementary pieces to complete this look 🎩",
        type: 'suggestion',
        duration: 4000
      };
    }
    
    if (timeOfDay === 'evening') {
      return {
        id: `evening-${Date.now()}`,
        message: "Based on the time, I recommend our evening formal collection ✨",
        type: 'tip',
        duration: 4500
      };
    }
    
    if (userPreferences?.favoriteColor && item?.color === userPreferences.favoriteColor) {
      return {
        id: `color-match-${Date.now()}`,
        message: `My analysis shows ${item.color} aligns perfectly with your style DNA 🎨`,
        type: 'insight',
        duration: 4000
      };
    }
    
    if (action === 'multiple-likes') {
      return {
        id: `pattern-${Date.now()}`,
        message: "I'm noticing a pattern in your preferences. Calibrating recommendations... 🎯",
        type: 'insight',
        duration: 4500
      };
    }
    
    return null;
  };
  
  return {
    tipQueue,
    queueTip,
    generateContextualTip
  };
}