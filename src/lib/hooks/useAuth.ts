import { useCallback } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { Customer } from "@/lib/types";

export function useAuth() {
  const {
    customer,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile,
    refreshCustomer,
  } = useAuthStore();

  const { syncCart } = useCartStore();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await login(email, password);

        // Sync cart after login
        const authState = useAuthStore.getState();
        if (authState.customer?.id) {
          await syncCart(authState.customer.id);
        }
      } catch (error) {

        throw error;
      }
    },
    [login, syncCart]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleUpdateProfile = useCallback(
    async (data: Partial<Customer>) => {
      try {
        await updateProfile(data);
      } catch (error) {

        throw error;
      }
    },
    [updateProfile]
  );

  return {
    customer,
    user: customer, // Alias for backward compatibility
    isAuthenticated,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    login: handleLogin,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    refreshCustomer,
  };
}

export function useCustomerMeasurements() {
  const { customer, updateProfile } = useAuthStore();

  const hasMeasurements = customer?.measurements && 
    customer.measurements.chest > 0 &&
    customer.measurements.waist > 0;

  const updateMeasurements = useCallback(
    async (measurements: Partial<Customer["measurements"]>) => {
      if (!customer) throw new Error("Not authenticated");

      await updateProfile({
        measurements: {
          ...(customer.measurements || {}),
          ...measurements,
        } as Customer["measurements"],
      });
    },
    [customer, updateProfile]
  );

  return {
    measurements: customer?.measurements,
    hasMeasurements,
    updateMeasurements,
  };
}

export function useStylePreferences() {
  const { customer, updateProfile } = useAuthStore();

  const updateStylePreferences = useCallback(
    async (preferences: Partial<Customer["stylePreferences"]>) => {
      if (!customer) throw new Error("Not authenticated");

      await updateProfile({
        stylePreferences: {
          ...(customer.stylePreferences || {}),
          ...preferences,
        } as Customer["stylePreferences"],
      });
    },
    [customer, updateProfile]
  );

  return {
    stylePreferences: customer?.stylePreferences,
    updateStylePreferences,
  };
}