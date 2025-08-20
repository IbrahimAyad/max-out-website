/**
 * Enhanced Cart Persistence Utilities
 * Handles cart state persistence with robust error handling and fallback mechanisms
 */

import { useState, useEffect } from 'react';
import { CartItem } from '@/lib/types';

const CART_STORAGE_KEY = 'kct-cart';
const CART_BACKUP_KEY = 'kct-cart-backup';
const CART_EXPIRY_DAYS = 30;
const PERSISTENCE_VERSION = 2;

export interface PersistedCart {
  items: CartItem[];
  updatedAt: string;
  expiresAt: string;
  version: number;
}

export class CartPersistenceManager {
  /**
   * Enhanced save with backup and error handling
   */
  static saveCartToStorage(items: CartItem[]): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

      const persistedCart: PersistedCart = {
        items,
        updatedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        version: PERSISTENCE_VERSION,
      };

      // Save primary cart
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistedCart));
      
      // Save backup cart
      localStorage.setItem(CART_BACKUP_KEY, JSON.stringify(persistedCart));
      
      return true;
    } catch (error) {
      console.warn('Failed to save cart to storage:', error);
      return false;
    }
  }

  /**
   * Enhanced load with backup fallback and migration
   */
  static loadCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined') return [];

    try {
      // Try primary storage first
      let persistedCart = this.loadFromKey(CART_STORAGE_KEY);
      
      // Fallback to backup if primary fails
      if (!persistedCart) {
        persistedCart = this.loadFromKey(CART_BACKUP_KEY);
        if (persistedCart) {
          console.info('Restored cart from backup storage');
          // Restore primary from backup
          this.saveCartToStorage(persistedCart.items);
        }
      }

      if (!persistedCart) return [];

      // Check expiration
      const now = new Date();
      const expiresAt = new Date(persistedCart.expiresAt);

      if (now > expiresAt) {
        this.clearCartStorage();
        return [];
      }

      // Handle version migration
      if (persistedCart.version < PERSISTENCE_VERSION) {
        const migratedItems = this.migrateCartItems(persistedCart.items);
        this.saveCartToStorage(migratedItems);
        return migratedItems;
      }

      return persistedCart.items;
    } catch (error) {
      console.warn('Failed to load cart from storage:', error);
      return [];
    }
  }

  /**
   * Load cart from specific storage key
   */
  private static loadFromKey(key: string): PersistedCart | null {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      // Validate structure
      if (!this.isValidPersistedCart(parsed)) {
        console.warn(`Invalid cart structure in ${key}`);
        localStorage.removeItem(key);
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn(`Failed to parse cart from ${key}:`, error);
      localStorage.removeItem(key);
      return null;
    }
  }

  /**
   * Validate persisted cart structure
   */
  private static isValidPersistedCart(data: any): data is PersistedCart {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.items) &&
      typeof data.updatedAt === 'string' &&
      typeof data.expiresAt === 'string'
    );
  }

  /**
   * Migrate cart items from older versions
   */
  private static migrateCartItems(items: any[]): CartItem[] {
    return items.map(item => ({
      productId: item.productId || item.id,
      quantity: item.quantity || 1,
      size: item.size || 'M',
      name: item.name || 'Unknown Product',
      price: item.price || 0,
      image: item.image,
      metadata: item.metadata || {},
      stripePriceId: item.stripePriceId,
      stripeProductId: item.stripeProductId || item.metadata?.stripe_product_id,
    })).filter(item => item.productId);
  }

  /**
   * Clear all cart storage
   */
  static clearCartStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(CART_BACKUP_KEY);
    } catch (error) {
      console.warn('Failed to clear cart storage:', error);
    }
  }

  /**
   * Health check for cart persistence
   */
  static healthCheck(): {
    canWrite: boolean;
    canRead: boolean;
    storageAvailable: boolean;
  } {
    if (typeof window === 'undefined') {
      return { canWrite: false, canRead: false, storageAvailable: false };
    }

    let canWrite = false;
    let canRead = false;
    let storageAvailable = false;

    try {
      storageAvailable = 'localStorage' in window && window.localStorage !== null;

      if (storageAvailable) {
        const testKey = 'kct-test-write';
        const testValue = 'test';
        localStorage.setItem(testKey, testValue);
        canWrite = true;

        const readValue = localStorage.getItem(testKey);
        canRead = readValue === testValue;

        localStorage.removeItem(testKey);
      }
    } catch (error) {
      console.warn('Cart persistence health check failed:', error);
    }

    return { canWrite, canRead, storageAvailable };
  }
}

// Legacy function exports for compatibility
export function saveCartToStorage(items: CartItem[]): boolean {
  return CartPersistenceManager.saveCartToStorage(items);
}

export function loadCartFromStorage(): CartItem[] {
  return CartPersistenceManager.loadCartFromStorage();
}

export function clearCartStorage(): void {
  CartPersistenceManager.clearCartStorage();
}

/**
 * Hook for cart hydration that prevents SSR mismatches
 */
export function useCartHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}