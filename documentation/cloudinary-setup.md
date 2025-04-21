# Cloudinary Setup for Image Storage

This document explains how to set up and use Cloudinary for image storage in the e-commerce application.

## Setup Instructions

1. **Create a Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
   - After signing up, you'll get access to your dashboard

2. **Get Your Cloudinary Credentials**
   - From your Cloudinary dashboard, find your Cloud Name, API Key, and API Secret
   - These credentials will be used to configure the application

3. **Create an Upload Preset**
   - In your Cloudinary dashboard, go to Settings > Upload
   - Scroll down to "Upload presets" and click "Add upload preset"
   - Give it a name (e.g., "my_shop_preset")
   - Set "Signing Mode" to "Unsigned"
   - Configure other settings as needed (folder path, transformations, etc.)
   - Save the preset

4. **Configure Environment Variables**
   - Update your `.env.local` file with the following variables:
   ```
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=my_shop_preset
   ```

## Usage in the Application

### Server-Side Uploads

The application uses server-side uploads for secure image handling. The process works as follows:

1. User selects an image in the form
2. The image is sent to the Next.js API route `/api/upload`
3. The API route authenticates the user (admin only)
4. The image is uploaded to Cloudinary using the server-side SDK
5. The Cloudinary URL is returned and saved in the database

### Client-Side Uploads (Optional)

For bulk uploads or advanced features, the application also supports client-side uploads using the Cloudinary Upload Widget:

1. Import the `CloudinaryUploadWidget` component
2. Use it in your form with appropriate callbacks
3. Handle the returned image URLs in your form state

Example:
```jsx
import CloudinaryUploadWidget from '@/components/common/CloudinaryUploadWidget';

// In your component
const handleUploadSuccess = (result) => {
  setFormData({
    ...formData,
    image: result.secure_url
  });
};

// In your JSX
<CloudinaryUploadWidget 
  onUploadSuccess={handleUploadSuccess}
  onUploadError={(error) => console.error(error)}
  buttonText="Upload Image"
  buttonClassName="btn btn-primary"
/>
```

## Image Transformations

Cloudinary allows powerful image transformations. You can:

1. Resize images: `https://res.cloudinary.com/your-cloud-name/image/upload/w_500,h_500/your-image-id`
2. Crop images: `https://res.cloudinary.com/your-cloud-name/image/upload/c_crop,g_face/your-image-id`
3. Apply filters: `https://res.cloudinary.com/your-cloud-name/image/upload/e_sepia/your-image-id`

For more transformation options, see the [Cloudinary documentation](https://cloudinary.com/documentation/image_transformations).

## Folder Structure

Images are organized in Cloudinary with the following folder structure:

- `my-shop/products/` - Product images
- `my-shop/categories/` - Category images
- `my-shop/banners/` - Banner images
- `my-shop/users/` - User profile images

## Troubleshooting

- **Upload Failures**: Check your Cloudinary credentials and upload preset configuration
- **Image Not Displaying**: Verify that the Cloudinary domain is allowed in `next.config.js`
- **Size Limitations**: The free Cloudinary plan has usage limits. Monitor your usage in the dashboard
