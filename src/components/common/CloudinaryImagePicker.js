'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
// Import the upload functions
import { uploadFile } from '@/utils/uploadService';
import { uploadFilePublic } from '@/utils/uploadServicePublic';

export default function CloudinaryImagePicker({
  initialImage = '',
  onImageUpload,
  onImageError,
  folder = 'my-shop',
  className = '',
  imageClassName = 'w-32 h-32',
  label = 'Image',
  required = false,
  errorMessage = '',
  id = '',
}) {
  const { user } = useAuth();
  const [previewImage, setPreviewImage] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(errorMessage);

  // Generate a unique ID for this component instance
  const uniqueId = id || `image-upload-${label.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substring(2, 9)}`;

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Sanitize filename if needed
    if (file.name && file.name.match(/[\/\\:*?"<>|]/)) {
      console.log('File name contains invalid characters:', file.name);
    }

    try {
      setIsUploading(true);
      setError('');

      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Try both upload methods
      console.log('Uploading file to folder:', folder);
      let result;

      try {
        // First try with authentication
        const token = user?.token;
        console.log('Using authentication token:', token ? 'Yes' : 'No');
        result = await uploadFile(file, folder, token);
      } catch (uploadError) {
        console.error('Error with authenticated upload, trying public endpoint:', uploadError);
        // If that fails, try the public endpoint
        result = await uploadFilePublic(file, folder);
      }
      console.log('Upload result:', result);

      // Call the callback with the result
      if (onImageUpload) {
        onImageUpload(result);
      }
    } catch (error) {
      console.error('Error uploading image:', error);

      // Get a more descriptive error message
      let errorMsg = 'Failed to upload image. Please try again.';
      if (error.message) {
        errorMsg = `Upload failed: ${error.message}`;
      }

      console.error('Detailed upload error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      setError(errorMsg);

      if (onImageError) {
        onImageError(errorMsg);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && '*'}
      </label>
      <div className="mt-1 flex items-center">
        <div className={`border border-gray-300 rounded-md overflow-hidden bg-gray-100 relative ${imageClassName}`}>
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Image preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <label htmlFor={uniqueId} className={`ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isUploading ? 'Uploading...' : 'Change'}
        </label>
        <input
          id={uniqueId}
          name={uniqueId}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isUploading}
          className="sr-only"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-sm text-gray-500">
        JPG, PNG or GIF up to 5MB
      </p>
    </div>
  );
}
