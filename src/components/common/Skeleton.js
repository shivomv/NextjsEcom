export default function Skeleton({ className = '', variant = 'rectangular', width, height, animation = 'pulse' }) {
  const baseClasses = 'bg-gray-200';
  const animationClasses = animation === 'pulse' ? 'animate-pulse' : animation === 'wave' ? 'animate-shimmer' : '';
  
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%'),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
      style={style}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton height="200px" className="w-full" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="rectangular" width="80px" height="36px" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton height="150px" className="w-full" />
      <div className="p-4">
        <Skeleton variant="text" width="70%" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[400px] md:h-[500px] bg-gray-200 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4 w-full max-w-2xl px-4">
          <Skeleton variant="text" height="48px" className="mx-auto" width="80%" />
          <Skeleton variant="text" height="24px" className="mx-auto" width="60%" />
          <Skeleton variant="rectangular" height="48px" className="mx-auto" width="200px" />
        </div>
      </div>
    </div>
  );
}
