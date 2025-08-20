"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RecentItem, MobileNavStore, MobileNavActions } from '@/types/mobile-navigation';

const RECENT_ITEMS_KEY = 'kct-mobile-nav-recent';
const PREFERENCES_KEY = 'kct-mobile-nav-preferences';
const MAX_RECENT_ITEMS = 5;

export function useMobileNavigation() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();

  const [state, setState] = useState<MobileNavStore>({
    isOpen: false,
    activeSection: null,
    expandedCategories: new Set<string>(),
    recentItems: [],
    searchQuery: '',
    preferences: {
      theme: {
        primary: 'var(--burgundy)',
        secondary: 'var(--gold)',
        accent: 'var(--gold-light)',
        background: 'var(--white)',
        surface: 'var(--gray-50)',
        text: 'var(--black)',
        textSecondary: 'var(--gray-600)',
        border: 'var(--gray-200)',
        shadow: 'var(--shadow-burgundy-md)'
      },
      animation: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        staggerDelay: 50,
        enableMicroAnimations: true,
        hapticFeedback: true
      },
      accessibility: {
        enableScreenReader: true,
        enableKeyboardNavigation: true,
        enableHighContrast: false,
        fontSize: 'medium',
        reduceMotion: false
      }
    }
  });

  // Load persisted data on mount
  useEffect(() => {
    try {
      const recentItems = localStorage.getItem(RECENT_ITEMS_KEY);
      const preferences = localStorage.getItem(PREFERENCES_KEY);

      setState(prev => ({
        ...prev,
        recentItems: recentItems ? JSON.parse(recentItems) : [],
        preferences: preferences ? { ...prev.preferences, ...JSON.parse(preferences) } : prev.preferences
      }));
    } catch (error) {
      console.warn('Failed to load mobile navigation data:', error);
    }
  }, []);

  // Detect user preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setState(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          accessibility: {
            ...prev.preferences.accessibility,
            reduceMotion: e.matches
          }
        }
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange({ matches: mediaQuery.matches } as MediaQueryListEvent);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Track time spent when menu opens
  useEffect(() => {
    if (state.isOpen) {
      startTimeRef.current = Date.now();
    } else if (startTimeRef.current) {
      const timeSpent = Date.now() - startTimeRef.current;
      // You can send this to analytics
      startTimeRef.current = undefined;
    }
  }, [state.isOpen]);

  // Persist recent items
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(state.recentItems));
    } catch (error) {
      console.warn('Failed to save recent items:', error);
    }
  }, [state.recentItems]);

  // Persist preferences
  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state.preferences));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }, [state.preferences]);

  const actions: MobileNavActions = {
    open: useCallback(() => {
      setState(prev => ({ ...prev, isOpen: true }));
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Set focus trap
      if (typeof window !== 'undefined') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        };

        document.addEventListener('keydown', handleTabKey);
        return () => document.removeEventListener('keydown', handleTabKey);
      }
    }, []),

    close: useCallback(() => {
      setState(prev => ({ 
        ...prev, 
        isOpen: false,
        activeSection: null,
        searchQuery: ''
      }));
      
      // Restore body scroll
      document.body.style.overflow = '';
    }, []),

    toggleCategory: useCallback((categoryId: string) => {
      setState(prev => {
        const newExpanded = new Set(prev.expandedCategories);
        if (newExpanded.has(categoryId)) {
          newExpanded.delete(categoryId);
        } else {
          newExpanded.add(categoryId);
        }
        return { ...prev, expandedCategories: newExpanded };
      });

      // Haptic feedback
      if (navigator.vibrate && state.preferences.animation.hapticFeedback) {
        navigator.vibrate(10);
      }
    }, [state.preferences.animation.hapticFeedback]),

    setActiveSection: useCallback((sectionId: string | null) => {
      setState(prev => ({ ...prev, activeSection: sectionId }));
    }, []),

    addRecentItem: useCallback((item: RecentItem) => {
      setState(prev => {
        const existingIndex = prev.recentItems.findIndex(existing => existing.id === item.id);
        let newRecentItems = [...prev.recentItems];

        if (existingIndex !== -1) {
          // Move existing item to front
          newRecentItems.splice(existingIndex, 1);
        }

        newRecentItems.unshift({ ...item, timestamp: new Date() });

        // Limit to MAX_RECENT_ITEMS
        if (newRecentItems.length > MAX_RECENT_ITEMS) {
          newRecentItems = newRecentItems.slice(0, MAX_RECENT_ITEMS);
        }

        return { ...prev, recentItems: newRecentItems };
      });
    }, []),

    clearRecentItems: useCallback(() => {
      setState(prev => ({ ...prev, recentItems: [] }));
    }, []),

    updateSearchQuery: useCallback((query: string) => {
      setState(prev => ({ ...prev, searchQuery: query }));

      // Debounce search
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        // Trigger search analytics here if needed
        if (query.trim()) {
        }
      }, 500);
    }, []),

    updatePreferences: useCallback((preferences: Partial<MobileNavStore['preferences']>) => {
      setState(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...preferences
        }
      }));
    }, [])
  };

  // Enhanced navigation handler with analytics
  const handleNavigation = useCallback((href: string, trackingEvent?: string, isExternal = false) => {
    // Add to recent items if it's a product or category
    if (href.includes('/products/') || href.includes('/collections/')) {
      const pathParts = href.split('/');
      const name = pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
      const type = href.includes('/products/') ? 'product' : 'category';
      
      actions.addRecentItem({
        id: href,
        name,
        href,
        type: type as 'product' | 'category'
      });
    }

    // Track navigation
    if (trackingEvent) {
      // Send to analytics service
    }

    // Navigate
    if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(href);
    }

    actions.close();

    // Haptic feedback
    if (navigator.vibrate && state.preferences.animation.hapticFeedback) {
      navigator.vibrate(15);
    }
  }, [actions, router, state.preferences.animation.hapticFeedback]);

  // Voice search handler
  const handleVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    try {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        actions.updateSearchQuery(transcript);
        
        // Auto-search after voice input
        setTimeout(() => {
          handleNavigation(`/search?q=${encodeURIComponent(transcript)}`, 'voice_search');
        }, 500);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
      };

      recognition.start();
    } catch (error) {
      console.warn('Failed to start voice recognition:', error);
    }
  }, [actions, handleNavigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.body.style.overflow = '';
    };
  }, []);

  return {
    state,
    actions,
    handleNavigation,
    handleVoiceSearch,
    isExpanded: (categoryId: string) => state.expandedCategories.has(categoryId)
  };
}

// Types for browser APIs
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}