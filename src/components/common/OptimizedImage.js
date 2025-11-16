import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';

/**
 * OptimizedImage component for better image loading performance
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {string} props.alt - Image alt text
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {string} props.priority - Whether to prioritize loading this image
 * @param {string} props.quality - Image quality (1-100)
 * @param {string} props.sizes - Responsive sizes attribute
 * @param {Function} props.onLoad - Callback when image loads
 * @param {Function} props.onError - Callback when image fails to load
 */
export default function OptimizedImage({
  src,
  width,
  height,
  alt = '',
  className = '',
  style = {},
  priority = false,
  quality = 80,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  onError,
  ...rest
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);
    setImgSrc(src);
  }, [src]);

  // Memoize the optimization function to prevent re-renders
  const optimizedSrc = useMemo(() => {
    if (!imgSrc || typeof imgSrc !== 'string' || !imgSrc.includes('cloudinary.com')) {
      return imgSrc;
    }

    // If URL already contains transformation parameters, return as is
    if (imgSrc.includes('/upload/c_') || imgSrc.includes('/upload/f_auto')) {
      return imgSrc;
    }

    // Extract the base URL and the path
    const [baseUrl, path] = imgSrc.split('/image/upload/');
    
    if (!baseUrl || !path) {
      return imgSrc;
    }

    // Simple optimization parameters
    const transforms = 'f_auto,q_auto:good';
    return `${baseUrl}/image/upload/${transforms}/${path}`;
  }, [imgSrc]);

  // Handle image load event
  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  // Handle image error event
  const handleError = (e) => {
    setIsLoading(false);
    setError(true);
    if (onError) onError(e);
    
    // Set fallback image
    setImgSrc('/images/placeholder.jpg');
  };

  return (
    <div className={`relative ${className}`} style={{ ...style }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      
      <Image
        src={optimizedSrc}
        width={width}
        height={height}
        alt={alt}
        quality={quality}
        priority={priority}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQAAA/9k="
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        {...rest}
      />
    </div>
  );
}
