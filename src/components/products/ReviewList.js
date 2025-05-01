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
          
          <p className="text-gray-700 mb-2 whitespace-pre-line">{review.comment}</p>
          
          <div className="flex items-center text-xs text-gray-500">
            <span>Verified Purchase</span>
            <span className="mx-2">•</span>
            <span>{new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
