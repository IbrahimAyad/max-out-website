import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Customer } from "@/lib/types";
import { adminClient } from "@/lib/api/adminClient";

interface AuthStore {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Customer>) => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      customer: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // In a real implementation, this would make an auth API call
          // For now, we'll simulate with a customer fetch
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const { customer, token } = await response.json();

          // Store token in httpOnly cookie (handled by API)
          set({ 
            customer, 
            isAuthenticated: true 
          });
        } catch (error) {

          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        // Clear auth state
        set({ 
          customer: null, 
          isAuthenticated: false 
        });

        // Clear cart data
        localStorage.removeItem("kct-cart-storage");

        // In a real app, also clear httpOnly cookies via API call
      },

      updateProfile: async (data: Partial<Customer>) => {
        const { customer } = get();
        if (!customer) throw new Error("Not authenticated");

        set({ isLoading: true });
        try {
          const updatedCustomer = await adminClient.updateCustomer(customer.id, data);
          set({ customer: updatedCustomer });
        } catch (error) {

          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      refreshCustomer: async () => {
        const { customer } = get();
        if (!customer) return;

        try {
          const freshCustomer = await adminClient.fetchCustomer(customer.id);
          if (freshCustomer) {
            set({ customer: freshCustomer });
          }
        } catch (error) {

        }
      },
    }),
    {
      name: "kct-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);