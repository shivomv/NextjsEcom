import Skeleton from './Skeleton';

// Products Listing Page Skeleton
export function ProductsListingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton variant="text" width="200px" height="24px" className="mb-6" />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:w-1/4 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <Skeleton variant="text" width="120px" height="24px" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="text" width="100%" height="20px" />
            ))}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <Skeleton variant="text" width="120px" height="24px" />
            <Skeleton variant="rectangular" width="100%" height="40px" />
            <Skeleton variant="rectangular" width="100%" height="40px" />
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <Skeleton variant="text" width="150px" height="24px" />
            <Skeleton variant="rectangular" width="120px" height="40px" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton height="200px" className="w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Page Skeleton
export function CartPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton variant="text" width="200px" height="36px" className="mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-md flex gap-4">
              <Skeleton width="100px" height="100px" className="rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <Skeleton variant="text" width="150px" height="24px" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="rectangular" width="100%" height="48px" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Checkout Page Skeleton
export function CheckoutPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton variant="text" width="200px" height="36px" className="mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <Skeleton variant="text" width="200px" height="24px" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height="48px" />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <Skeleton variant="text" width="150px" height="24px" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton width="60px" height="60px" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="60%" />
                </div>
              </div>
            ))}
            <Skeleton variant="rectangular" width="100%" height="48px" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Account/Orders Page Skeleton
export function OrdersPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton variant="text" width="200px" height="36px" className="mb-8" />
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <Skeleton variant="text" width="150px" />
                <Skeleton variant="text" width="100px" />
              </div>
              <Skeleton variant="rectangular" width="100px" height="32px" />
            </div>
            <div className="flex gap-4">
              <Skeleton width="80px" height="80px" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Category Page Skeleton
export function CategoryPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton variant="text" width="200px" height="24px" className="mb-4" />
      <Skeleton variant="text" width="300px" height="36px" className="mb-2" />
      <Skeleton variant="text" width="500px" height="20px" className="mb-8" />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton height="200px" className="w-full" />
            <div className="p-4 space-y-2">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Blog Page Skeleton
export function BlogPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton variant="text" width="200px" height="36px" className="mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton height="200px" className="w-full" />
            <div className="p-6 space-y-3">
              <Skeleton variant="text" width="100%" height="24px" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="120px" height="20px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Search Page Skeleton
export function SearchPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton variant="text" width="300px" height="36px" className="mb-2" />
      <Skeleton variant="text" width="200px" height="20px" className="mb-8" />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton height="200px" className="w-full" />
            <div className="p-4 space-y-2">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default {
  ProductsListingSkeleton,
  CartPageSkeleton,
  CheckoutPageSkeleton,
  OrdersPageSkeleton,
  CategoryPageSkeleton,
  BlogPageSkeleton,
  SearchPageSkeleton,
};
