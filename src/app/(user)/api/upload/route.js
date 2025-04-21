import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { authMiddleware, adminMiddleware } from '@/utils/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @desc    Upload an image to Cloudinary
 * @route   POST /api/upload
 * @access  Private/Admin
 */
export async function POST(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      console.log('Admin authentication failed:', adminResult.status);
      return adminResult;
    }

    console.log('Admin authentication successful');

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'my-shop';

    // Sanitize filename if present
    let fileName = file.name;
    if (fileName) {
      // Remove slashes and other problematic characters
      fileName = fileName.replace(/[\/\\:*?"<>|]/g, '_');
      console.log('Original filename:', file.name, 'Sanitized filename:', fileName);
    }

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const fileBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(fileBuffer).toString('base64');
    const fileStr = `data:${file.type};base64,${base64File}`;

    console.log('Uploading to Cloudinary, folder:', folder);

    // Upload to Cloudinary with additional options
    const result = await cloudinary.uploader.upload(fileStr, {
      folder,
      resource_type: 'auto',
      use_filename: true,
      filename_override: fileName, // Use sanitized filename
      unique_filename: true,
      overwrite: true,
      timeout: 60000, // 60 seconds timeout
    });

    console.log('Cloudinary upload successful:', {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      folder: result.folder,
      original_filename: result.original_filename,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Delete an image from Cloudinary
 * @route   DELETE /api/upload
 * @access  Private/Admin
 */
export async function DELETE(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      console.log('Admin authentication failed for DELETE:', adminResult.status);
      return adminResult;
    }

    console.log('Admin authentication successful for DELETE');

    const { public_id } = await request.json();

    if (!public_id) {
      return NextResponse.json(
        { message: 'No public_id provided' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
