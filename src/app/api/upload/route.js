import { NextResponse } from 'next/server';
import { authMiddleware } from '@/utils/auth';
import { v2 as cloudinary } from 'cloudinary';
import { rateLimitMiddleware } from '@/utils/rateLimit';
import { handleApiError, ApiError } from '@/utils/errorHandler';
import logger from '@/utils/logger';

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
    // Check rate limit
    const rateLimit = rateLimitMiddleware('upload')(request);
    if (rateLimit.limited) {
      return rateLimit.response;
    }

    // Check authentication
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return authResult.status;
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      throw new ApiError('No files provided', 400);
    }

    // Limit to 5 files
    if (files.length > 5) {
      throw new ApiError('Maximum 5 files allowed', 400);
    }
    
    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        throw new ApiError(`Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.`, 400);
      }
      if (file.size > maxSize) {
        throw new ApiError(`File too large: ${file.name}. Maximum size is 5MB.`, 400);
      }
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
    return handleApiError(error, 'Error uploading files');
  }
}

