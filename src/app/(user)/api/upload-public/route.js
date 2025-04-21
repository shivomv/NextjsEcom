import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @desc    Upload an image to Cloudinary (public endpoint for testing)
 * @route   POST /api/upload-public
 * @access  Public
 */
export async function POST(request) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'my-shop';

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Sanitize filename if present
    let fileName = file.name;
    if (fileName) {
      // Remove slashes and other problematic characters
      fileName = fileName.replace(/[\/\\:*?"<>|]/g, '_');
      console.log('Original filename:', file.name, 'Sanitized filename:', fileName);
    }

    // Get file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Uploading to Cloudinary, folder:', folder);
    console.log('File type:', file.type);
    console.log('File name:', file.name);
    console.log('File size:', buffer.length, 'bytes');

    // Upload to Cloudinary with direct buffer upload
    let result;
    try {
      // Convert buffer to base64 string
      const base64Data = buffer.toString('base64');
      const fileStr = `data:${file.type};base64,${base64Data}`;

      console.log('Cloudinary config:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY ? 'Set (hidden)' : 'Not set',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set (hidden)' : 'Not set',
      });

      // Upload using the upload API with additional options
      result = await cloudinary.uploader.upload(fileStr, {
        folder,
        resource_type: 'auto',
        timeout: 120000, // 2 minutes timeout
        use_filename: true,
        filename_override: fileName, // Use sanitized filename
        unique_filename: true,
      });

      console.log('Upload successful, result:', {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        size: result.bytes,
      });
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json(
        { message: `Cloudinary upload error: ${uploadError.message}` },
        { status: 500 }
      );
    }

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
 * @desc    Delete an image from Cloudinary (public endpoint for testing)
 * @route   DELETE /api/upload-public
 * @access  Public
 */
export async function DELETE(request) {
  try {
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