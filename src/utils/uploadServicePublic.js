'use client';

/**
 * Upload a single file to the server using the public endpoint
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to in Cloudinary
 * @returns {Promise<Object>} - The upload response
 */
export const uploadFilePublic = async (file, folder = 'my-shop') => {
  try {
    // Check if filename has invalid characters
    if (file.name && file.name.match(/[\/\\:*?"<>|]/)) {
      console.log('File name contains invalid characters, will be sanitized on server (public endpoint):', file.name);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    console.log('Uploading file to folder (public endpoint):', folder);

    // Use the public upload endpoint
    const response = await fetch('/api/upload-public', {
      method: 'POST',
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
      console.log('Upload response (public endpoint):', result);
      return result;
    } catch (parseError) {
      console.error('Error parsing response (public endpoint):', parseError);
      throw new Error('Failed to parse server response');
    }
  } catch (error) {
    console.error('Error uploading file (public endpoint):', error);
    throw error;
  }
};

/**
 * Upload multiple files to the server using the public endpoint
 * @param {Array<File>} files - The files to upload
 * @param {string} folder - The folder to upload to in Cloudinary
 * @returns {Promise<Array<Object>>} - Array of upload responses
 */
export const uploadMultipleFilesPublic = async (files, folder = 'my-shop') => {
  try {
    console.log(`Uploading ${files.length} files to folder (public endpoint):`, folder);

    const uploadPromises = Array.from(files).map(file => uploadFilePublic(file, folder));
    const results = await Promise.all(uploadPromises);

    console.log(`Successfully uploaded ${results.length} files to Cloudinary (public endpoint)`);
    return results;
  } catch (error) {
    console.error('Error uploading multiple files (public endpoint):', error);
    throw error;
  }
};
