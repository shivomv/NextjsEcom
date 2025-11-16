import Skeleton from './Skeleton';

export default function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section Skeleton */}
        <div className="space-y-4">
          <Skeleton height="500px" className="w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height="100px" className="rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info Section Skeleton */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <Skeleton variant="text" width="40%" height="20px" />
          
          {/* Title */}
          <Skeleton variant="text" width="80%" height="36px" />
          
          {/* Rating */}
          <div className="flex items-center gap-4">
            <Skeleton variant="text" width="120px" height="24px" />
            <Skeleton variant="text" width="100px" height="24px" />
          </div>
          
          {/* Price */}
          <div className="space-y-2">
            <Skeleton variant="text" width="150px" height="32px" />
            <Skeleton variant="text" width="100px" height="20px" />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="95%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="85%" />
          </div>
          
          {/* Stock */}
          <Skeleton variant="text" width="120px" height="24px" />
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <Skeleton variant="rectangular" width="120px" height="40px" />
            <Skeleton variant="rectangular" width="200px" height="48px" />
          </div>
          
          {/* Specifications */}
          <div className="space-y-3">
            <Skeleton variant="text" width="150px" height="24px" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="40%" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-16">
        <Skeleton variant="text" width="200px" height="32px" className="mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton height="200px" className="w-full" />
              <div className="p-4 space-y-3">
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
