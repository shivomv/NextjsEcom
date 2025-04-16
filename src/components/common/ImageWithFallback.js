'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageWithFallback({ src, fallbackSrc, alt, width, height, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  // Generate a placehold.co URL if no fallbackSrc is provided
  const getPlaceholderUrl = () => {
    // If width and height are provided, use them for the placeholder
    if (width && height) {
      return `https://placehold.co/${width}x${height}/CCCCCC/666666?text=${encodeURIComponent(alt || 'Image')}`;
    }
    // Default size for placeholder
    return `https://placehold.co/600x400/CCCCCC/666666?text=${encodeURIComponent(alt || 'Image')}`;
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={() => {
        setImgSrc(fallbackSrc || getPlaceholderUrl());
      }}
    />
  );
}
