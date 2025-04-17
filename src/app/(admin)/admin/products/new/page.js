'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import ProductForm from '@/components/admin/ProductForm';

export default function AddProduct() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initial empty product data
  const initialProductData = {
    name: '',
    description: '',
    price: '',
    mrp: '',
    brand: '',
    category: '',
    countInStock: '',
    image: '',
    images: [],
    isActive: true,
    isFeatured: false,
    specifications: []
  };

  // Handle form submission
  const handleSubmit = async (productData) => {
    if (!isAuthenticated || !user) {
      setError('You must be logged in to add a product');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const data = await response.json();

      // Redirect to products list
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'An error occurred while creating the product');
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
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-600">Create a new product in your inventory</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <ProductForm
        initialData={initialProductData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
