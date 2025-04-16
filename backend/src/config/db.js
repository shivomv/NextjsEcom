const mongoose = require('mongoose');

// Mock database for development/testing
const mockDB = {
  users: [],
  products: [],
  categories: [],
  orders: [],
};

// In-memory database connection (mock)
const connectDB = async () => {
  try {
    // Check if we should use a real MongoDB connection
    if (process.env.USE_REAL_DB === 'true' && process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      // Using mock in-memory database
      console.log('Using in-memory mock database');
      // Make the mock database available globally
      global.mockDB = mockDB;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit process on error in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
