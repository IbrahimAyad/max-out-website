import { 
  trackViewContent, 
  trackAddToCart, 
  trackPurchase,
  trackStyleQuizStart,
  trackStyleQuizComplete,
  trackAppointmentBooked,
  trackBundleView,
  trackWeddingInterest,
  trackPromInterest,
  trackCustomEvent,
  trackSearch,
  trackAddToWishlist,
  trackCompleteRegistration,
  trackLead,
  trackSubscribe
} from './facebook-pixel';

export interface FacebookEventParams {
  content_name?: string;
  content_category?: string;
  content_type?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  num_items?: number;
  [key: string]: any;
}

export class FacebookTrackingService {
  private static instance: FacebookTrackingService;

  private constructor() {}

  static getInstance(): FacebookTrackingService {
    if (!FacebookTrackingService.instance) {
      FacebookTrackingService.instance = new FacebookTrackingService();
    }
    return FacebookTrackingService.instance;
  }

  // Track SDK Events using window.FB.AppEvents
  trackSDKEvent(eventName: string, parameters: Record<string, any> = {}) {
    if (window.FB && window.FB.AppEvents) {
      window.FB.AppEvents.logEvent(eventName, parameters);
    }
  }

  // Product Related Events
  trackProductView(productId: string, productName: string, price: number, category: string) {
    trackViewContent({
      content_type: 'product',
      content_ids: [productId],
      content_name: productName,
      content_category: category,
      value: price,
      currency: 'USD'
    });

    // Also track SDK event
    this.trackSDKEvent('product_viewed', {
      content_id: productId,
      content_type: 'product',
      value: price
    });
  }

  trackProductAddToCart(productId: string, productName: string, price: number, quantity: number = 1) {
    trackAddToCart({
      content_type: 'product',
      content_ids: [productId],
      content_name: productName,
      value: price * quantity,
      currency: 'USD'
    });

    this.trackSDKEvent('added_to_cart', {
      content_id: productId,
      content_type: 'product',
      value: price * quantity,
      num_items: quantity
    });
  }

  // Bundle Related Events
  trackBundleInteraction(bundleName: string, bundlePrice: number, action: 'view' | 'add_to_cart') {
    if (action === 'view') {
      trackBundleView(bundleName, bundlePrice);
    } else {
      trackAddToCart({
        content_type: 'product_group',
        content_name: bundleName,
        value: bundlePrice,
        currency: 'USD'
      });
    }

    this.trackSDKEvent(`bundle_${action}`, {
      bundle_name: bundleName,
      value: bundlePrice
    });
  }

  // Style Quiz Events
  trackStyleQuizProgress(step: 'start' | 'complete', data?: { styleType?: string; budget?: string }) {
    if (step === 'start') {
      trackStyleQuizStart();
      this.trackSDKEvent('quiz_started', {
        content_type: 'style_quiz',
        value: 25.00
      });
    } else if (step === 'complete' && data) {
      trackStyleQuizComplete(data.styleType || '', data.budget || '');
      this.trackSDKEvent('quiz_completed', {
        content_type: 'style_quiz',
        style_type: data.styleType,
        budget_range: data.budget,
        value: 50.00
      });
    }
  }

  // Wedding & Prom Events
  trackSpecialEventInterest(eventType: 'wedding' | 'prom', details?: any) {
    if (eventType === 'wedding') {
      trackWeddingInterest(details?.action || 'page_view');
      this.trackSDKEvent('wedding_interest', {
        action: details?.action,
        value: 200.00
      });
    } else if (eventType === 'prom') {
      trackPromInterest(details?.school);
      this.trackSDKEvent('prom_interest', {
        school: details?.school,
        value: 100.00
      });
    }
  }

  // Appointment Booking
  trackAppointment(type: string = 'styling') {
    trackAppointmentBooked(type);
    this.trackSDKEvent('consultation_booked', {
      content_type: 'appointment',
      consultation_type: type,
      value: 150.00
    });
  }

  // Lead Generation
  trackLeadGeneration(source: string, value: number = 30) {
    trackLead({
      content_name: `Lead from ${source}`,
      content_category: 'Lead Generation',
      value: value,
      currency: 'USD'
    });

    this.trackSDKEvent('lead_generated', {
      lead_source: source,
      value: value
    });
  }

  // Newsletter Subscription
  trackNewsletterSignup(source: string) {
    trackSubscribe({
      value: 15.00,
      currency: 'USD'
    });

    this.trackSDKEvent('newsletter_signup', {
      signup_source: source,
      value: 15.00
    });
  }

  // Search Events
  trackProductSearch(searchTerm: string, resultsCount?: number) {
    trackSearch(searchTerm);
    
    this.trackSDKEvent('search_performed', {
      search_string: searchTerm,
      results_count: resultsCount,
      content_type: 'product'
    });
  }

  // Wishlist Events
  trackWishlistAction(productId: string, productName: string, price: number, action: 'add' | 'remove') {
    if (action === 'add') {
      trackAddToWishlist({
        content_ids: [productId],
        content_name: productName,
        value: price,
        currency: 'USD'
      });
    }

    this.trackSDKEvent(`wishlist_${action}`, {
      product_id: productId,
      product_name: productName,
      value: price
    });
  }

  // Purchase Event
  trackPurchaseComplete(orderId: string, totalValue: number, items: any[], customerInfo?: any) {
    const productIds = items.map(item => item.id);
    const numItems = items.reduce((sum, item) => sum + item.quantity, 0);

    trackPurchase({
      content_type: 'product',
      content_ids: productIds,
      value: totalValue,
      currency: 'USD',
      num_items: numItems
    });

    this.trackSDKEvent('purchase_completed', {
      order_id: orderId,
      value: totalValue,
      num_items: numItems,
      customer_segment: customerInfo?.segment
    });
  }

  // High-Value Page Views
  trackHighValuePageView(pageType: string) {
    const valueMap: Record<string, number> = {
      'wedding-collection': 75,
      'premium-suits': 100,
      'custom-tailoring': 150,
      'bundle-deals': 80,
      'style-quiz': 50
    };

    trackCustomEvent('HighValuePageView', {
      page_type: pageType,
      content_category: 'Premium Interest',
      value: valueMap[pageType] || 50,
      currency: 'USD'
    });
  }

  // Custom Events for specific KCT features
  trackSizeBotInteraction(action: string, recommendation?: string) {
    trackCustomEvent('SizeBotInteraction', {
      action: action,
      recommendation: recommendation,
      value: 10.00,
      currency: 'USD'
    });
  }

  trackVisualSearchUsed(resultsCount: number) {
    trackCustomEvent('VisualSearchUsed', {
      results_count: resultsCount,
      value: 20.00,
      currency: 'USD'
    });
  }

  trackVideoEngagement(videoId: string, watchTime: number) {
    trackCustomEvent('VideoEngagement', {
      video_id: videoId,
      watch_time_seconds: watchTime,
      engagement_level: watchTime > 30 ? 'high' : 'low',
      value: watchTime > 30 ? 15.00 : 5.00,
      currency: 'USD'
    });
  }
}

// Export singleton instance
export const facebookTracking = FacebookTrackingService.getInstance();