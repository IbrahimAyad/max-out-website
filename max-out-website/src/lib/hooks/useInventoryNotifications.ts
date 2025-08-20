import { useEffect } from "react";
import { useInventoryAlerts } from "./useInventory";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { useRouter } from "next/navigation";

export function useInventoryNotifications() {
  const { alerts, dismissAlert } = useInventoryAlerts();
  const { addNotification } = useNotificationStore();
  const router = useRouter();

  useEffect(() => {
    alerts.forEach((alert, index) => {
      let title = "";
      let message = "";
      let type: "warning" | "error" = "warning";

      switch (alert.type) {
        case "low_stock":
          title = "Low Stock Alert";
          message = `${alert.sku} size ${alert.size} has only ${alert.quantity} items left`;
          type = "warning";
          break;
        case "out_of_stock":
          title = "Out of Stock";
          message = `${alert.sku} size ${alert.size} is now out of stock`;
          type = "error";
          break;
      }

      addNotification({
        type: "inventory",
        title,
        message,
        duration: 10000, // 10 seconds for inventory alerts
        action: {
          label: "View Product",
          onClick: () => {
            router.push(`/products?sku=${alert.sku}`);
            dismissAlert(index);
          },
        },
      });

      // Dismiss the alert after showing notification
      dismissAlert(index);
    });
  }, [alerts]);
}