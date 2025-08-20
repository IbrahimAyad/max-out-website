import { useNotificationStore } from "@/lib/store/notificationStore";
import { useCallback } from "react";

export function useNotifications() {
  const { addNotification } = useNotificationStore();

  const notifySuccess = useCallback(
    (title: string, message: string) => {
      addNotification({
        type: "success",
        title,
        message,
      });
    },
    [addNotification]
  );

  const notifyError = useCallback(
    (title: string, message: string) => {
      addNotification({
        type: "error",
        title,
        message,
        duration: 7000, // Errors stay longer
      });
    },
    [addNotification]
  );

  const notifyWarning = useCallback(
    (title: string, message: string) => {
      addNotification({
        type: "warning",
        title,
        message,
      });
    },
    [addNotification]
  );

  const notifyInfo = useCallback(
    (title: string, message: string) => {
      addNotification({
        type: "info",
        title,
        message,
      });
    },
    [addNotification]
  );

  const notifyInventory = useCallback(
    (title: string, message: string, action?: { label: string; onClick: () => void }) => {
      addNotification({
        type: "inventory",
        title,
        message,
        action,
        duration: 10000, // Inventory alerts stay longer
      });
    },
    [addNotification]
  );

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyInventory,
  };
}