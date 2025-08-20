/**
 * MiniMax Admin API Client
 * Handles all communication with the MiniMax backend
 */

import { MINIMAX_CONFIG } from './config';

class MiniMaxClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = MINIMAX_CONFIG.API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    };
  }

  /**
   * Make API request to MiniMax backend
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Request failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`MiniMax API Error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Order Management
   */
  async createOrder(orderData: {
    customer: {
      email: string;
      name: string;
      phone?: string;
      address: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
      };
    };
    items: Array<{
      product_id: string;
      product_type: 'core' | 'catalog';
      quantity: number;
      price: number;
      size?: string;
      color?: string;
      customization?: Record<string, any>;
    }>;
    shipping_method: string;
    payment_method: string;
    metadata?: Record<string, any>;
  }) {
    return this.request(MINIMAX_CONFIG.endpoints.createOrder, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId: string) {
    return this.request(`${MINIMAX_CONFIG.endpoints.getOrder}/${orderId}`);
  }

  async updateOrder(orderId: string, updates: Record<string, any>) {
    return this.request(`${MINIMAX_CONFIG.endpoints.updateOrder}/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async listOrders(filters?: {
    status?: string;
    customer_email?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`${MINIMAX_CONFIG.endpoints.listOrders}?${params}`);
  }

  /**
   * Payment Processing
   */
  async createPaymentIntent(data: {
    amount: number;
    currency?: string;
    customer_email: string;
    order_id: string;
    metadata?: Record<string, any>;
  }) {
    return this.request(MINIMAX_CONFIG.endpoints.createPaymentIntent, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async confirmPayment(paymentIntentId: string) {
    return this.request(MINIMAX_CONFIG.endpoints.confirmPayment, {
      method: 'POST',
      body: JSON.stringify({ payment_intent_id: paymentIntentId }),
    });
  }

  async refundPayment(data: {
    payment_intent_id: string;
    amount?: number;
    reason?: string;
  }) {
    return this.request(MINIMAX_CONFIG.endpoints.refundPayment, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Shipping
   */
  async calculateShipping(data: {
    from_address: Record<string, any>;
    to_address: Record<string, any>;
    parcel: {
      weight: number;
      length: number;
      width: number;
      height: number;
    };
    carrier?: string;
  }) {
    return this.request(MINIMAX_CONFIG.endpoints.calculateShipping, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createShippingLabel(data: {
    order_id: string;
    rate_id: string;
    carrier: string;
    service: string;
  }) {
    return this.request(MINIMAX_CONFIG.endpoints.createShippingLabel, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async trackShipment(trackingNumber: string, carrier: string) {
    const params = new URLSearchParams({ tracking_number: trackingNumber, carrier });
    return this.request(`${MINIMAX_CONFIG.endpoints.trackShipment}?${params}`);
  }

  /**
   * Email Notifications
   */
  async sendOrderConfirmation(data: {
    order_id: string;
    customer_email: string;
    order_details: Record<string, any>;
  }) {
    return this.request(MINIMAX_CONFIG.endpoints.sendOrderConfirmation, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendShippingNotification(data: {
    order_id: string;
    customer_email: string;
    tracking_number: string;
    carrier: string;
    estimated_delivery?: string;
  }) {
    return this.request(MINIMAX_CONFIG.endpoints.sendShippingNotification, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendAdminNotification(data: {
    type: 'new_order' | 'payment_received' | 'refund_requested' | 'error';
    order_id?: string;
    message: string;
    details?: Record<string, any>;
  }) {
    return this.request(MINIMAX_CONFIG.endpoints.sendAdminNotification, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Inventory Management
   */
  async checkInventory(productId: string, variant?: string) {
    const params = new URLSearchParams({ product_id: productId });
    if (variant) params.append('variant', variant);
    return this.request(`${MINIMAX_CONFIG.endpoints.checkInventory}?${params}`);
  }

  async updateInventory(data: {
    product_id: string;
    variant?: string;
    quantity: number;
    operation: 'set' | 'increment' | 'decrement';
  }) {
    return this.request(MINIMAX_CONFIG.endpoints.updateInventory, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Customer Management
   */
  async createCustomer(data: {
    email: string;
    name: string;
    phone?: string;
    address?: Record<string, any>;
    metadata?: Record<string, any>;
  }) {
    return this.request(MINIMAX_CONFIG.endpoints.createCustomer, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCustomer(customerId: string) {
    return this.request(`${MINIMAX_CONFIG.endpoints.getCustomer}/${customerId}`);
  }

  async updateCustomer(customerId: string, updates: Record<string, any>) {
    return this.request(`${MINIMAX_CONFIG.endpoints.updateCustomer}/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
}

// Export singleton instance
export const miniMaxClient = new MiniMaxClient();