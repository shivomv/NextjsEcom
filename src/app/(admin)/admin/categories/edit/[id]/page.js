'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import CategoryForm from '@/components/admin/CategoryForm';

export default function EditCategory({ params }) {
  const { id } = params;
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);

        const response = await fetch(`/api/categories/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch category');
        }

        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Failed to load category. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchCategory();
    }
  }, [isAuthenticated, user, id]);

  // Handle form submission
  const handleSubmit = async (categoryData) => {
    if (!isAuthenticated || !user) {
      setError('You must be logged in to update a category');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
      }

      const data = await response.json();

      // Redirect to categories list
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      setError(error.message || 'An error occurred while updating the category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading || !isClient || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error && !category) {
    return (
      <>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => router.push('/admin/categories')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Back to Categories
        </button>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
        <p className="text-gray-600">Update category information</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {category && (
        <CategoryForm
          initialData={category}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEditing={true}
        />
      )}
    </>
  );
}
