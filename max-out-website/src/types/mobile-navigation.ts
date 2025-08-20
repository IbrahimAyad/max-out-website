/**
 * Mobile Navigation Types
 * Enhanced type definitions for mobile navigation system
 */

export interface MobileNavBadge {
  text: string;
  type: 'new' | 'hot' | 'sale' | 'trending' | 'luxury' | 'ai' | 'limited';
  color: string;
  pulsing?: boolean;
}

export interface MobileNavItem {
  id: string;
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: MobileNavBadge;
  children?: MobileNavItem[];
  isExternal?: boolean;
  description?: string;
  trackingEvent?: string;
  requiresAuth?: boolean;
  isNew?: boolean;
  priority?: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  color: string;
  description?: string;
  trackingEvent?: string;
}

export interface RecentItem {
  id: string;
  name: string;
  href: string;
  image?: string;
  type: 'product' | 'category' | 'search';
  timestamp?: Date;
  price?: string;
  badge?: MobileNavBadge;
}

export interface SocialProofData {
  rating: number;
  reviewCount: number;
  customerCount: number;
  highlights: string[];
}

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string, trackingEvent?: string) => void;
  className?: string;
}

export interface MobileNavSection {
  id: string;
  title: string;
  items: MobileNavItem[];
  icon?: React.ComponentType<{ className?: string }>;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface MobileNavConfig {
  sections: MobileNavSection[];
  quickActions: QuickAction[];
  socialProof?: SocialProofData;
  recentItemsLimit?: number;
  enableGestures?: boolean;
  enableHaptics?: boolean;
  enableVoiceSearch?: boolean;
}

export interface NavigationTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  staggerDelay: number;
  enableMicroAnimations: boolean;
  hapticFeedback: boolean;
}

export interface AccessibilityConfig {
  enableScreenReader: boolean;
  enableKeyboardNavigation: boolean;
  enableHighContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  reduceMotion: boolean;
}

export interface MobileNavStore {
  isOpen: boolean;
  activeSection: string | null;
  expandedCategories: Set<string>;
  recentItems: RecentItem[];
  searchQuery: string;
  preferences: {
    theme: NavigationTheme;
    animation: AnimationConfig;
    accessibility: AccessibilityConfig;
  };
}

export interface MobileNavActions {
  open: () => void;
  close: () => void;
  toggleCategory: (categoryId: string) => void;
  setActiveSection: (sectionId: string | null) => void;
  addRecentItem: (item: RecentItem) => void;
  clearRecentItems: () => void;
  updateSearchQuery: (query: string) => void;
  updatePreferences: (preferences: Partial<MobileNavStore['preferences']>) => void;
}

// Gesture types for mobile interactions
export interface GestureConfig {
  swipeThreshold: number;
  velocityThreshold: number;
  enablePullToRefresh: boolean;
  enableSwipeToClose: boolean;
  enableDoubleTap: boolean;
}

// Analytics types for tracking
export interface NavigationAnalytics {
  trackNavigation: (item: MobileNavItem) => void;
  trackSearch: (query: string, results?: number) => void;
  trackQuickAction: (action: QuickAction) => void;
  trackGesture: (gesture: string, target?: string) => void;
  trackTimeSpent: (duration: number) => void;
}

// Voice search types
export interface VoiceSearchConfig {
  enabled: boolean;
  language: string;
  commands: {
    [key: string]: () => void;
  };
}

// Performance optimization types
export interface PerformanceConfig {
  enableVirtualization: boolean;
  lazy: boolean;
  preloadImages: boolean;
  cacheRecentItems: boolean;
  debounceSearch: number;
}