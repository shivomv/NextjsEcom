'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CloudinaryImagePicker from '@/components/common/CloudinaryImagePicker';
import CloudinaryMultiImagePicker from '@/components/common/CloudinaryMultiImagePicker';

export default function ProductForm({ initialData, onSubmit, isSubmitting, isEditing = false }) {
  const router = useRouter();
  const { user } = useAuth();

  // Process initialData to handle category properly
  const processedInitialData = {
    ...initialData,
    // If category is an object (populated from DB), extract the ID
    category: initialData.category && typeof initialData.category === 'object'
      ? initialData.category._id
      : initialData.category
  };

  const [formData, setFormData] = useState(processedInitialData);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [newSpecification, setNewSpecification] = useState({ name: '', value: '' });
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(null);
  const [imagesError, setImagesError] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);

        const response = await fetch('/api/categories');

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const newValue = type === 'checkbox' ? checked :
                    (name === 'price' || name === 'mrp' || name === 'countInStock') ?
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

  // Handle main image upload success
  const handleImageUpload = (result) => {
    console.log('Main image upload success:', result);

    // Store the complete image data in the form
    setFormData({
      ...formData,
      image: result.url,
      imageData: {
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type
      }
    });

    // Clear any image error
    if (errors.image) {
      setErrors({
        ...errors,
        image: null
      });
    }
  };

  // Handle main image upload error
  const handleImageError = (errorMessage) => {
    setErrors({
      ...errors,
      image: errorMessage
    });
    setImageError(errorMessage);
  };

  // Handle additional images upload success
  const handleImagesUpload = (imageUrls, results) => {
    console.log('Additional images upload success:', results);

    // Store the complete image data in the form
    const imagesData = results.map(result => ({
      url: result.url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type
    }));

    setFormData({
      ...formData,
      images: imageUrls,
      imagesData: imagesData
    });

    // Clear any images error
    if (errors.images) {
      setErrors({
        ...errors,
        images: null
      });
    }
  };

  // Handle additional images upload error
  const handleImagesError = (errorMessage) => {
    setErrors({
      ...errors,
      images: errorMessage
    });
    setImagesError(errorMessage);
  };

  // Handle image removal
  const handleImageRemove = (updatedImages) => {
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  // Handle specification input change
  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setNewSpecification({
      ...newSpecification,
      [name]: value
    });
  };

  // Add specification
  const handleAddSpecification = () => {
    if (!newSpecification.name || !newSpecification.value) return;

    setFormData({
      ...formData,
      specifications: [
        ...formData.specifications,
        { ...newSpecification }
      ]
    });

    // Reset new specification form
    setNewSpecification({ name: '', value: '' });
  };

  // Remove specification
  const handleRemoveSpecification = (index) => {
    const updatedSpecifications = [...formData.specifications];
    updatedSpecifications.splice(index, 1);

    setFormData({
      ...formData,
      specifications: updatedSpecifications
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.mrp && formData.mrp < formData.price) newErrors.mrp = 'MRP cannot be less than price';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.countInStock && formData.countInStock !== 0) newErrors.countInStock = 'Stock quantity is required';
    if (formData.countInStock < 0) newErrors.countInStock = 'Stock quantity cannot be negative';
    if (!formData.image) newErrors.image = 'Product image is required';

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
            {/* Product name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name*
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

            {/* Price and MRP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (₹)*
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                    errors.price ? 'border-red-500' : ''
                  }`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="mrp" className="block text-sm font-medium text-gray-700">
                  MRP (₹)
                </label>
                <input
                  type="number"
                  id="mrp"
                  name="mrp"
                  min="0"
                  step="0.01"
                  value={formData.mrp}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                    errors.mrp ? 'border-red-500' : ''
                  }`}
                />
                {errors.mrp && <p className="mt-1 text-sm text-red-600">{errors.mrp}</p>}
              </div>
            </div>

            {/* Brand and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category && typeof formData.category === 'object' ? formData.category._id : formData.category}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                    errors.category ? 'border-red-500' : ''
                  }`}
                  disabled={isLoadingCategories}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700">
                Stock Quantity*
              </label>
              <input
                type="number"
                id="countInStock"
                name="countInStock"
                min="0"
                value={formData.countInStock}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                  errors.countInStock ? 'border-red-500' : ''
                }`}
              />
              {errors.countInStock && <p className="mt-1 text-sm text-red-600">{errors.countInStock}</p>}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Product Image */}
            <CloudinaryImagePicker
              initialImage={initialData.image || ''}
              onImageUpload={handleImageUpload}
              onImageError={handleImageError}
              folder="my-shop/products"
              label="Product Image"
              required={true}
              errorMessage={errors.image || imageError}
            />

            {/* Additional Images */}
            <CloudinaryMultiImagePicker
              initialImages={initialData.images || []}
              onImagesUpload={handleImagesUpload}
              onImagesError={handleImagesError}
              onImageRemove={handleImageRemove}
              folder="my-shop/products"
              label="Additional Images"
              errorMessage={errors.images || imagesError}
              maxImages={10}
            />

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
                  id="isFeatured"
                  name="isFeatured"
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                  Featured (show on homepage)
                </label>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications
              </label>

              {/* Existing specifications */}
              {formData.specifications.length > 0 && (
                <div className="mb-4 border border-gray-200 rounded-md divide-y">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center p-3">
                      <div>
                        <span className="font-medium">{spec.name}:</span> {spec.value}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecification(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new specification */}
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={newSpecification.name}
                    onChange={handleSpecificationChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Value"
                    name="value"
                    value={newSpecification.value}
                    onChange={handleSpecificationChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleAddSpecification}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
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
              isEditing ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
