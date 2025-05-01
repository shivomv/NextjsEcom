'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CloudinaryImagePicker from '@/components/common/CloudinaryImagePicker';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function HeroSlidesSettings({ settings, onSave, isSaving }) {
  const [slides, setSlides] = useState([]);
  const [errors, setErrors] = useState({});

  // Initialize slides from settings
  useEffect(() => {
    if (settings.hero && settings.hero.slides && Array.isArray(settings.hero.slides)) {
      // Add unique IDs to slides if they don't have them
      const slidesWithIds = settings.hero.slides.map((slide, index) => ({
        ...slide,
        id: slide.id || `slide-${Date.now()}-${index}`,
      }));
      setSlides(slidesWithIds);
      console.log("Loaded slides:", slidesWithIds);
    } else if (settings.heroSlides && Array.isArray(settings.heroSlides)) {
      // Legacy format support
      const slidesWithIds = settings.heroSlides.map((slide, index) => ({
        ...slide,
        id: slide.id || `slide-${Date.now()}-${index}`,
      }));
      setSlides(slidesWithIds);
      console.log("Loaded slides from legacy format:", slidesWithIds);
    } else {
      // Start with an empty array if no slides exist
      setSlides([]);
      console.log("No slides found, starting with empty array");
    }
  }, [settings]);

  // Handle adding a new slide
  const handleAddSlide = () => {
    // Generate a truly unique ID with timestamp and random string
    const uniqueId = `slide-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newSlide = {
      id: uniqueId,
      title: 'New Slide',
      subtitle: 'Add your subtitle here',
      buttonText: 'Click Here',
      buttonLink: '/products',
      image: '',
      imageData: null,
    };

    console.log("Adding new slide:", newSlide);
    setSlides(prevSlides => [...prevSlides, newSlide]);
  };

  // Handle removing a slide
  const handleRemoveSlide = (index) => {
    if (slides.length <= 1) {
      alert('You must have at least one slide');
      return;
    }

    setSlides(prevSlides => {
      const newSlides = [...prevSlides];
      newSlides.splice(index, 1);
      return newSlides;
    });
  };

  // Handle slide input changes
  const handleSlideChange = (index, field, value) => {
    setSlides(prevSlides => {
      // Create a deep copy of the slides array
      const newSlides = JSON.parse(JSON.stringify(prevSlides));

      // Make sure the index is valid
      if (index >= 0 && index < newSlides.length) {
        // Update the specific slide field
        newSlides[index] = {
          ...newSlides[index],
          [field]: value,
        };
      }

      return newSlides;
    });
  };

  // Handle image upload for a slide
  const handleImageUpload = (index, result) => {
    console.log(`Uploading image for slide at index ${index}:`, result);

    setSlides(prevSlides => {
      // Create a deep copy of the slides array
      const newSlides = JSON.parse(JSON.stringify(prevSlides));

      // Make sure the index is valid
      if (index >= 0 && index < newSlides.length) {
        // Update the specific slide with the new image data
        newSlides[index] = {
          ...newSlides[index],
          image: result.url,
          imageData: {
            publicId: result.publicId,
            width: result.width,
            height: result.height,
            format: result.format,
            resourceType: result.resourceType,
          },
        };
        console.log(`Updated slide ${index} with new image:`, newSlides[index]);
      } else {
        console.error(`Invalid slide index: ${index}, slides length: ${newSlides.length}`);
      }

      return newSlides;
    });
  };

  // Handle image upload errors
  const handleImageError = (index, error) => {
    setErrors({
      ...errors,
      [`slide_${index}_image`]: error,
    });
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    setSlides(prevSlides => {
      const items = Array.from(prevSlides);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      return items;
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    slides.forEach((slide, index) => {
      if (!slide.title) newErrors[`slide_${index}_title`] = 'Title is required';
      if (!slide.subtitle) newErrors[`slide_${index}_subtitle`] = 'Subtitle is required';
      if (!slide.image) newErrors[`slide_${index}_image`] = 'Image is required';
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call the onSave function with the structured data format
    onSave({
      tab: 'hero',
      data: { slides },
      isPublic: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Hero Slides</h3>
          <button
            type="button"
            onClick={handleAddSlide}
            className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
          >
            Add Slide
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="slides">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6"
              >
                {slides.map((slide, index) => (
                  <Draggable key={slide.id} draggableId={slide.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div
                            {...provided.dragHandleProps}
                            className="flex items-center cursor-move"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                            <h4 className="font-medium">Slide {index + 1}</h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSlide(index)}
                            className="text-red-500 hover:text-red-700"
                            disabled={slides.length <= 1}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left column - Text content */}
                          <div className="space-y-4">
                            {/* Slide Title */}
                            <div>
                              <label htmlFor={`slide_${index}_title`} className="block text-sm font-medium text-gray-700">
                                Title
                              </label>
                              <input
                                type="text"
                                id={`slide_${index}_title`}
                                value={slide.title}
                                onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                              />
                              {errors[`slide_${index}_title`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`slide_${index}_title`]}</p>
                              )}
                            </div>

                            {/* Slide Subtitle */}
                            <div>
                              <label htmlFor={`slide_${index}_subtitle`} className="block text-sm font-medium text-gray-700">
                                Subtitle
                              </label>
                              <textarea
                                id={`slide_${index}_subtitle`}
                                rows="2"
                                value={slide.subtitle}
                                onChange={(e) => handleSlideChange(index, 'subtitle', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                              />
                              {errors[`slide_${index}_subtitle`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`slide_${index}_subtitle`]}</p>
                              )}
                            </div>

                            {/* Button Text */}
                            <div>
                              <label htmlFor={`slide_${index}_buttonText`} className="block text-sm font-medium text-gray-700">
                                Button Text
                              </label>
                              <input
                                type="text"
                                id={`slide_${index}_buttonText`}
                                value={slide.buttonText}
                                onChange={(e) => handleSlideChange(index, 'buttonText', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                              />
                            </div>

                            {/* Button Link */}
                            <div>
                              <label htmlFor={`slide_${index}_buttonLink`} className="block text-sm font-medium text-gray-700">
                                Button Link
                              </label>
                              <input
                                type="text"
                                id={`slide_${index}_buttonLink`}
                                value={slide.buttonLink}
                                onChange={(e) => handleSlideChange(index, 'buttonLink', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                              />
                            </div>
                          </div>

                          {/* Right column - Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Slide Image
                            </label>
                            <CloudinaryImagePicker
                              initialImage={slide.image}
                              onImageUpload={(result) => handleImageUpload(index, result)}
                              onImageError={(error) => handleImageError(index, error)}
                              folder="my-shop/banners"
                              label={`Slide ${index + 1} Image`}
                              required={true}
                              errorMessage={errors[`slide_${index}_image`]}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Recommended size: 1920x600 pixels
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
