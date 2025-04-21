'use client';

import { useState } from 'react';
import CloudinaryImagePicker from '@/components/common/CloudinaryImagePicker';
import CloudinaryMultiImagePicker from '@/components/common/CloudinaryMultiImagePicker';
import CloudinaryImage from '@/components/common/CloudinaryImage';

export default function TestUploadPage() {
  const [mainImage, setMainImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [mainImageError, setMainImageError] = useState('');
  const [additionalImagesError, setAdditionalImagesError] = useState('');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cloudinary Upload Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Single Image Upload</h2>
          
          <CloudinaryImagePicker
            initialImage={mainImage}
            onImageUpload={(result) => {
              console.log('Uploaded image:', result);
              setMainImage(result.url);
              setMainImageError('');
            }}
            onImageError={(error) => {
              console.error('Image upload error:', error);
              setMainImageError(error);
            }}
            folder="test-uploads"
            label="Test Image"
            errorMessage={mainImageError}
          />
          
          {mainImage && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Uploaded Image:</h3>
              <div className="relative h-48 w-full rounded-md overflow-hidden">
                <CloudinaryImage
                  src={mainImage}
                  alt="Uploaded image"
                  className="h-48"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 break-all">
                URL: {mainImage}
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Multiple Images Upload</h2>
          
          <CloudinaryMultiImagePicker
            initialImages={additionalImages}
            onImagesUpload={(imageUrls) => {
              console.log('Uploaded images:', imageUrls);
              setAdditionalImages(imageUrls);
              setAdditionalImagesError('');
            }}
            onImagesError={(error) => {
              console.error('Images upload error:', error);
              setAdditionalImagesError(error);
            }}
            onImageRemove={(updatedImages) => {
              setAdditionalImages(updatedImages);
            }}
            folder="test-uploads"
            label="Test Images"
            errorMessage={additionalImagesError}
            maxImages={5}
          />
          
          {additionalImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Uploaded Images:</h3>
              <div className="grid grid-cols-2 gap-2">
                {additionalImages.map((image, index) => (
                  <div key={index} className="relative h-32 rounded-md overflow-hidden">
                    <CloudinaryImage
                      src={image}
                      alt={`Uploaded image ${index + 1}`}
                      className="h-32"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
