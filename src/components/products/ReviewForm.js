'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import StarRating from '@/components/common/StarRating';

export default function ReviewForm({ productId }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

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

      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setSuccess('Review submitted successfully!');
      setComment('');
      
      // Refresh the page to show the new review
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
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="mb-4">Please log in to write a review.</p>
        <button
          onClick={() => router.push(`/login?redirect=/products/${productId}`)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Log In
        </button>
      </div>
    );
  }

  // Display message if checking purchase status
  if (checkingPurchase) {
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        <p>Checking purchase history...</p>
      </div>
    );
  }

  // Display message if user hasn't purchased the product
  if (!hasPurchased) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
        <p className="text-yellow-800">
          You can only review products you have purchased and received.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h3 className="text-lg font-bold mb-4">Write a Review</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingChange(value)}
                className="mr-1 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill={value <= rating ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  className={`h-8 w-8 ${
                    value <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating} {rating === 1 ? 'Star' : 'Stars'}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review
          </label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Share your experience with this product..."
            required
            minLength={10}
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 characters required
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading
              ? 'bg-gray-400'
              : 'bg-primary hover:bg-primary-dark'
          } text-white px-4 py-2 rounded-md transition-colors`}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
