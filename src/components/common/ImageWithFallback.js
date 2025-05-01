'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageWithFallback({ src, fallbackSrc, alt, width, height, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Update image source when src prop changes
  useEffect(() => {
    setImgSrc(src);
    setError(false);
    setLoading(true);
  }, [src]);

  // Default fallback image from public directory
  const defaultFallbackSrc = '/images/placeholder.jpg';

  // Handle image error
  const handleError = () => {
    setError(true);
    setImgSrc(fallbackSrc || defaultFallbackSrc);
  };

  // Handle image load complete
  const handleLoadComplete = () => {
    setLoading(false);
  };

  // If using fill mode, width and height are not needed
  const isFill = props.fill === true;

  // Default sizes for responsive images
  const defaultSizes = props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  return (
    <div className={`relative ${loading ? 'bg-gray-100' : ''}`} style={isFill ? { width: '100%', height: '100%' } : {}}>
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Image
        {...props}
        className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        src={imgSrc || defaultFallbackSrc}
        alt={alt || 'Image'}
        width={!isFill ? (width || 100) : undefined}
        height={!isFill ? (height || 100) : undefined}
        sizes={defaultSizes}
        onError={handleError}
        onLoadingComplete={handleLoadComplete}
        style={{
          objectFit: props.objectFit || 'cover',
          ...(!isFill ? props.style : {})
        }}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}
