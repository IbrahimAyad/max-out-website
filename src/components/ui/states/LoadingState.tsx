interface LoadingStateProps {
  text?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

export function LoadingState({ 
  text = "Loading...", 
  size = "medium",
  fullScreen = false 
}: LoadingStateProps) {
  const sizeClasses = {
    small: "h-8 w-8 border-2",
    medium: "h-12 w-12 border-2",
    large: "h-16 w-16 border-4",
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`animate-spin rounded-full border-t-gold border-b-gold border-l-transparent border-r-transparent ${sizeClasses[size]}`}
        aria-label="Loading"
      />
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm animate-pulse">
      <div className="aspect-[3/4] bg-gray-200 rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}