export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" 
             style={{
               backgroundSize: '200% 100%',
               animation: 'shimmer 1.5s infinite'
             }}
        />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Price */}
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        
        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-12"></div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-gray-200 rounded-lg flex-1"></div>
          <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};