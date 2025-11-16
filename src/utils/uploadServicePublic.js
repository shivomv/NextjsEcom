export const uploadFilePublic = async (file, folder = 'my-shop') => {
  try {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.`);
    }
    
    if (file.size > maxSize) {
      throw new Error(`File too large: ${file.name}. Maximum size is 5MB.`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload-public', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    try {
      const result = await response.json();
      return result;
    } catch (parseError) {
      throw new Error('Failed to parse server response');
    }
  } catch (error) {
    throw error;
  }
};

export const uploadMultipleFilesPublic = async (files, folder = 'my-shop') => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadFilePublic(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw error;
  }
};
