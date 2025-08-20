"use client";

import { useNotificationStore } from "@/lib/store/notificationStore";
import { NotificationItem } from "./NotificationItem";

export function NotificationContainer() {
  const { notifications } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}