'use client';

import { useState, useEffect } from 'react';
import CloudinaryImagePicker from '@/components/common/CloudinaryImagePicker';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function HeroSectionSettings({ settings, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    heroTitle: settings.heroTitle || 'Authentic Spiritual Products',
    heroSubtitle: settings.heroSubtitle || 'Discover our collection of traditional and authentic spiritual products',
    heroButtonText: settings.heroButtonText || 'Shop Now',
    heroButtonLink: settings.heroButtonLink || '/products',
    heroImage: settings.heroImage || '',
    heroImageData: settings.heroImageData || null,
    
    // Promotional banner data
    promoTitle: settings.promoTitle || 'Special Navratri Collection',
    promoSubtitle: settings.promoSubtitle || 'Exclusive discounts on all puja items and decorations for the festive season',
    promoButtonText: settings.promoButtonText || 'Shop the Collection',
    promoButtonLink: settings.promoButtonLink || '/products?category=navratri-collection',
    promoImage: settings.promoImage || '',
    promoImageData: settings.promoImageData || null,
  });

  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle hero image upload
  const handleHeroImageUpload = (result) => {
    setFormData({
      ...formData,
      heroImage: result.url,
      heroImageData: {
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resourceType,
      },
    });
  };

  // Handle promo image upload
  const handlePromoImageUpload = (result) => {
    setFormData({
      ...formData,
      promoImage: result.url,
      promoImageData: {
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resourceType,
      },
    });
  };

  // Handle image upload errors
  const handleImageError = (error) => {
    setErrors({
      ...errors,
      image: error,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.heroTitle) newErrors.heroTitle = 'Hero title is required';
    if (!formData.heroSubtitle) newErrors.heroSubtitle = 'Hero subtitle is required';
    if (!formData.heroImage) newErrors.heroImage = 'Hero image is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Call the onSave function with the form data
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Text content */}
          <div className="space-y-4">
            {/* Hero Title */}
            <div>
              <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700">
                Hero Title
              </label>
              <input
                type="text"
                id="heroTitle"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.heroTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.heroTitle}</p>
              )}
            </div>
            
            {/* Hero Subtitle */}
            <div>
              <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700">
                Hero Subtitle
              </label>
              <textarea
                id="heroSubtitle"
                name="heroSubtitle"
                rows="3"
                value={formData.heroSubtitle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.heroSubtitle && (
                <p className="mt-1 text-sm text-red-600">{errors.heroSubtitle}</p>
              )}
            </div>
            
            {/* Hero Button Text */}
            <div>
              <label htmlFor="heroButtonText" className="block text-sm font-medium text-gray-700">
                Button Text
              </label>
              <input
                type="text"
                id="heroButtonText"
                name="heroButtonText"
                value={formData.heroButtonText}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            
            {/* Hero Button Link */}
            <div>
              <label htmlFor="heroButtonLink" className="block text-sm font-medium text-gray-700">
                Button Link
              </label>
              <input
                type="text"
                id="heroButtonLink"
                name="heroButtonLink"
                value={formData.heroButtonLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          
          {/* Right column - Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Background Image
            </label>
            <CloudinaryImagePicker
              initialImage={formData.heroImage}
              onImageUpload={handleHeroImageUpload}
              onImageError={handleImageError}
              folder="my-shop/banners"
              label="Hero Image"
              required={true}
              errorMessage={errors.heroImage}
            />
            <p className="mt-1 text-sm text-gray-500">
              Recommended size: 1920x600 pixels
            </p>
          </div>
        </div>
      </div>
      
      {/* Promotional Banner Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Promotional Banner</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Text content */}
          <div className="space-y-4">
            {/* Promo Title */}
            <div>
              <label htmlFor="promoTitle" className="block text-sm font-medium text-gray-700">
                Promotional Title
              </label>
              <input
                type="text"
                id="promoTitle"
                name="promoTitle"
                value={formData.promoTitle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            
            {/* Promo Subtitle */}
            <div>
              <label htmlFor="promoSubtitle" className="block text-sm font-medium text-gray-700">
                Promotional Subtitle
              </label>
              <textarea
                id="promoSubtitle"
                name="promoSubtitle"
                rows="3"
                value={formData.promoSubtitle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            
            {/* Promo Button Text */}
            <div>
              <label htmlFor="promoButtonText" className="block text-sm font-medium text-gray-700">
                Button Text
              </label>
              <input
                type="text"
                id="promoButtonText"
                name="promoButtonText"
                value={formData.promoButtonText}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            
            {/* Promo Button Link */}
            <div>
              <label htmlFor="promoButtonLink" className="block text-sm font-medium text-gray-700">
                Button Link
              </label>
              <input
                type="text"
                id="promoButtonLink"
                name="promoButtonLink"
                value={formData.promoButtonLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          
          {/* Right column - Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promotional Banner Image
            </label>
            <CloudinaryImagePicker
              initialImage={formData.promoImage}
              onImageUpload={handlePromoImageUpload}
              onImageError={handleImageError}
              folder="my-shop/banners"
              label="Promotional Image"
              errorMessage={errors.promoImage}
            />
            <p className="mt-1 text-sm text-gray-500">
              Recommended size: 1200x400 pixels
            </p>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <span className="flex items-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
