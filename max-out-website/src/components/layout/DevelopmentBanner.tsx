"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if we're in development and API is not responding
    if (process.env.NODE_ENV === "development" && !isDismissed) {
      fetch(process.env.NEXT_PUBLIC_API_URL + "/health")
        .then(() => setIsVisible(false))
        .catch(() => setIsVisible(true));
    }
  }, [isDismissed]);

  if (!isVisible || isDismissed) return null;

  return (
    <div className={cn(
      "bg-amber-50 border-b border-amber-200 px-4 py-2",
      "flex items-center justify-between text-sm"
    )}>
      <div className="flex items-center gap-2 text-amber-800">
        <AlertCircle className="h-4 w-4" />
        <span>
          Development Mode: Using mock data. Start the macOS Admin Panel for live data.
        </span>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="p-1 hover:bg-amber-100 rounded"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}