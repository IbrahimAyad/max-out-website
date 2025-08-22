declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    FB: any;
  }
}

// Facebook App Configuration - Use environment variables for security
const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID || '';
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1409898642574301'; // Fallback to known working ID
const FB_API_VERSION = process.env.NEXT_PUBLIC_FB_API_VERSION || 'v22.0';
const FB_CLIENT_TOKEN = process.env.NEXT_PUBLIC_FB_CLIENT_TOKEN || '';
const FB_DATASET_ID = process.env.NEXT_PUBLIC_FB_DATASET_ID || '';

// Initialize Facebook SDK
export const initializeFacebookSDK = () => {
  // Initialize Facebook SDK
  window.fbAsyncInit = function() {
    window.FB.init({
      appId: FB_APP_ID,
      cookie: true,
      xfbml: true,
      version: FB_API_VERSION
    });

    window.FB.AppEvents.logPageView();
  };

  // Load Facebook SDK
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s) as HTMLScriptElement; 
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode?.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
};

// Initialize Facebook Pixel
export const initializeFacebookPixel = () => {
  if (typeof window === 'undefined') return;
  
  // Skip if Pixel ID is not available
  if (!FB_PIXEL_ID || FB_PIXEL_ID === 'null' || FB_PIXEL_ID === '') {
    console.warn('Facebook Pixel ID not configured');
    return;
  }

  // Facebook Pixel Code
  !function(f,b,e,v,n,t,s) {
    if(f.fbq) return; 
    n=f.fbq=function(){
      n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
    };
    if(!f._fbq) f._fbq=n; 
    n.push=n; 
    n.loaded=!0; 
    n.version='2.0';
    n.queue=[]; 
    t=b.createElement(e); 
    t.async=!0;
    t.src=v; 
    s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  // Initialize Pixel
  window.fbq('init', FB_PIXEL_ID);
  window.fbq('track', 'PageView');
};

// Helper function to check if Facebook Pixel is loaded
const isFBPixelEnabled = () => {
  return typeof window !== 'undefined' && window.fbq;
};

// Track standard events
export const trackPageView = () => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'PageView');
};

export const trackViewContent = (content: {
  content_ids: string[];
  content_name?: string;
  content_category?: string;
  content_type: string;
  value: number;
  currency: string;
}) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'ViewContent', content);
};

export const trackAddToCart = (params: {
  content_ids: string[];
  content_name?: string;
  content_type: string;
  value: number;
  currency: string;
  content_category?: string;
}) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'AddToCart', params);
};

export const trackInitiateCheckout = (params: {
  content_ids: string[];
  content_category?: string;
  num_items: number;
  value: number;
  currency: string;
}) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'InitiateCheckout', params);
};

export const trackPurchase = (params: {
  content_ids: string[];
  content_name?: string;
  content_type: string;
  num_items: number;
  value: number;
  currency: string;
}) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'Purchase', params);
};

export const trackSearch = (searchString: string) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'Search', {
    search_string: searchString
  });
};

export const trackAddToWishlist = (params: {
  content_ids: string[];
  content_name?: string;
  value: number;
  currency: string;
}) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'AddToWishlist', params);
};

export const trackCompleteRegistration = (params?: {
  value?: number;
  currency?: string;
  content_name?: string;
  status?: boolean;
}) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'CompleteRegistration', params);
};

export const trackLead = (params?: {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
}) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'Lead', params);
};

export const trackSubscribe = (params?: {
  value?: number;
  currency?: string;
  predicted_ltv?: number;
}) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'Subscribe', params);
};

// Custom events
export const trackCustomEvent = (eventName: string, params?: any) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('trackCustom', eventName, params);
};

// Advanced Matching - helps improve conversion tracking
export const setUserData = (userData: {
  em?: string; // Email (hashed automatically)
  fn?: string; // First name (hashed automatically)
  ln?: string; // Last name (hashed automatically)
  ph?: string; // Phone (hashed automatically)
  external_id?: string; // Any unique ID from your system
  ge?: 'm' | 'f'; // Gender
  db?: string; // Date of birth YYYYMMDD
  ct?: string; // City
  st?: string; // State
  zp?: string; // Zip code
  country?: string; // Country
}) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('init', FB_PIXEL_ID, userData);
};

// Conversion API Events (Server-Side)
// These would typically be sent from your backend
export const getConversionAPIPayload = (event: {
  event_name: string;
  event_time: number;
  user_data: any;
  custom_data?: any;
  event_source_url: string;
  action_source: 'website' | 'app' | 'offline' | 'other';
}) => {
  return {
    data: [{
      ...event,
      event_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique event ID
      data_processing_options: [], // For CCPA compliance
      data_processing_options_country: 0,
      data_processing_options_state: 0,
    }],
    access_token: process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN, // You'll need to add this
    test_event_code: process.env.NEXT_PUBLIC_FB_TEST_EVENT_CODE, // For testing events
  };
};

// Enhanced event tracking with more specific KCT events
export const trackStyleQuizStart = () => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'Lead', {
    content_name: "Stylin' Profilin' Started",
    content_category: 'Lead Generation',
    value: 25.00,
    currency: 'USD'
  });
};

export const trackStyleQuizComplete = (styleType: string, budget: string) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'CompleteRegistration', {
    content_name: "Stylin' Profilin' Completed",
    content_category: 'Lead Generation',
    style_type: styleType,
    budget_range: budget,
    value: 50.00,
    currency: 'USD'
  });
};

export const trackAppointmentBooked = (appointmentType: string) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'Schedule', {
    content_name: `${appointmentType} Appointment Booked`,
    content_category: 'Appointment',
    value: 150.00,
    currency: 'USD'
  });
};

export const trackBundleView = (bundleName: string, bundlePrice: number) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('track', 'ViewContent', {
    content_name: bundleName,
    content_category: 'Bundle',
    content_type: 'product_group',
    value: bundlePrice,
    currency: 'USD'
  });
};

export const trackWeddingInterest = (action: string) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('trackCustom', 'WeddingInterest', {
    action: action,
    content_category: 'Wedding',
    value: 200.00,
    currency: 'USD'
  });
};

export const trackPromInterest = (school?: string) => {
  if (!isFBPixelEnabled()) return;
  window.fbq('trackCustom', 'PromInterest', {
    school: school || 'not_specified',
    content_category: 'Prom',
    value: 100.00,
    currency: 'USD'
  });
};

// Facebook Login
export const loginWithFacebook = () => {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error('Facebook SDK not loaded'));
      return;
    }

    window.FB.login((response: any) => {
      if (response.authResponse) {
        // Get user data
        window.FB.api('/me', { fields: 'id,name,email' }, (userData: any) => {
          resolve({
            ...userData,
            accessToken: response.authResponse.accessToken,
          });
        });
      } else {
        reject(new Error('User cancelled login or did not fully authorize.'));
      }
    }, { scope: 'public_profile,email' });
  });
};

// Share functionality
export const shareOnFacebook = (url: string, quote?: string) => {
  if (!window.FB) {
    // Fallback to share dialog
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}${quote ? `&quote=${encodeURIComponent(quote)}` : ''}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    return;
  }

  window.FB.ui({
    method: 'share',
    href: url,
    quote: quote,
  }, (response: any) => {
    // Handle response
    if (response && !response.error_message) {

    }
  });
};

// Messenger Customer Chat Plugin
export const initializeMessengerChat = (pageId: string) => {
  const script = document.createElement('script');
  script.innerHTML = `
    window.fbAsyncInit = function() {
      FB.init({
        xfbml: true,
        version: '${FB_API_VERSION}'
      });
    };
  `;
  document.head.appendChild(script);

  // Add messenger plugin div
  const messengerDiv = document.createElement('div');
  messengerDiv.className = 'fb-customerchat';
  messengerDiv.setAttribute('page_id', pageId);
  messengerDiv.setAttribute('theme_color', '#D4AF37'); // Gold color to match brand
  messengerDiv.setAttribute('logged_in_greeting', 'Hi! How can we help you find the perfect outfit?');
  messengerDiv.setAttribute('logged_out_greeting', 'Hi! How can we help you find the perfect outfit?');
  document.body.appendChild(messengerDiv);
};