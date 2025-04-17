'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function CategoryForm({ initialData, onSubmit, isSubmitting, isEditing = false }) {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialData);
  const [parentCategories, setParentCategories] = useState([]);
  const [isLoadingParentCategories, setIsLoadingParentCategories] = useState(true);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(initialData.image || '');

  // Fetch parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        setIsLoadingParentCategories(true);
        
        const response = await fetch('/api/categories/parents');
        
        if (!response.ok) {
          throw new Error('Failed to fetch parent categories');
        }
        
        const data = await response.json();
        
        // Filter out the current category if editing
        const filteredCategories = isEditing 
          ? data.filter(category => category._id !== initialData._id)
          : data;
          
        setParentCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching parent categories:', error);
      } finally {
        setIsLoadingParentCategories(false);
      }
    };
    
    fetchParentCategories();
  }, [isEditing, initialData._id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' ? checked : 
                    (name === 'order') ? 
                    (value === '' ? '' : Number(value)) : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // For a real implementation, you would upload the file to a storage service
    // and get back a URL. For this example, we'll use a placeholder.
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    
    setFormData({
      ...formData,
      image: imageUrl // In a real app, this would be the URL from your storage service
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Category name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Category name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                  errors.description ? 'border-red-500' : ''
                }`}
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Parent category */}
            <div>
              <label htmlFor="parent" className="block text-sm font-medium text-gray-700">
                Parent Category
              </label>
              <select
                id="parent"
                name="parent"
                value={formData.parent || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                disabled={isLoadingParentCategories}
              >
                <option value="">None (Top-level category)</option>
                {parentCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to create a top-level category
              </p>
            </div>

            {/* Order */}
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                id="order"
                name="order"
                min="0"
                value={formData.order}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              <p className="mt-1 text-sm text-gray-500">
                Lower numbers appear first
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Category Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Image
              </label>
              <div className="mt-1 flex items-center">
                <div className="w-32 h-32 border border-gray-300 rounded-md overflow-hidden bg-gray-100 relative">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Category preview"
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
                <label htmlFor="image-upload" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                  Change
                </label>
                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG or GIF up to 5MB
              </p>
            </div>

            {/* Status toggles */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active (visible to customers)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="isFestival"
                  name="isFestival"
                  type="checkbox"
                  checked={formData.isFestival}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isFestival" className="ml-2 block text-sm text-gray-700">
                  Festival Category
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Category' : 'Create Category'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
