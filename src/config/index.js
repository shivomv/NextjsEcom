/**
 * Application Configuration
 *
 * This file contains all the configuration values for the application.
 * Instead of using environment variables, we're using hardcoded values
 * to simplify deployment.
 */

const config = {
  // Database Configuration
  database: {
    // MongoDB connection string - same for both production and development
    uri: 'mongodb://atlas-sql-680e6fa9ee5da11fa31ac919-zky2fx.a.query.mongodb.net/myVirtualDatabase?ssl=true&authSource=admin',
    // For reference, production connection string format:
    // uri: 'mongodb+srv://username:password@cluster.mongodb.net/dbname',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    }
  },

  // Authentication Configuration
  auth: {
    // JWT secret key for token generation and validation
    jwtSecret: 'your_jwt_secret_key',
    // JWT expiration time
    jwtExpire: '30d',
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
    cloudName: 'djv7pwnju',
    // Cloudinary API key
    apiKey: '955661643549672',
    // Cloudinary API secret
    apiSecret: 'FDQIr_OPTSNzuG8DrTiNNsghpPg',
    // Cloudinary upload preset
    uploadPreset: 'PSEcom',
    // Cloudinary URL
    url: 'cloudinary://955661643549672:FDQIr_OPTSNzuG8DrTiNNsghpPg@djv7pwnju',
    // Default folder for uploads
    defaultFolder: 'my-shop',
    // Folder structure
    folders: {
      products: 'my-shop/products',
      categories: 'my-shop/categories',
      banners: 'my-shop/banners',
      users: 'my-shop/users',
      test: 'test-uploads',
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
