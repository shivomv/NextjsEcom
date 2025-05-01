'use client';

import { useState, useEffect } from 'react';
import StarRating from '@/components/common/StarRating';

export default function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
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
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

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
      <div className="bg-gray-50 p-4 rounded-md">
        <p>No reviews yet. Be the first to review this product.</p>
      </div>
    );
  }

  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-6">
      {sortedReviews.map((review) => (
        <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-center mb-2">
            <StarRating rating={review.rating} size="sm" color="text-yellow-400" />
            <h3 className="font-medium ml-2">{review.name}</h3>
          </div>

          {review.title && (
            <h4 className="font-medium text-gray-800 mb-2">{review.title}</h4>
          )}

          <p className="text-gray-700 mb-3 whitespace-pre-line">{review.comment}</p>

          {/* Review images */}
          {review.images && review.images.length > 0 && (
            <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
              {review.images.map((image, index) => (
                <div key={index} className="relative flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center text-xs text-gray-500">
            {review.verifiedPurchase && (
              <>
                <span className="flex items-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Purchase
                </span>
                <span className="mx-2">•</span>
              </>
            )}
            <span>{new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>

          {/* Helpful button */}
          <div className="mt-3 flex items-center">
            <button
              className="text-xs text-gray-500 flex items-center hover:text-primary transition-colors"
              aria-label="Mark as helpful"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Helpful {review.helpful?.count > 0 && `(${review.helpful.count})`}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
