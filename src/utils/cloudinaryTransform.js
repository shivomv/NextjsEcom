'use client';

/**
 * Generate a Cloudinary URL with transformations
 * @param {string} url - The original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed URL
 */
export const transformImage = (url, options = {}) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }

  try {
    // Default options
    const defaultOptions = {
      width: null,
      height: null,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
      effect: null,
      blur: null,
      background: null,
      overlay: null,
      underlay: null,
      angle: null,
      radius: null,
      border: null,
      dpr: null,
      zoom: null,
      aspectRatio: null,
    };

    // Merge options
    const mergedOptions = { ...defaultOptions, ...options };

    // Build transformation string
    let transformations = [];

    // Add width and height
    if (mergedOptions.width) transformations.push(`w_${mergedOptions.width}`);
    if (mergedOptions.height) transformations.push(`h_${mergedOptions.height}`);
    
    // Add crop mode
    if (mergedOptions.crop) transformations.push(`c_${mergedOptions.crop}`);
    
    // Add quality
    if (mergedOptions.quality) transformations.push(`q_${mergedOptions.quality}`);
    
    // Add format
    if (mergedOptions.format) transformations.push(`f_${mergedOptions.format}`);
    
    // Add effect
    if (mergedOptions.effect) transformations.push(`e_${mergedOptions.effect}`);
    
    // Add blur
    if (mergedOptions.blur) transformations.push(`e_blur:${mergedOptions.blur}`);
    
    // Add background
    if (mergedOptions.background) transformations.push(`b_${mergedOptions.background}`);
    
    // Add overlay
    if (mergedOptions.overlay) transformations.push(`l_${mergedOptions.overlay}`);
    
    // Add underlay
    if (mergedOptions.underlay) transformations.push(`u_${mergedOptions.underlay}`);
    
    // Add angle
    if (mergedOptions.angle) transformations.push(`a_${mergedOptions.angle}`);
    
    // Add radius
    if (mergedOptions.radius) transformations.push(`r_${mergedOptions.radius}`);
    
    // Add border
    if (mergedOptions.border) transformations.push(`bo_${mergedOptions.border}`);
    
    // Add DPR
    if (mergedOptions.dpr) transformations.push(`dpr_${mergedOptions.dpr}`);
    
    // Add zoom
    if (mergedOptions.zoom) transformations.push(`z_${mergedOptions.zoom}`);
    
    // Add aspect ratio
    if (mergedOptions.aspectRatio) transformations.push(`ar_${mergedOptions.aspectRatio}`);

    // Join transformations
    const transformationString = transformations.join(',');
    
    // Insert transformations into URL
    if (transformationString) {
      return url.replace('/upload/', `/upload/${transformationString}/`);
    }
    
    return url;
  } catch (error) {
    console.error('Error transforming Cloudinary URL:', error);
    return url;
  }
};

/**
 * Generate a responsive image URL for different screen sizes
 * @param {string} url - The original Cloudinary URL
 * @param {Object} options - Options for responsive images
 * @returns {Object} - Object with URLs for different screen sizes
 */
export const getResponsiveImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return { original: url };
  }

  try {
    // Default options
    const defaultOptions = {
      sizes: {
        thumbnail: 100,
        small: 300,
        medium: 600,
        large: 1200,
        xlarge: 2000
      },
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    };

    // Merge options
    const mergedOptions = { 
      ...defaultOptions, 
      ...options,
      sizes: { ...defaultOptions.sizes, ...(options.sizes || {}) }
    };

    // Generate URLs for each size
    const result = {
      original: url
    };

    Object.entries(mergedOptions.sizes).forEach(([size, width]) => {
      result[size] = transformImage(url, {
        width,
        crop: mergedOptions.crop,
        quality: mergedOptions.quality,
        format: mergedOptions.format
      });
    });

    return result;
  } catch (error) {
    console.error('Error generating responsive image URLs:', error);
    return { original: url };
  }
};

/**
 * Common transformations for different use cases
 */
export const transformations = {
  thumbnail: (url) => transformImage(url, { width: 100, height: 100, crop: 'thumb' }),
  avatar: (url) => transformImage(url, { width: 150, height: 150, crop: 'fill', gravity: 'face' }),
  banner: (url) => transformImage(url, { width: 1200, height: 400, crop: 'fill' }),
  productCard: (url) => transformImage(url, { width: 300, height: 300, crop: 'fill' }),
  productDetail: (url) => transformImage(url, { width: 600, crop: 'limit', quality: 90 }),
  categoryCard: (url) => transformImage(url, { width: 200, height: 200, crop: 'fill' }),
  blogPost: (url) => transformImage(url, { width: 800, crop: 'limit' }),
  responsive: (url) => getResponsiveImageUrl(url)
};
