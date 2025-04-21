import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY ? 'Set (hidden)' : 'Not set',
      apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set (hidden)' : 'Not set',
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
