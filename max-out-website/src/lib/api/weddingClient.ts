import { Wedding, WeddingMember, Measurements } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://kct-menswear.vercel.app/api";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

class WeddingClient {
  private headers: HeadersInit;

  constructor() {
    this.headers = {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    };
  }

  async getWeddingByCode(code: string): Promise<Wedding | null> {
    try {
      const response = await fetch(`${API_URL}/weddings/code/${code}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch wedding: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      throw error;
    }
  }

  async updateMemberMeasurements(
    weddingId: string,
    memberId: string,
    measurements: Measurements
  ): Promise<void> {
    try {
      const response = await fetch(
        `${API_URL}/weddings/${weddingId}/members/${memberId}/measurements`,
        {
          method: "PUT",
          headers: this.headers,
          body: JSON.stringify(measurements),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update measurements: ${response.statusText}`);
      }
    } catch (error) {

      throw error;
    }
  }

  async addWeddingMember(weddingId: string, member: Omit<WeddingMember, "id">): Promise<WeddingMember> {
    try {
      const response = await fetch(`${API_URL}/weddings/${weddingId}/members`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(member),
      });

      if (!response.ok) {
        throw new Error(`Failed to add wedding member: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      throw error;
    }
  }

  async removeWeddingMember(weddingId: string, memberId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_URL}/weddings/${weddingId}/members/${memberId}`,
        {
          method: "DELETE",
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to remove wedding member: ${response.statusText}`);
      }
    } catch (error) {

      throw error;
    }
  }

  async getWeddingOutfits(weddingId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/weddings/${weddingId}/outfits`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch wedding outfits: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      return [];
    }
  }

  async createWeddingOrder(weddingId: string, orderData: any): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/weddings/${weddingId}/orders`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create wedding order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {

      throw error;
    }
  }

  async sendInvitations(weddingId: string, memberIds: string[]): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/weddings/${weddingId}/invitations`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ memberIds }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send invitations: ${response.statusText}`);
      }
    } catch (error) {

      throw error;
    }
  }
}

export const weddingClient = new WeddingClient();