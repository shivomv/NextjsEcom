# Cloudinary Image Integration Guide

This guide explains how to use Cloudinary for image handling in the e-commerce application.

## Overview

Cloudinary is used for:
- Storing product images
- Storing category images
- Image transformations and optimizations
- Responsive images

## Components

### CloudinaryImagePicker

A reusable component for picking and uploading a single image.

```jsx
import CloudinaryImagePicker from '@/components/common/CloudinaryImagePicker';

// In your component
<CloudinaryImagePicker
  initialImage={product.image || ''}
  onImageUpload={(result) => {
    setFormData({
      ...formData,
      image: result.url
    });
  }}
  onImageError={(error) => {
    setErrors({
      ...errors,
      image: error
    });
  }}
  folder="my-shop/products"
  label="Product Image"
  required={true}
  errorMessage={errors.image}
/>
```

### CloudinaryMultiImagePicker

A reusable component for picking and uploading multiple images.

```jsx
import CloudinaryMultiImagePicker from '@/components/common/CloudinaryMultiImagePicker';

// In your component
<CloudinaryMultiImagePicker
  initialImages={product.images || []}
  onImagesUpload={(imageUrls) => {
    setFormData({
      ...formData,
      images: imageUrls
    });
  }}
  onImagesError={(error) => {
    setErrors({
      ...errors,
      images: error
    });
  }}
  onImageRemove={(updatedImages) => {
    setFormData({
      ...formData,
      images: updatedImages
    });
  }}
  folder="my-shop/products"
  label="Additional Images"
  maxImages={10}
/>
```

### CloudinaryImage

A component for displaying Cloudinary images with optimizations.

```jsx
import CloudinaryImage from '@/components/common/CloudinaryImage';

// Basic usage
<CloudinaryImage
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
/>

// With transformations
<CloudinaryImage
  src={product.image}
  alt={product.name}
  objectFit="cover"
  transformations={true}
  quality={80}
  className="rounded-lg"
/>

// Responsive with fill mode
<div className="relative h-64">
  <CloudinaryImage
    src={product.image}
    alt={product.name}
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>
```

## Utilities

### uploadService.js

Utilities for uploading files to Cloudinary.

```javascript
import { uploadFile, uploadMultipleFiles, deleteFile } from '@/utils/uploadService';

// Upload a single file
const result = await uploadFile(file, 'my-shop/products');
console.log(result.url); // The Cloudinary URL

// Upload multiple files
const results = await uploadMultipleFiles(files, 'my-shop/products');
const urls = results.map(result => result.url);

// Delete a file
await deleteFile(publicId);
```

### cloudinaryTransform.js

Utilities for transforming Cloudinary URLs.

```javascript
import { transformImage, getResponsiveImageUrl, transformations } from '@/utils/cloudinaryTransform';

// Basic transformation
const optimizedUrl = transformImage(url, {
  width: 500,
  height: 300,
  crop: 'fill',
  quality: 80
});

// Get responsive image URLs
const responsiveUrls = getResponsiveImageUrl(url);
console.log(responsiveUrls.small); // URL for small screens
console.log(responsiveUrls.medium); // URL for medium screens

// Use predefined transformations
const thumbnailUrl = transformations.thumbnail(url);
const productCardUrl = transformations.productCard(url);
```

## API Endpoints

### /api/upload

Endpoint for uploading images to Cloudinary.

- **POST**: Upload a single image
  - Body: FormData with `file` and optional `folder`
  - Returns: `{ url, public_id }`

- **DELETE**: Delete an image from Cloudinary
  - Body: JSON with `public_id`
  - Returns: `{ result }`

## Folder Structure

Images are organized in Cloudinary with the following folder structure:

- `my-shop/products/` - Product images
- `my-shop/categories/` - Category images
- `my-shop/banners/` - Banner images
- `my-shop/users/` - User profile images

## Best Practices

1. **Use the provided components**: The `CloudinaryImagePicker` and `CloudinaryMultiImagePicker` components handle all the complexity of uploading images.

2. **Store URLs in the database**: Only store the Cloudinary URLs in your database, not the actual images.

3. **Use transformations**: Use Cloudinary transformations to optimize images for different use cases.

4. **Handle errors**: Always handle upload errors and provide feedback to the user.

5. **Clean up unused images**: Delete images from Cloudinary when they are no longer needed.

## Troubleshooting

- **Upload fails**: Check your Cloudinary credentials in `.env.local`
- **Images not displaying**: Make sure the Cloudinary domain is allowed in `next.config.js`
- **Slow uploads**: Consider using the Cloudinary Upload Widget for larger files
