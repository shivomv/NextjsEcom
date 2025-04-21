'use client';

/**
 * Upload a single file to the server (test version)
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to in Cloudinary
 * @returns {Promise<Object>} - The upload response
 */
export const uploadFile = async (file, folder = 'test-uploads') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload-test', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload file');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
