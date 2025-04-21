'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
// Import the upload functions
import { uploadMultipleFiles } from '@/utils/uploadService';
import { uploadMultipleFilesPublic } from '@/utils/uploadServicePublic';

export default function CloudinaryMultiImagePicker({
  initialImages = [],
  onImagesUpload,
  onImagesError,
  onImageRemove,
  folder = 'my-shop',
  className = '',
  label = 'Images',
  required = false,
  errorMessage = '',
  maxImages = 10,
}) {
  const { user } = useAuth();
  const [images, setImages] = useState(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(errorMessage);

  // Handle images change
  const handleImagesChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check for invalid filenames
    Array.from(files).forEach(file => {
      if (file.name && file.name.match(/[\/\\:*?"<>|]/)) {
        console.log('File name contains invalid characters:', file.name);
      }
    });

    // Check if adding these files would exceed the maximum
    if (images.length + files.length > maxImages) {
      const errorMsg = `You can only upload a maximum of ${maxImages} images.`;
      setError(errorMsg);

      if (onImagesError) {
        onImagesError(errorMsg);
      }
      return;
    }

    try {
      setIsUploading(true);
      setError('');

      // Try both upload methods
      let results;

      try {
        // First try with authentication
        const token = user?.token;
        console.log('Using authentication token for multiple files:', token ? 'Yes' : 'No');
        results = await uploadMultipleFiles(Array.from(files), folder, token);
      } catch (uploadError) {
        console.error('Error with authenticated upload for multiple files, trying public endpoint:', uploadError);
        // If that fails, try the public endpoint
        results = await uploadMultipleFilesPublic(Array.from(files), folder);
      }

      // Get URLs from results
      const newImageUrls = results.map(result => result.url);

      // Update state
      const updatedImages = [...images, ...newImageUrls];
      setImages(updatedImages);

      // Call the callback with the results
      if (onImagesUpload) {
        onImagesUpload(updatedImages, results);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      const errorMsg = 'Failed to upload images. Please try again.';
      setError(errorMsg);

      if (onImagesError) {
        onImagesError(errorMsg);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);

    setImages(updatedImages);

    if (onImageRemove) {
      onImageRemove(updatedImages, index);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{required && '*'}
      </label>

      {/* Display images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="w-full h-24 border border-gray-300 rounded-md overflow-hidden bg-gray-100 relative">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div className="flex items-center">
        <label htmlFor={`multi-image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`} className={`inline-flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isUploading ? 'Uploading...' : 'Add Images'}
        </label>
        <input
          id={`multi-image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          name={`multi-image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          disabled={isUploading}
          className="sr-only"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-sm text-gray-500">
        You can upload up to {maxImages} images
      </p>
    </div>
  );
}
