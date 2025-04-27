/**
 * Application Configuration
 *
 * This file contains all the configuration values for the application.
 * We use environment variables for sensitive information and provide
 * fallback values for development.
 */

const config = {
  // Database Configuration
  database: {
    // MongoDB connection string from environment variable
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    }
  },

  // Authentication Configuration
  auth: {
    // JWT secret key for token generation and validation
    jwtSecret: process.env.JWT_SECRET || 'development_jwt_secret_key',
    // JWT expiration time
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    // Cookie options
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }
  },

  // Cloudinary Configuration
  cloudinary: {
    // Cloudinary cloud name
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    // Cloudinary API key
    apiKey: process.env.CLOUDINARY_API_KEY,
    // Cloudinary API secret
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    // Cloudinary upload preset
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    // Cloudinary URL
    url: process.env.CLOUDINARY_URL,
    // Default folder for uploads
    defaultFolder: 'my-shop',
    // Folder structure
    folders: {
      products: 'my-shop/products',
      categories: 'my-shop/categories',
      banners: 'my-shop/banners',
      users: 'my-shop/users',
    }
  },

  // Application Configuration
  app: {
    // Application name
    name: 'Prashasak Samiti',
    // Application description
    description: 'E-commerce platform for spiritual products',
    // Application URL
    url: process.env.NODE_ENV === 'production'
      ? 'https://psshop-five.vercel.app'
      : 'http://localhost:3000',
    // API URL
    apiUrl: process.env.NODE_ENV === 'production'
      ? 'https://psshop-five.vercel.app/api'
      : 'http://localhost:3000/api',
    // Environment
    environment: process.env.NODE_ENV || 'development',
    // Default currency
    currency: 'INR',
    // Currency symbol
    currencySymbol: '₹',
  },

  // Pagination Configuration
  pagination: {
    // Default page size
    defaultPageSize: 10,
    // Maximum page size
    maxPageSize: 100,
  },

  // Image Configuration
  images: {
    // Default image dimensions
    thumbnail: { width: 100, height: 100 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
    // Default image quality
    quality: 80,
  }
};

export default config;
