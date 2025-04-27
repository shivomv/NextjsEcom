import { NextResponse } from 'next/server';

/**
 * @desc    Simple ping endpoint to check if the API is responding
 * @route   GET /api/ping
 * @access  Public
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'API is responding',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Error in ping endpoint:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
