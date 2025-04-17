'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProduct({ params }) {
  const { id } = params;
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);

        const response = await fetch(`/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchProduct();
    }
  }, [isAuthenticated, user, id]);

  // Handle form submission
  const handleSubmit = async (productData) => {
    if (!isAuthenticated || !user) {
      setError('You must be logged in to update a product');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const data = await response.json();

      // Redirect to products list
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message || 'An error occurred while updating the product');
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
  if (error && !product) {
    return (
      <>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => router.push('/admin/products')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Back to Products
        </button>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {product && (
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEditing={true}
        />
      )}
    </>
  );
}
