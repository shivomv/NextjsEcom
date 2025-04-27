'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageWithFallback({ src, fallbackSrc, alt, width, height, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  // Default fallback image from public directory
  const defaultFallbackSrc = '/images/placeholder.jpg';

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={() => {
        setImgSrc(fallbackSrc || defaultFallbackSrc);
      }}
    />
  );
}
