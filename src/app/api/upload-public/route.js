import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @desc    Upload an image to Cloudinary (public endpoint)
 * @route   POST /api/upload-public
 * @access  Public
 */
export async function POST(request) {
  try {
    // Get the form data
    const formData = await request.formData();

    // Check if it's a single file or multiple files
    const file = formData.get('file');
    const files = formData.getAll('files');
    const folder = formData.get('folder') || 'my-shop';

    // Handle single file upload
    if (file && !files.length) {
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

      console.log('Uploading to Cloudinary (public endpoint), folder:', folder);

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

      console.log('Cloudinary upload successful (public endpoint):', {
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
    }
    // Handle multiple files upload
    else if (files.length > 0) {
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
        const originalName = file.name.replace(/[\/\\:*?"<>|]/g, '_');
        const filename = `${folder.replace(/\//g, '_')}_${timestamp}_${originalName}`;

        // Upload to Cloudinary
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
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
    }
    else {
      return NextResponse.json(
        { message: 'No files provided' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary (public endpoint):', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
