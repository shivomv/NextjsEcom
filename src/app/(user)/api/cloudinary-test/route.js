import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import config from '@/config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

/**
 * @desc    Test Cloudinary configuration
 * @route   GET /api/cloudinary-test
 * @access  Public
 */
export async function GET() {
  try {
    // Test Cloudinary configuration
    const testResult = {
      cloudName: config.cloudinary.cloudName,
      apiKey: config.cloudinary.apiKey ? 'Set (hidden)' : 'Not set',
      apiSecret: config.cloudinary.apiSecret ? 'Set (hidden)' : 'Not set',
    };

    // Test Cloudinary connection
    try {
      const pingResult = await cloudinary.api.ping();
      testResult.connection = 'Success';
      testResult.pingResult = pingResult;
    } catch (pingError) {
      testResult.connection = 'Failed';
      testResult.error = pingError.message;
    }

    return NextResponse.json(testResult);
  } catch (error) {
    console.error('Error testing Cloudinary:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
