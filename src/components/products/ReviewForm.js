'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import StarRating from '@/components/common/StarRating';

export default function ReviewForm({ productId, reviewToEdit, onReviewUpdated, onCancel, initialShowForm = false, onReviewSubmitted }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(reviewToEdit ? reviewToEdit.rating : 5);
  const [comment, setComment] = useState(reviewToEdit ? reviewToEdit.comment : '');
  const [images, setImages] = useState(reviewToEdit ? reviewToEdit.images : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isEditing, setIsEditing] = useState(!!reviewToEdit);
  const [userReview, setUserReview] = useState(null);
  const [showForm, setShowForm] = useState(initialShowForm || !!reviewToEdit);

  // Update form when reviewToEdit or initialShowForm changes
  useEffect(() => {
    if (reviewToEdit) {
      setRating(reviewToEdit.rating);
      setComment(reviewToEdit.comment);
      setImages(reviewToEdit.images || []);
      setIsEditing(true);
      setShowForm(true);
    } else {
      setRating(5);
      setComment('');
      setImages([]);
      setIsEditing(false);
      // Only update showForm if initialShowForm changes and we're not editing
      if (!isEditing) {
        setShowForm(initialShowForm);
      }
    }
  }, [reviewToEdit, initialShowForm]);

  // Check if user has already reviewed this product
  useEffect(() => {
    const checkUserReview = async () => {
      if (!isAuthenticated || !user || !productId) {
        return;
      }

      try {
        const response = await fetch(`/api/products/${productId}/user-review`);

        if (response.ok) {
          const data = await response.json();
          setUserReview(data.review);

          // If user has already reviewed and we're not in edit mode,
          // don't show the form by default
          if (data.hasReviewed && !reviewToEdit) {
            setShowForm(false);
          }
        }
      } catch (err) {
        console.error('Error checking user review:', err);
      }
    };

    checkUserReview();
  }, [isAuthenticated, user, productId, reviewToEdit]);

  // Check if user has purchased the product
  useEffect(() => {
    const checkPurchase = async () => {
      if (!isAuthenticated || !user) {
        setCheckingPurchase(false);
        return;
      }

      try {
        setCheckingPurchase(true);
        const response = await fetch(`/api/products/${productId}/check-purchase`);

        if (response.ok) {
          const data = await response.json();
          setHasPurchased(data.hasPurchased);
        } else {
          setError('Failed to verify purchase history');
        }
      } catch (err) {
        setError('Error checking purchase history');
        console.error('Error checking purchase:', err);
      } finally {
        setCheckingPurchase(false);
      }
    };

    if (productId) {
      checkPurchase();
    }
  }, [productId, isAuthenticated, user]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Limit to 5 images
    if (images.length + files.length > 5) {
      setError('You can upload a maximum of 5 images');
      return;
    }

    // Check file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed');
        return false;
      }

      if (file.size > maxSize) {
        setError('Images must be less than 5MB');
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    try {
      setUploadingImages(true);
      setError('');

      // Create FormData for upload
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('files', file);
      });

      // Upload to Cloudinary through your API
      const response = await fetch('/api/upload-public', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();

      // Add new images to the existing ones
      setImages([...images, ...data.urls]);

    } catch (err) {
      setError(err.message || 'Error uploading images');
      console.error('Error uploading images:', err);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${productId}`);
      return;
    }

    if (!hasPurchased) {
      setError('You can only review products you have purchased');
      return;
    }

    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Please provide a comment with at least 10 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      let url = `/api/products/${productId}/reviews`;
      let method = 'POST';
      let requestBody = {
        rating,
        comment,
        images,
      };

      // If editing an existing review, use PUT method and include reviewId
      if (isEditing && reviewToEdit) {
        method = 'PUT';
        requestBody.reviewId = reviewToEdit._id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      // Set success message based on whether creating or updating
      setSuccess(isEditing ? 'Review updated successfully!' : 'Review submitted successfully!');

      // Clear the form and hide it if updating
      if (isEditing) {
        setShowForm(false);
      } else {
        // Clear the form if creating new
        setComment('');
        setRating(5);
        setImages([]);
      }

      // Call the callback function if provided
      if (onReviewUpdated) {
        onReviewUpdated(data.review);
      }

      // Call the refresh function if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Refresh the page to show the updated review
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error submitting review');
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  // Display login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to write a review</h3>
        <p className="text-gray-600 mb-4">Share your experience with other customers</p>
        <button
          onClick={() => router.push(`/login?redirect=/products/${productId}`)}
          className="bg-gradient-purple-pink text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Display message if checking purchase status
  if (checkingPurchase) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <svg className="animate-spin h-8 w-8 mx-auto text-purple-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600">Verifying purchase history...</p>
      </div>
    );
  }

  // Display message if user hasn't purchased the product
  if (!hasPurchased) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchase Required</h3>
        <p className="text-gray-700">
          Only verified buyers can write reviews to ensure authenticity
        </p>
      </div>
    );
  }

  // If user has already reviewed and we're not in edit mode, don't show anything
  if (userReview && !showForm && !isEditing) {
    return null; // Don't show anything, as the review is already shown in the ReviewList
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Your Review' : 'Share Your Experience'}</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Rate this product *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingChange(value)}
                className="focus:outline-none hover:scale-110 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-10 w-10 transition-colors ${
                    value <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-3 text-base font-medium text-gray-700">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Very Poor'}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="comment" className="block text-sm font-semibold text-gray-900 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            rows="5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Tell us what you liked or disliked about this product. How did it meet your expectations?"
            required
            minLength={10}
          ></textarea>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Minimum 10 characters
            </p>
            <p className="text-xs text-gray-500">
              {comment.length} characters
            </p>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Add Photos (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Help others by showing the product in use
          </p>
          
          {/* Preview uploaded images */}
          {images.length > 0 && (
            <div className="mb-4 grid grid-cols-5 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-colors">
                    <img
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="relative cursor-pointer">
            <div className={`flex items-center justify-center px-6 py-4 border-2 border-dashed rounded-lg transition-all ${
              uploadingImages || images.length >= 5
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-purple-300 bg-purple-50 hover:bg-purple-100 hover:border-purple-400'
            }`}>
              {uploadingImages ? (
                <div className="flex items-center gap-2 text-purple-600">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm font-medium">Uploading images...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-purple-600">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {images.length >= 5 ? 'Maximum 5 images reached' : 'Click to upload photos'}
                  </span>
                  <span className="text-xs text-gray-500">({images.length}/5)</span>
                </div>
              )}
            </div>
            <input
              type="file"
              className="sr-only"
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={uploadingImages || images.length >= 5}
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            JPEG, PNG, or WebP • Max 5MB per image
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || uploadingImages || comment.length < 10}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              loading || uploadingImages || comment.length < 10
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-purple-pink text-white hover:opacity-90 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{isEditing ? 'Update Review' : 'Submit Review'}</span>
              </>
            )}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                if (onCancel) onCancel();
              }}
              className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
