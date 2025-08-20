import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface StoreSettings {
  store: {
    name: string;
    logo: string;
    contact_email: string;
    contact_phone: string;
    business_hours: string;
    social_links: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
    currency: string;
    tax_inclusive: boolean;
  };
  payment: {
    stripe_public_key: string;
    accepted_methods: string[];
    processing_fee: number;
  };
  shipping: {
    zones: any[];
    rates: any[];
    free_threshold: number;
    estimated_days: string;
  };
  tax: {
    rates: any[];
    applies_to_shipping: boolean;
  };
  features: {
    guest_checkout: boolean;
    wishlist: boolean;
    reviews: boolean;
    account_required: boolean;
  };
  maintenance?: {
    enabled: boolean;
    message?: string;
  };
}

export class SettingsService {
  private static cache: Map<string, any> = new Map();
  private static cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private static listeners: Set<(settings: StoreSettings) => void> = new Set();
  private static localStorageKey = 'kct-settings-backup';
  private static localStorageTimeout = 24 * 60 * 60 * 1000; // 24 hours

  // Fetch public settings from Edge Function
  static async getPublicSettings(): Promise<StoreSettings> {
    const cacheKey = 'public_settings';
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && cached.timestamp > Date.now() - this.cacheTimeout) {
      return cached.data;
    }

    // Check localStorage backup if API fails
    const localBackup = this.getLocalStorageBackup();
    
    try {
      // For now, skip Edge Function and use defaults until it's deployed
      // This prevents 404 errors from crashing the site
      const settings = this.getDefaultSettings();
      
      // Cache the settings
      this.cache.set(cacheKey, {
        data: settings,
        timestamp: Date.now()
      });
      
      // Save to localStorage as backup
      this.saveToLocalStorage(settings);
      
      return settings;
    } catch (error) {
      console.error('Failed to fetch settings, using backup:', error);
      // Return localStorage backup if available, otherwise defaults
      return localBackup || this.getDefaultSettings();
    }
    
    /* Edge Function code - restore after deployment
    try {
      // Call Edge Function
      const { data, error } = await supabase.functions.invoke('get-public-settings');
      
      if (error) throw error;
      
      // Transform the flat settings into nested structure
      const settings = this.transformSettings(data);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: settings,
        timestamp: Date.now()
      });
      
      return settings;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Return defaults if fetch fails
      return this.getDefaultSettings();
    }
    */
  }

  // LocalStorage backup methods
  private static saveToLocalStorage(settings: StoreSettings): void {
    if (typeof window === 'undefined') return;
    
    try {
      const backup = {
        settings,
        timestamp: Date.now()
      };
      localStorage.setItem(this.localStorageKey, JSON.stringify(backup));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }

  private static getLocalStorageBackup(): StoreSettings | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const backup = localStorage.getItem(this.localStorageKey);
      if (!backup) return null;
      
      const parsed = JSON.parse(backup);
      
      // Check if backup is still valid (not expired)
      if (Date.now() - parsed.timestamp > this.localStorageTimeout) {
        localStorage.removeItem(this.localStorageKey);
        return null;
      }
      
      return parsed.settings;
    } catch (error) {
      console.warn('Failed to retrieve settings from localStorage:', error);
      return null;
    }
  }

  private static clearLocalStorageBackup(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.localStorageKey);
    } catch (error) {
      console.warn('Failed to clear settings backup:', error);
    }
  }

  // Subscribe to real-time settings changes
  static subscribeToChanges(callback: (settings: StoreSettings) => void) {
    this.listeners.add(callback);
    
    const channel = supabase
      .channel('settings-changes')
      .on('broadcast', { event: 'settings-update' }, async (payload) => {
        try {
          // Update cache instead of clearing it
          const settings = await this.getPublicSettings();
          
          // Update cache timestamp
          this.cache.set('public_settings', {
            data: settings,
            timestamp: Date.now()
          });
          
          // Update localStorage backup
          this.saveToLocalStorage(settings);
          
          // Notify all listeners
          this.listeners.forEach(listener => listener(settings));
        } catch (error) {
          console.error('Failed to update settings:', error);
          // Don't clear cache on error - keep existing data
        }
      })
      .subscribe();

    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0) {
        supabase.removeChannel(channel);
      }
    };
  }

  // Transform flat database settings to nested structure
  private static transformSettings(data: any): StoreSettings {
    return {
      store: {
        name: data.store_name || 'KCT Menswear',
        logo: data.store_logo || '/KCTLogo.jpg',
        contact_email: data.contact_email || 'info@kctmenswear.com',
        contact_phone: data.contact_phone || '313-555-0100',
        business_hours: data.business_hours || 'Mon-Fri 10AM-7PM, Sat 10AM-6PM, Sun 12PM-5PM',
        social_links: data.social_links || {},
        currency: data.currency_code || 'USD',
        tax_inclusive: data.tax_inclusive_pricing || false
      },
      payment: {
        stripe_public_key: data.stripe_public_key || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
        accepted_methods: data.accepted_payment_methods || ['card', 'apple_pay', 'google_pay'],
        processing_fee: data.payment_processing_fee || 0
      },
      shipping: {
        zones: data.shipping_zones || [],
        rates: data.shipping_rates || [],
        free_threshold: data.free_shipping_threshold || 100,
        estimated_days: data.estimated_delivery_days || '3-5'
      },
      tax: {
        rates: data.tax_rates || [],
        applies_to_shipping: data.tax_applies_to_shipping || false
      },
      features: {
        guest_checkout: data.guest_checkout_enabled ?? true,
        wishlist: data.wishlist_enabled ?? true,
        reviews: data.reviews_enabled ?? true,
        account_required: data.account_creation_required ?? false
      },
      maintenance: data.maintenance_mode ? {
        enabled: data.maintenance_mode,
        message: data.maintenance_message
      } : undefined
    };
  }

  // Default settings fallback
  static getDefaultSettings(): StoreSettings {
    return {
      store: {
        name: 'KCT Menswear',
        logo: '/KCTLogo.jpg',
        contact_email: 'info@kctmenswear.com',
        contact_phone: '313-555-0100',
        business_hours: 'Mon-Fri 10AM-7PM, Sat 10AM-6PM, Sun 12PM-5PM',
        social_links: {
          facebook: 'https://facebook.com/kctmenswear',
          instagram: 'https://instagram.com/kctmenswear'
        },
        currency: 'USD',
        tax_inclusive: false
      },
      payment: {
        stripe_public_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
        accepted_methods: ['card', 'apple_pay', 'google_pay'],
        processing_fee: 0
      },
      shipping: {
        zones: [],
        rates: [],
        free_threshold: 100,
        estimated_days: '3-5'
      },
      tax: {
        rates: [],
        applies_to_shipping: false
      },
      features: {
        guest_checkout: true,
        wishlist: true,
        reviews: true,
        account_required: false
      }
    };
  }

  // Calculate shipping cost
  static calculateShipping(subtotal: number, settings: StoreSettings, zone?: string): number {
    if (subtotal >= settings.shipping.free_threshold) {
      return 0;
    }

    // Find rate for zone
    const rate = settings.shipping.rates.find(r => r.zone === zone) || 
                 settings.shipping.rates.find(r => r.zone === 'default');
    
    return rate?.amount || 10; // Default $10 shipping
  }

  // Calculate tax
  static calculateTax(subtotal: number, shipping: number, settings: StoreSettings, region?: string): number {
    const rate = settings.tax.rates.find(r => r.region === region) || 
                 settings.tax.rates.find(r => r.region === 'default');
    
    if (!rate) return 0;
    
    const taxableAmount = settings.tax.applies_to_shipping ? subtotal + shipping : subtotal;
    return taxableAmount * (rate.percentage / 100);
  }

  // Format currency
  static formatCurrency(amount: number, settings: StoreSettings): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.store.currency
    }).format(amount);
  }

  // Check if feature is enabled
  static isFeatureEnabled(feature: keyof StoreSettings['features'], settings: StoreSettings): boolean {
    return settings.features[feature] ?? false;
  }
}

// Singleton export
export const settingsService = SettingsService;