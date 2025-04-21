import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import mongoose from 'mongoose';

/**
 * @desc    Test API endpoint
 * @route   GET /api/test
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();
    
    // Get all registered models
    const models = Object.keys(mongoose.models);
    
    // Get database connection status
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
    
    return NextResponse.json({
      success: true,
      models,
      dbStatus,
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
