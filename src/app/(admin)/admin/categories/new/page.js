'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import CategoryForm from '@/components/admin/CategoryForm';

export default function AddCategory() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initial empty category data
  const initialCategoryData = {
    name: '',
    description: '',
    image: '',
    parent: '',
    isFestival: false,
    isActive: true,
    order: 0
  };

  // Handle form submission
  const handleSubmit = async (categoryData) => {
    if (!isAuthenticated || !user) {
      setError('You must be logged in to add a category');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Log the data being sent to the server
      console.log('Sending category data to server:', {
        ...categoryData,
        image: categoryData.image ? 'Present' : 'Not present',
        imageData: categoryData.imageData ? 'Present' : 'Not present'
      });

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      const data = await response.json();

      // Redirect to categories list
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      setError(error.message || 'An error occurred while creating the category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading || !isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Category</h1>
        <p className="text-gray-600">Create a new product category</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <CategoryForm
        initialData={initialCategoryData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
