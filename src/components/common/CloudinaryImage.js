'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * CloudinaryImage component for optimized image display
 * 
 * @param {Object} props
 * @param {string} props.src - Cloudinary image URL
 * @param {string} props.alt - Alt text for the image
 * @param {number} props.width - Width of the image (optional)
 * @param {number} props.height - Height of the image (optional)
 * @param {string} props.sizes - Sizes attribute for responsive images
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.objectFit - Object fit style (cover, contain, etc.)
 * @param {boolean} props.transformations - Whether to apply transformations
 * @param {Object} props.quality - Image quality (1-100)
 */
export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  className = '',
  objectFit = 'cover',
  transformations = true,
  quality = 80,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Apply Cloudinary transformations if needed
  const getOptimizedUrl = (url) => {
    if (!url || !transformations) return url;
    
    try {
      // Check if it's a Cloudinary URL
      if (!url.includes('cloudinary.com')) return url;
      
      // Apply transformations
      return url.replace('/upload/', `/upload/q_${quality},f_auto,c_${objectFit}/`);
    } catch (err) {
      console.error('Error optimizing image URL:', err);
      return url;
    }
  };

  const optimizedSrc = getOptimizedUrl(src);

  // Handle loading state
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Handle error state
  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  // If width and height are provided, use them
  if (width && height) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <Image
            src={optimizedSrc}
            alt={alt || 'Image'}
            width={width}
            height={height}
            onLoadingComplete={handleLoadingComplete}
            onError={handleError}
            className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{ objectFit }}
            sizes={sizes}
            {...props}
          />
        )}
      </div>
    );
  }

  // Otherwise use fill mode
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ) : (
        <Image
          src={optimizedSrc}
          alt={alt || 'Image'}
          fill
          onLoadingComplete={handleLoadingComplete}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectFit }}
          sizes={sizes}
          {...props}
        />
      )}
    </div>
  );
}
