// Google Analytics 4 Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// GA Item interface
export interface GAItem {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  quantity: number;
  item_variant?: string;
}

// Check if GA is available
export const isGAEnabled = () => {
  return typeof window !== 'undefined' && GA_MEASUREMENT_ID;
};

// Initialize Google Analytics
export const initGA = () => {
  if (!isGAEnabled()) return;

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle page views manually
    // Enhanced measurement settings
    page_location: window.location.href,
    page_referrer: document.referrer,
    // Enhanced e-commerce
    currency: 'USD',
    // User properties
    user_properties: {
      platform: 'web',
    }
  });
};

// Page view tracking
export const trackPageView = (url: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: url,
  });
};

// Custom event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track custom events (alias for trackEvent with more flexible parameters)
export const trackCustomEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', eventName, parameters || {});
};

// E-commerce tracking functions
export const trackViewItem = (item: {
  item_id: string;
  item_name: string;
  category: string;
  price: number;
  currency?: string;
}) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'view_item', {
    currency: item.currency || 'USD',
    value: item.price,
    items: [{
      item_id: item.item_id,
      item_name: item.item_name,
      category: item.category,
      price: item.price,
      quantity: 1,
    }],
  });
};

export const trackAddToCart = (item: {
  item_id: string;
  item_name: string;
  category: string;
  price: number;
  quantity: number;
  size?: string;
  currency?: string;
}) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'add_to_cart', {
    currency: item.currency || 'USD',
    value: item.price * item.quantity,
    items: [{
      item_id: item.item_id,
      item_name: item.item_name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.size,
    }],
  });
};

export const trackRemoveFromCart = (item: {
  item_id: string;
  item_name: string;
  category: string;
  price: number;
  quantity: number;
  size?: string;
  currency?: string;
}) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'remove_from_cart', {
    currency: item.currency || 'USD',
    value: item.price * item.quantity,
    items: [{
      item_id: item.item_id,
      item_name: item.item_name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.size,
    }],
  });
};

export const trackBeginCheckout = (items: GAItem[], total: number) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: total,
    items: items.map(item => ({
      item_id: item.productId,
      item_name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.size,
    })),
  });
};

export const trackPurchase = (orderData: {
  transaction_id: string;
  value: number;
  tax?: number;
  shipping?: number;
  currency?: string;
  items: GAItem[];
}) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: orderData.transaction_id,
    value: orderData.value,
    tax: orderData.tax || 0,
    shipping: orderData.shipping || 0,
    currency: orderData.currency || 'USD',
    items: orderData.items.map(item => ({
      item_id: item.productId,
      item_name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.size,
    })),
  });
};

// User tracking
export const trackLogin = (method: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'login', {
    method: method,
  });
};

export const trackSignUp = (method: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'sign_up', {
    method: method,
  });
};

// Search tracking
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

// Conversion tracking
export const trackConversion = (conversionId: string, value?: number) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'conversion', {
    send_to: `${GA_MEASUREMENT_ID}/${conversionId}`,
    value: value,
    currency: 'USD',
  });
};

// Enhanced E-commerce tracking
export const trackViewItemList = (items: any[], listName: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'view_item_list', {
    item_list_name: listName,
    items: items.map((item, index) => ({
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      price: item.price,
      index: index,
    })),
  });
};

export const trackSelectItem = (item: any, listName: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'select_item', {
    item_list_name: listName,
    items: [{
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      price: item.price,
    }],
  });
};

// Custom dimensions
export const setUserProperties = (properties: Record<string, any>) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
};

// Debug mode
export const enableDebugMode = () => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    debug_mode: true,
  });
};

// Enhanced tracking events
export const trackProductClick = (item: any, listName: string, index: number) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'select_item', {
    item_list_id: listName,
    item_list_name: listName,
    items: [{
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      price: item.price,
      index: index,
    }],
  });
};

export const trackPromoView = (promoName: string, promoId: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'view_promotion', {
    promotion_id: promoId,
    promotion_name: promoName,
    creative_name: promoName,
    creative_slot: 'banner',
  });
};

export const trackPromoClick = (promoName: string, promoId: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'select_promotion', {
    promotion_id: promoId,
    promotion_name: promoName,
    creative_name: promoName,
    creative_slot: 'banner',
  });
};

// Wishlist tracking
export const trackAddToWishlist = (item: any) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'add_to_wishlist', {
    currency: 'USD',
    value: item.price,
    items: [{
      item_id: item.item_id,
      item_name: item.item_name,
      category: item.category,
      price: item.price,
    }],
  });
};

// Engagement tracking
export const trackShare = (method: string, contentType: string, itemId?: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'share', {
    method: method,
    content_type: contentType,
    item_id: itemId,
  });
};

export const trackVideoView = (videoTitle: string, videoId: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'video_start', {
    video_title: videoTitle,
    video_id: videoId,
  });
};

// Form tracking
export const trackFormStart = (formName: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'form_start', {
    form_name: formName,
  });
};

export const trackFormSubmit = (formName: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'form_submit', {
    form_name: formName,
  });
};

// Customer value tracking
export const trackCustomerLifetimeValue = (value: number, customerType: string) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'page_view', {
    user_properties: {
      lifetime_value: value,
      customer_type: customerType,
    }
  });
};

// Refund tracking
export const trackRefund = (transactionId: string, value: number, items: any[]) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'refund', {
    transaction_id: transactionId,
    value: value,
    currency: 'USD',
    items: items,
  });
};

// Cart value tracking
export const trackViewCart = (value: number, items: any[]) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'view_cart', {
    currency: 'USD',
    value: value,
    items: items.map(item => ({
      item_id: item.productId,
      item_name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.size,
    })),
  });
};

// Checkout progress tracking
export const trackCheckoutProgress = (step: number, stepName: string, value: number) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'checkout_progress', {
    checkout_step: step,
    checkout_option: stepName,
    value: value,
    currency: 'USD',
  });
};

// Enhanced user engagement
export const trackEngagement = (engagementType: string, engagementValue?: number) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'user_engagement', {
    engagement_type: engagementType,
    engagement_value: engagementValue,
  });
};

// Track scroll depth
export const trackScrollDepth = (percentage: number) => {
  if (!isGAEnabled() || !window.gtag) return;

  window.gtag('event', 'scroll', {
    percent_scrolled: percentage,
  });
};