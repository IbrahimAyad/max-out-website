"use client";

import { useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "../analyticsClient";
import { useAuth } from "@/lib/hooks/useAuth";

export function useAnalytics() {
  const { customer, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize analytics with user context
  useEffect(() => {
    if (isAuthenticated && customer) {
      analytics.init({ userId: customer.id });
      analytics.identify(customer.id, {
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      });
    } else {
      analytics.init();
    }

    return () => {
      analytics.destroy();
    };
  }, [isAuthenticated, customer]);

  // Track page views
  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    
    analytics.pageView({
      url,
      title: document.title,
      referrer: document.referrer,
    });
  }, [pathname, searchParams]);

  return analytics;
}

export function useTrackProductView(productId?: string, category?: string) {
  const pathname = usePathname();

  useEffect(() => {
    if (productId && pathname.includes("/products/")) {
      analytics.pageView({
        url: window.location.href,
        title: document.title,
        productId,
        category,
      });
    }
  }, [productId, category, pathname]);
}

export function useTrackSearch() {
  const trackSearch = useCallback((query: string, resultsCount: number, filters?: Record<string, any>) => {
    analytics.search({
      query,
      resultsCount,
      filters,
    });
  }, []);

  const trackSearchClick = useCallback((query: string, position: number) => {
    analytics.search({
      query,
      resultsCount: 0,
      clickedPosition: position,
    });
  }, []);

  return { trackSearch, trackSearchClick };
}

export function useTrackCart() {
  const trackAddToCart = useCallback((data: {
    productId: string;
    productName: string;
    category: string;
    price: number;
    quantity: number;
    size: string;
    source?: "product_page" | "quick_add" | "recommendations" | "search";
  }) => {
    analytics.addToCart({
      ...data,
      source: data.source || "product_page",
    });
  }, []);

  const trackRemoveFromCart = useCallback((data: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    size: string;
  }) => {
    analytics.removeFromCart(data);
  }, []);

  return { trackAddToCart, trackRemoveFromCart };
}

export function useTrackCheckout() {
  const trackCheckoutStep = useCallback((
    step: "started" | "shipping" | "payment" | "completed",
    data?: {
      orderId?: string;
      value?: number;
      items?: number;
    }
  ) => {
    analytics.checkoutStep({
      step,
      ...data,
    });
  }, []);

  const trackPurchase = useCallback((data: {
    orderId: string;
    items: Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      quantity: number;
      size?: string;
    }>;
    value: number;
    tax: number;
    shipping: number;
  }) => {
    analytics.purchase(
      data.orderId,
      data.items,
      data.value,
      data.tax,
      data.shipping
    );
  }, []);

  return { trackCheckoutStep, trackPurchase };
}

export function useTrackFilters() {
  const trackFilterUsage = useCallback((
    filterType: "category" | "size" | "color" | "price" | "sort",
    value: string | string[] | number[],
    resultsCount: number
  ) => {
    analytics.filterUsage({
      filterType,
      value,
      resultsCount,
    });
  }, []);

  return { trackFilterUsage };
}

export function useTrackStyleQuiz() {
  const trackQuizStep = useCallback((
    step: "started" | "completed" | "abandoned",
    data?: {
      stepNumber?: number;
      totalSteps?: number;
      results?: any;
    }
  ) => {
    analytics.styleQuiz({
      step,
      ...data,
    });
  }, []);

  return { trackQuizStep };
}

export function useConversionTracking() {
  const trackConversion = useCallback((
    type: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    analytics.trackConversion(type, value, metadata);
  }, []);

  const trackFunnelStep = useCallback((
    stepName: string,
    data?: Record<string, any>
  ) => {
    analytics.trackFunnelStep(stepName, data);
  }, []);

  return { trackConversion, trackFunnelStep };
}