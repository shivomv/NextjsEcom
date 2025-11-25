'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import StarRating from '@/components/common/StarRating';
import { useAuth } from '@/context/AuthContext';

export default function ReviewList({ productId, onEditReview, onReviewSubmitted }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews`);

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError(err.message || 'Error loading reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // Refresh reviews when onReviewSubmitted is called
  useEffect(() => {
    fetchReviews();
  }, [onReviewSubmitted, fetchReviews]);

  if (loading) {
    return (
      <div className="py-4">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-500">Be the first to share your experience with this product</p>
      </div>
    );
  }

  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-4">
      {sortedReviews.map((review) => (
        <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{review.name}</h3>
                {review.verifiedPurchase && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Verified Purchase
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="sm" color="text-yellow-400" />
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            {/* Edit button - only show for the user's own reviews */}
            {user && review.user.toString() === user._id && (
              <button
                onClick={() => onEditReview && onEditReview(review)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                aria-label="Edit review"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>

          {/* Review title */}
          {review.title && (
            <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
          )}

          {/* Review comment */}
          <p className="text-gray-700 leading-relaxed mb-3 whitespace-pre-line">{review.comment}</p>

          {/* Review images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {review.images.map((image, index) => (
                <div key={index} className="relative flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors cursor-pointer">
                  <Image
                    src={image}
                    alt={`Review image ${index + 1}`}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover hover:scale-110 transition-transform"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <button
              className="text-sm text-gray-600 flex items-center gap-1 hover:text-primary transition-colors"
              aria-label="Mark as helpful"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>Helpful</span>
              {review.helpful?.count > 0 && <span className="text-gray-500">({review.helpful.count})</span>}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
