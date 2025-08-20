'use client';

import { useState, useEffect } from 'react';

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  addedAt: Date;
}

export const useFavorites = () => {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('kct-favorites');
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        setItems(parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save favorites to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('kct-favorites', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [items, isLoading]);

  const addToFavorites = (product: Omit<FavoriteItem, 'addedAt'>) => {
    const newItem: FavoriteItem = {
      ...product,
      addedAt: new Date()
    };
    
    setItems(prev => {
      // Check if item already exists
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }
      return [...prev, newItem];
    });

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
  };

  const removeFromFavorites = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const isFavorite = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const toggleFavorite = (product: Omit<FavoriteItem, 'addedAt'>) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const clearFavorites = () => {
    setItems([]);
  };

  const getFavoritesByCategory = (category?: string) => {
    if (!category) return items;
    // This would require category info in the favorite item
    return items; // For now, return all items
  };

  return {
    items,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesByCategory,
    count: items.length
  };
};