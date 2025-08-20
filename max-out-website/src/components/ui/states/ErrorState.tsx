import { AlertTriangle, XCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  type?: "error" | "warning";
  fullScreen?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  type = "error",
  fullScreen = false,
}: ErrorStateProps) {
  const Icon = type === "error" ? XCircle : AlertTriangle;
  const iconColor = type === "error" ? "text-red-500" : "text-yellow-500";
  const bgColor = type === "error" ? "bg-red-50" : "bg-yellow-50";
  const borderColor = type === "error" ? "border-red-200" : "border-yellow-200";

  const content = (
    <div className={`rounded-lg p-6 ${bgColor} border ${borderColor}`}>
      <div className="flex flex-col items-center text-center space-y-4">
        <Icon className={`h-12 w-12 ${iconColor}`} />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-gold hover:bg-gold/90 text-black font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-gold hover:bg-gold/90 text-black font-medium py-2 px-4 rounded-md transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}