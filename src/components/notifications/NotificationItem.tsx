"use client";

import { Notification, useNotificationStore } from "@/lib/store/notificationStore";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ShoppingBag,
  X,
} from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { removeNotification } = useNotificationStore();

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-500" />;
      case "inventory":
        return <ShoppingBag className="h-6 w-6 text-gold" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      case "inventory":
        return "bg-yellow-50 border-gold";
    }
  };

  return (
    <div
      className={`
        flex items-start p-4 rounded-lg border shadow-lg
        transform transition-all duration-300 ease-in-out
        ${getBgColor()}
      `}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className="mt-2 text-sm font-medium text-gold hover:text-gold/80"
          >
            {notification.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}