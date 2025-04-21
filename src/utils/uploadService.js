'use client';

/**
 * Upload a single file to the server
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to in Cloudinary
 * @returns {Promise<Object>} - The upload response
 */
export const uploadFile = async (file, folder = 'my-shop', token = null) => {
  try {
    // Check if filename has invalid characters
    if (file.name && file.name.match(/[\/\\:*?"<>|]/)) {
      console.log('File name contains invalid characters, will be sanitized on server:', file.name);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    console.log('Uploading file to folder:', folder);

    // Use the upload API endpoint
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    // Check if response is ok
    if (!response.ok) {
      // Try to parse error as JSON
      let errorMessage = 'Failed to upload file';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If we can't parse JSON, try to get text
        try {
          const errorText = await response.text();
          errorMessage = `Upload failed: ${response.status} ${response.statusText}. ${errorText.substring(0, 100)}`;
        } catch (textError) {
          errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        }
      }

      throw new Error(errorMessage);
    }

    try {
      const result = await response.json();
      console.log('Upload response:', result);
      return result;
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Failed to parse server response');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload multiple files to the server
 * @param {Array<File>} files - The files to upload
 * @param {string} folder - The folder to upload to in Cloudinary
 * @returns {Promise<Array<Object>>} - Array of upload responses
 */
export const uploadMultipleFiles = async (files, folder = 'my-shop', token = null) => {
  try {
    console.log(`Uploading ${files.length} files to folder: ${folder}`);

    const uploadPromises = Array.from(files).map(file => uploadFile(file, folder, token));
    const results = await Promise.all(uploadPromises);

    console.log(`Successfully uploaded ${results.length} files to Cloudinary`);
    return results;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} - The deletion response
 */
export const deleteFile = async (publicId, token = null) => {
  try {
    // Use the upload API endpoint
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/upload', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ public_id: publicId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete file');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string|null} - The public ID or null if not found
 */
export const extractPublicId = (url) => {
  if (!url || typeof url !== 'string') return null;

  try {
    // Match pattern: /my-shop/filename.ext
    const match = url.match(/\/([^/]+\/[^/]+)\.[^.]+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};
