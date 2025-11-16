import config from '@/config';

export const uploadFile = async (file, folder = config.cloudinary.defaultFolder, token = null) => {
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

    const headers = {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers,
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

export const uploadMultipleFiles = async (files, folder = config.cloudinary.defaultFolder, token = null) => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadFile(file, folder, token));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (publicId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch('/api/upload', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ public_id: publicId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Delete failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const extractPublicId = (url) => {
  try {
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};
