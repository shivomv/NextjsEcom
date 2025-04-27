import mongoose from 'mongoose';
import config from '@/config';

const MONGODB_URI = config.database.uri;

if (!MONGODB_URI) {
  throw new Error(
    'MongoDB URI is not defined in config'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      ...config.database.options
    };

    console.log('Connecting to MongoDB with URI:', MONGODB_URI.substring(0, 20) + '...');
    console.log('Connection options:', JSON.stringify(opts));

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connection successful');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('MongoDB connection error:', e);
    console.error('Error details:', {
      name: e.name,
      message: e.message,
      code: e.code,
      stack: e.stack,
    });
    cached.promise = null;
    throw new Error(`Database connection failed: ${e.message}`);
  }

  return cached.conn;
}

export default dbConnect;
