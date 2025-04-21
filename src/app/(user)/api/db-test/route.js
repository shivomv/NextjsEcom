import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/db';

/**
 * @desc    Test database connection
 * @route   GET /api/db-test
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Get database connection status
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    return NextResponse.json({
      success: true,
      dbStatus,
      collections: collectionNames,
      mongodbUri: process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set',
    });
  } catch (error) {
    console.error('Error testing database connection:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Server error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
