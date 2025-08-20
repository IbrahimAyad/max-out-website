/**
 * Google Analytics 4 E-commerce Implementation
 * Comprehensive tracking for all user interactions and conversions
 */

// GA4 Measurement ID (set in environment variable)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export function initGA() {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  // Load GA4 script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);
  
  // Initialize dataLayer and gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).gtag = function() {
    (window as any).dataLayer.push(arguments);
  };
  (window as any).gtag('js', new Date());
  (window as any).gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true
  });
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

// E-commerce Events
export interface Product {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_variant?: string;
  price: number;
  quantity?: number;
  item_brand?: string;
  index?: number;
  discount?: number;
}

// View item list (collection pages)
export function trackViewItemList(listName: string, products: Product[]) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'view_item_list', {
    item_list_id: listName.toLowerCase().replace(' ', '_'),
    item_list_name: listName,
    items: products
  });
}

// View item (product detail page)
export function trackViewItem(product: Product, value: number) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'view_item', {
    currency: 'USD',
    value: value,
    items: [product]
  });
}

// Select item (click on product)
export function trackSelectItem(product: Product, listName?: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'select_item', {
    item_list_id: listName?.toLowerCase().replace(' ', '_'),
    item_list_name: listName,
    items: [product]
  });
}

// Add to cart
export function trackAddToCart(product: Product, value: number) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: value,
    items: [product]
  });
}

// Remove from cart
export function trackRemoveFromCart(product: Product, value: number) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'remove_from_cart', {
    currency: 'USD',
    value: value,
    items: [product]
  });
}

// View cart
export function trackViewCart(products: Product[], value: number) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'view_cart', {
    currency: 'USD',
    value: value,
    items: products
  });
}

// Begin checkout
export function trackBeginCheckout(products: Product[], value: number, coupon?: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: value,
    coupon: coupon,
    items: products
  });
}

// Add shipping info
export function trackAddShippingInfo(products: Product[], value: number, shippingTier: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'add_shipping_info', {
    currency: 'USD',
    value: value,
    shipping_tier: shippingTier,
    items: products
  });
}

// Add payment info
export function trackAddPaymentInfo(products: Product[], value: number, paymentType: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'add_payment_info', {
    currency: 'USD',
    value: value,
    payment_type: paymentType,
    items: products
  });
}

// Purchase
export function trackPurchase(
  transactionId: string,
  products: Product[],
  value: number,
  tax: number,
  shipping: number,
  coupon?: string
) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    tax: tax,
    shipping: shipping,
    currency: 'USD',
    coupon: coupon,
    items: products
  });
}

// Refund
export function trackRefund(transactionId: string, products?: Product[], value?: number) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'refund', {
    transaction_id: transactionId,
    value: value,
    currency: 'USD',
    items: products
  });
}

// Search
export function trackSearch(searchTerm: string, resultsCount?: number) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'search', {
    search_term: searchTerm,
    number_of_results: resultsCount
  });
}

// Sign up
export function trackSignUp(method: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'sign_up', {
    method: method
  });
}

// Login
export function trackLogin(method: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'login', {
    method: method
  });
}

// Custom Events

// Track collection filter
export function trackFilterCollection(collectionName: string, filters: Record<string, any>) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'filter_collection', {
    collection_name: collectionName,
    filters: JSON.stringify(filters)
  });
}

// Track quick view
export function trackQuickView(product: Product) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'quick_view', {
    item_id: product.item_id,
    item_name: product.item_name,
    item_category: product.item_category,
    price: product.price
  });
}

// Track wishlist add
export function trackAddToWishlist(product: Product) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'add_to_wishlist', {
    currency: 'USD',
    value: product.price,
    items: [product]
  });
}

// Track size guide view
export function trackSizeGuideView(productCategory: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'view_size_guide', {
    product_category: productCategory
  });
}

// Track appointment booking
export function trackAppointmentBooking(appointmentType: string, date: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'book_appointment', {
    appointment_type: appointmentType,
    appointment_date: date
  });
}

// Track newsletter signup
export function trackNewsletterSignup(source: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'newsletter_signup', {
    source: source
  });
}

// Track recommendation interaction
export function trackRecommendationClick(fromProduct: string, toProduct: string, reason: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'recommendation_click', {
    from_product: fromProduct,
    to_product: toProduct,
    recommendation_reason: reason
  });
}

// Track style quiz completion
export function trackStyleQuizComplete(quizResult: string, recommendedProducts: number) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag('event', 'complete_style_quiz', {
    quiz_result: quizResult,
    recommended_products_count: recommendedProducts
  });
}

// Helper function to format product for GA4
export function formatProductForGA4(product: any): Product {
  return {
    item_id: product.id || product.sku,
    item_name: product.name,
    item_category: product.category,
    item_category2: product.subcategory,
    item_variant: product.color,
    price: product.sale_price || product.price,
    quantity: product.quantity || 1,
    item_brand: 'KCT Menswear',
    discount: product.sale_price ? product.price - product.sale_price : 0
  };
}

// Enhanced E-commerce debugging (development only)
export function enableGA4Debug() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;
  
  (window as any).gtag('config', GA_MEASUREMENT_ID, {
    debug_mode: true
  });
}