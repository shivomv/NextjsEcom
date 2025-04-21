'use client';

import { useState } from 'react';
import { uploadFile } from '@/utils/testUploadService';
import Image from 'next/image';

export default function CloudinaryTestPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Upload to Cloudinary
      const result = await uploadFile(file, 'test-uploads');

      console.log('Upload result:', result);
      setUploadedImage(result.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cloudinary Integration Test</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Test</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select an image to upload
          </label>

          <div className="flex items-center">
            <label
              htmlFor="test-image-upload"
              className={`inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? 'Uploading...' : 'Choose Image'}
            </label>
            <input
              id="test-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="sr-only"
            />
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {uploadedImage && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Uploaded Image:</h3>
            <div className="relative h-64 w-full max-w-md border border-gray-300 rounded-md overflow-hidden">
              <Image
                src={uploadedImage}
                alt="Uploaded image"
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 break-all">
              URL: {uploadedImage}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Cloudinary Configuration</h2>
        <p className="mb-2">
          <strong>Cloud Name:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
        </p>
        <p className="mb-2">
          <strong>Upload Preset:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        </p>
      </div>
    </div>
  );
}
