'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SettingsService, StoreSettings } from '@/lib/settings';

interface SettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(SettingsService.getDefaultSettings());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const newSettings = await SettingsService.getPublicSettings();
      setSettings(newSettings);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadSettings();

    // Subscribe to real-time changes
    const unsubscribe = SettingsService.subscribeToChanges((newSettings) => {
      setSettings(newSettings);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Check maintenance mode
  useEffect(() => {
    if (settings.maintenance?.enabled && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/maintenance')) {
        window.location.href = '/maintenance';
      }
    }
  }, [settings.maintenance]);

  const value: SettingsContextType = {
    settings,
    loading,
    error,
    refresh: loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Helper hooks for specific settings
export function useStoreInfo() {
  const { settings } = useSettings();
  return settings.store;
}

export function usePaymentSettings() {
  const { settings } = useSettings();
  return settings.payment;
}

export function useShippingSettings() {
  const { settings } = useSettings();
  return settings.shipping;
}

export function useTaxSettings() {
  const { settings } = useSettings();
  return settings.tax;
}

export function useFeatureFlags() {
  const { settings } = useSettings();
  return settings.features;
}

// Helper function to check if a feature is enabled
export function useFeature(feature: keyof StoreSettings['features']) {
  const { settings } = useSettings();
  return settings.features[feature] ?? false;
}

// Currency formatting hook
export function useCurrency() {
  const { settings } = useSettings();
  
  const format = (amount: number) => {
    return SettingsService.formatCurrency(amount, settings);
  };
  
  return { format, currency: settings.store.currency };
}

// Shipping calculator hook
export function useShippingCalculator() {
  const { settings } = useSettings();
  
  const calculate = (subtotal: number, zone?: string) => {
    return SettingsService.calculateShipping(subtotal, settings, zone);
  };
  
  return { calculate, freeThreshold: settings.shipping.free_threshold };
}

// Tax calculator hook
export function useTaxCalculator() {
  const { settings } = useSettings();
  
  const calculate = (subtotal: number, shipping: number, region?: string) => {
    return SettingsService.calculateTax(subtotal, shipping, settings, region);
  };
  
  return { calculate, inclusive: settings.store.tax_inclusive };
}