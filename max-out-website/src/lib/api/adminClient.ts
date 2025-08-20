import { Product, Customer, CartItem, Wedding, WeddingMember, ProductCategory } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || "/api";
const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "";

class AdminClient {
  private headers: HeadersInit;

  constructor() {
    this.headers = {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    };
  }

  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: this.headers,
        next: { revalidate: 60 }, // Cache for 1 minute
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      // Return mock data as fallback
      return this.getMockProducts();
    }
  }

  async fetchProduct(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        headers: this.headers,
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      return null;
    }
  }

  async fetchInventory(sku: string): Promise<{ [size: string]: number }> {
    try {
      const response = await fetch(`${API_URL}/inventory/${sku}`, {
        headers: this.headers,
        cache: "no-store", // Always fetch fresh inventory
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      return {};
    }
  }

  async fetchProductsByCategory(category: ProductCategory): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products?category=${category}`, {
        headers: this.headers,
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products by category: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      return this.getMockProducts().filter(p => p.category === category);
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
        headers: this.headers,
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`Failed to search products: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      return [];
    }
  }

  async updateCart(customerId: string, cartItem: CartItem): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/customers/${customerId}/cart`, {
        method: "PUT",
        headers: this.headers,
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        throw new Error(`Failed to update cart: ${response.statusText}`);
      }
    } catch (error) {

      throw error;
    }
  }

  async getCart(customerId: string): Promise<CartItem[]> {
    try {
      const response = await fetch(`${API_URL}/customers/${customerId}/cart`, {
        headers: this.headers,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to get cart: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      return [];
    }
  }

  async createOrder(orderData: any): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      throw error;
    }
  }

  async fetchCustomer(id: string): Promise<Customer | null> {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customer: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      return null;
    }
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update customer: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      throw error;
    }
  }

  async fetchWedding(id: string): Promise<Wedding | null> {
    try {
      const response = await fetch(`${API_URL}/weddings/${id}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch wedding: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      return null;
    }
  }

  async createWedding(weddingData: Partial<Wedding>): Promise<Wedding> {
    try {
      const response = await fetch(`${API_URL}/weddings`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(weddingData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create wedding: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      throw error;
    }
  }

  async updateWeddingMember(weddingId: string, memberId: string, data: Partial<WeddingMember>): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/weddings/${weddingId}/members/${memberId}`, {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update wedding member: ${response.statusText}`);
      }
    } catch (error) {

      throw error;
    }
  }

  subscribeToInventoryUpdates(sku: string, callback: (stock: { [size: string]: number }) => void): () => void {
    const eventSource = new EventSource(`${API_URL}/inventory/${sku}/subscribe?apiKey=${API_KEY}`);

    eventSource.onmessage = (event) => {
      const stock = JSON.parse(event.data);
      callback(stock);
    };

    eventSource.onerror = (error) => {

      eventSource.close();
    };

    return () => eventSource.close();
  }

  // Mock data for development
  private getMockProducts(): Product[] {
    return [
      {
        id: "1",
        sku: "NVY-SUIT-001",
        name: "Classic Navy Suit",
        price: 89900,
        images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"],
        category: "suits",
        stock: {
          "38R": 2,
          "40R": 5,
          "42R": 8,
          "44R": 3,
          "46R": 1,
        },
        variants: [
          { size: "38R", stock: 2 },
          { size: "40R", stock: 5 },
          { size: "42R", stock: 8 },
          { size: "44R", stock: 3 },
          { size: "46R", stock: 1 },
        ],
      },
      {
        id: "2",
        sku: "CHR-SUIT-002",
        name: "Charcoal Business Suit",
        price: 79900,
        images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"],
        category: "suits",
        stock: {
          "38R": 4,
          "40R": 6,
          "42R": 10,
          "44R": 5,
        },
        variants: [
          { size: "38R", stock: 4 },
          { size: "40R", stock: 6 },
          { size: "42R", stock: 10 },
          { size: "44R", stock: 5 },
        ],
      },
      {
        id: "3",
        sku: "BLK-TUX-001",
        name: "Premium Black Tuxedo",
        price: 129900,
        images: ["https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80"],
        category: "suits",
        stock: {
          "40R": 3,
          "42R": 5,
          "44R": 2,
        },
        variants: [
          { size: "40R", stock: 3 },
          { size: "42R", stock: 5 },
          { size: "44R", stock: 2 },
        ],
      },
      {
        id: "4",
        sku: "GRY-SUIT-003",
        name: "Light Grey Wedding Suit",
        price: 94900,
        images: ["https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800&q=80"],
        category: "suits",
        stock: {
          "40R": 4,
          "42R": 6,
          "44R": 3,
        },
        variants: [
          { size: "40R", stock: 4 },
          { size: "42R", stock: 6 },
          { size: "44R", stock: 3 },
        ],
      },
      {
        id: "5",
        sku: "WHT-SHRT-001",
        name: "Crisp White Dress Shirt",
        price: 12900,
        images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80"],
        category: "shirts",
        stock: {
          "S": 10,
          "M": 15,
          "L": 12,
          "XL": 8,
          "XXL": 5,
        },
        variants: [
          { size: "S", stock: 10 },
          { size: "M", stock: 15 },
          { size: "L", stock: 12 },
          { size: "XL", stock: 8 },
          { size: "XXL", stock: 5 },
        ],
      },
      {
        id: "6",
        sku: "BLU-SHRT-002",
        name: "Sky Blue Oxford Shirt",
        price: 13900,
        images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"],
        category: "shirts",
        stock: {
          "M": 8,
          "L": 10,
          "XL": 6,
        },
        variants: [
          { size: "M", stock: 8 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 6 },
        ],
      },
      {
        id: "7",
        sku: "SLK-TIE-001",
        name: "Burgundy Silk Tie",
        price: 8900,
        images: ["https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800&q=80"],
        category: "accessories",
        stock: {
          "OS": 25,
        },
        variants: [
          { size: "OS", stock: 25 },
        ],
      },
      {
        id: "8",
        sku: "LTH-SHOE-001",
        name: "Italian Leather Oxfords",
        price: 34900,
        images: ["https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80"],
        category: "shoes",
        stock: {
          "8": 3,
          "9": 5,
          "10": 7,
          "11": 5,
          "12": 2,
        },
        variants: [
          { size: "8", stock: 3 },
          { size: "9", stock: 5 },
          { size: "10", stock: 7 },
          { size: "11", stock: 5 },
          { size: "12", stock: 2 },
        ],
      },
    ];
  }
}

export const adminClient = new AdminClient();