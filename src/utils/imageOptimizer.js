/**
 * Image optimization utilities
 */

/**
 * Generate optimized Cloudinary URL with transformations
 */
export function getOptimizedCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }

  // If URL already has transformations, return as is
  if (url.includes('/upload/f_auto') || url.includes('/upload/c_')) {
    return url;
  }

  const {
    width = 'auto:100:800',
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'limit',
    dpr = 'auto',
  } = options;

  const [baseUrl, path] = url.split('/image/upload/');
  
  if (!baseUrl || !path) {
    return url;
  }

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    `dpr_${dpr}`,
    `c_${crop}`,
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
  ].filter(Boolean).join(',');

  return `${baseUrl}/image/upload/${transforms}/${path}`;
}

/**
 * Generate responsive image srcset for Cloudinary
 */
export function getCloudinaryResponsiveSrcSet(url, widths = [320, 640, 768, 1024, 1280, 1536]) {
  if (!url || !url.includes('cloudinary.com')) {
    return '';
  }

  return widths
    .map(width => {
      const optimizedUrl = getOptimizedCloudinaryUrl(url, { width });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Get blur placeholder data URL
 */
export function getBlurDataURL() {
  return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQAAA/9k=';
}

/**
 * Preload critical images
 */
export function preloadImage(url, options = {}) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = getOptimizedCloudinaryUrl(url, options);
  
  if (options.imageSrcSet) {
    link.imageSrcset = getCloudinaryResponsiveSrcSet(url);
  }
  
  document.head.appendChild(link);
}

export default {
  getOptimizedCloudinaryUrl,
  getCloudinaryResponsiveSrcSet,
  getBlurDataURL,
  preloadImage,
};
