/**
 * MiniMax Admin Backend Configuration
 * Connects to the powerful admin system for order processing
 */

export const MINIMAX_CONFIG = {
  // Supabase Edge Functions Base URL
  API_BASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
    : 'https://your-project.supabase.co/functions/v1',
  
  // API Endpoints from MiniMax Admin
  endpoints: {
    // Order Management
    createOrder: '/create-order',
    getOrder: '/get-order',
    updateOrder: '/update-order',
    listOrders: '/list-orders',
    
    // Payment Processing
    createPaymentIntent: '/create-payment-intent',
    confirmPayment: '/confirm-payment',
    refundPayment: '/refund-payment',
    
    // Shipping
    calculateShipping: '/calculate-shipping',
    createShippingLabel: '/create-shipping-label',
    trackShipment: '/track-shipment',
    
    // Email Notifications
    sendOrderConfirmation: '/send-order-confirmation',
    sendShippingNotification: '/send-shipping-notification',
    sendAdminNotification: '/send-admin-notification',
    
    // Inventory
    checkInventory: '/check-inventory',
    updateInventory: '/update-inventory',
    
    // Customer
    createCustomer: '/create-customer',
    getCustomer: '/get-customer',
    updateCustomer: '/update-customer',
  },
  
  // Product Types (from MiniMax documentation)
  productTypes: {
    CORE: 'core',        // Stripe products with price IDs
    CATALOG: 'catalog',  // Supabase products without Stripe IDs
  },
  
  // Order Status Values
  orderStatus: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    PAID: 'paid',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },
  
  // Payment Methods
  paymentMethods: {
    STRIPE: 'stripe',
    PAYPAL: 'paypal',
    APPLE_PAY: 'apple_pay',
    GOOGLE_PAY: 'google_pay',
  },
  
  // Shipping Carriers
  carriers: {
    USPS: 'usps',
    UPS: 'ups',
    FEDEX: 'fedex',
    DHL: 'dhl',
  },
  
  // Email Templates
  emailTemplates: {
    ORDER_CONFIRMATION: 'order-confirmation',
    SHIPPING_NOTIFICATION: 'shipping-notification',
    ORDER_CANCELLED: 'order-cancelled',
    REFUND_PROCESSED: 'refund-processed',
    ADMIN_NEW_ORDER: 'admin-new-order',
  },
};