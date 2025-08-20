"use client";

import { 
  AnalyticsEvent, 
  PageViewEvent, 
  AddToCartEvent, 
  RemoveFromCartEvent,
  CheckoutEvent,
  StyleQuizEvent,
  SearchEvent,
  FilterEvent,
  UserProfile,
  EcommerceEvent
} from "./types";

class AnalyticsClient {
  private sessionId: string;
  private userId: string | null = null;
  private queue: AnalyticsEvent[] = [];
  private isInitialized = false;
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  init(config?: { userId?: string }) {
    if (this.isInitialized) return;

    this.userId = config?.userId || null;
    this.isInitialized = true;

    // Set up automatic flushing every 10 seconds
    this.flushInterval = setInterval(() => {
      this.flush();
    }, 10000);

    // Flush on page unload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        this.flush();
      });
    }

    // Track initial page view
    this.pageView({
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
    });
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private track(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
    };

    this.queue.push(event);

    // Flush if queue is getting large
    if (this.queue.length >= 20) {
      this.flush();
    }

    // Also send to Google Analytics if available
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", eventName, properties);
    }
  }

  pageView(data: PageViewEvent) {
    this.track("page_view", {
      ...data,
      timestamp: Date.now(),
    });

    // Track product views separately
    if (data.productId) {
      this.track("product_view", {
        productId: data.productId,
        category: data.category,
      });
    }
  }

  addToCart(data: AddToCartEvent) {
    this.track("add_to_cart", data);

    // Track ecommerce event for GA4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "add_to_cart", {
        currency: "USD",
        value: data.price * data.quantity,
        items: [{
          item_id: data.productId,
          item_name: data.productName,
          item_category: data.category,
          price: data.price / 100, // Convert cents to dollars
          quantity: data.quantity,
          item_variant: data.size,
        }],
      });
    }
  }

  removeFromCart(data: RemoveFromCartEvent) {
    this.track("remove_from_cart", data);
  }

  beginCheckout(items: EcommerceEvent["items"], value: number) {
    this.track("begin_checkout", {
      currency: "USD",
      value,
      items,
    });
  }

  purchase(orderId: string, items: EcommerceEvent["items"], value: number, tax: number, shipping: number) {
    this.track("purchase", {
      transaction_id: orderId,
      currency: "USD",
      value,
      tax,
      shipping,
      items,
    });
  }

  checkoutStep(data: CheckoutEvent) {
    this.track(`checkout_${data.step}`, data);

    // Track funnel progression
    this.trackFunnelStep(`checkout_${data.step}`, {
      orderId: data.orderId,
      value: data.value,
    });
  }

  styleQuiz(data: StyleQuizEvent) {
    this.track(`style_quiz_${data.step}`, data);

    if (data.step === "completed" && data.results) {
      // Track user traits based on quiz results
      this.updateUserTraits({
        stylePersona: data.results.stylePersona,
        preferredFit: data.results.fit,
        preferredColors: data.results.colors,
        shoppingOccasions: data.results.occasions,
      });
    }
  }

  search(data: SearchEvent) {
    this.track("search", data);

    // Track search result clicks
    if (data.clickedPosition !== undefined) {
      this.track("search_result_click", {
        query: data.query,
        position: data.clickedPosition,
      });
    }
  }

  filterUsage(data: FilterEvent) {
    this.track("filter_applied", data);
  }

  trackFunnelStep(stepName: string, data?: Record<string, any>) {
    this.track("funnel_step", {
      funnel: "conversion",
      step: stepName,
      ...data,
    });
  }

  identify(userId: string, traits?: UserProfile["traits"]) {
    this.userId = userId;

    if (traits) {
      this.track("identify", {
        userId,
        traits,
      });
    }
  }

  updateUserTraits(traits: Record<string, any>) {
    if (!this.userId) return;

    this.track("traits_updated", {
      userId: this.userId,
      traits,
    });
  }

  async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {

      // Re-add events to queue
      this.queue.unshift(...events);
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }

  // Ecommerce specific methods
  viewItemList(items: EcommerceEvent["items"], listName: string) {
    this.track("view_item_list", {
      item_list_name: listName,
      items,
    });
  }

  selectItem(item: EcommerceEvent["items"][0], listName: string) {
    this.track("select_item", {
      item_list_name: listName,
      items: [item],
    });
  }

  viewPromotion(promotionId: string, promotionName: string, items?: EcommerceEvent["items"]) {
    this.track("view_promotion", {
      promotion_id: promotionId,
      promotion_name: promotionName,
      items,
    });
  }

  // Custom conversion tracking
  trackConversion(conversionType: string, value?: number, metadata?: Record<string, any>) {
    this.track("conversion", {
      type: conversionType,
      value,
      ...metadata,
    });
  }
}

// Create singleton instance
export const analytics = new AnalyticsClient();