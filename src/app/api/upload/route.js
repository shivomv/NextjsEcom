import { NextResponse } from 'next/server';
import { authMiddleware } from '@/utils/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @desc    Upload images to Cloudinary
 * @route   POST /api/upload
 * @access  Private
 */
export async function POST(request) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: 'No files provided' },
        { status: 400 }
      );
    }

    // Limit to 5 files
    if (files.length > 5) {
      return NextResponse.json(
        { message: 'Maximum 5 files allowed' },
        { status: 400 }
      );
    }

    // Upload each file to Cloudinary
    const uploadPromises = files.map(async (file) => {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `review_${authResult.user._id}_${timestamp}`;

      // Upload to Cloudinary
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'reviews',
            public_id: filename,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                resourceType: result.resource_type,
              });
            }
          }
        );

        // Write buffer to stream
        uploadStream.write(buffer);
        uploadStream.end();
      });
    });

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);

    // Extract URLs and image data
    const urls = uploadResults.map((result) => result.url);
    const imagesData = uploadResults;

    return NextResponse.json({
      message: 'Files uploaded successfully',
      urls,
      imagesData,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
