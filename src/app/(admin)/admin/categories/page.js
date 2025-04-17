'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';

export default function CategoriesManagement() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);

        const response = await fetch('/api/categories', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();

        // Sort categories by order
        const sortedCategories = data.sort((a, b) => a.order - b.order);
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchCategories();
    }
  }, [isAuthenticated, user]);

  // Handle delete category
  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      // Refresh categories list
      setCategories(categories.filter(category => category._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
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
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Category
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Categories grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200 relative">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {category.isFestival && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Festival
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {category.parent ? 'Subcategory' : 'Main Category'}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/categories/edit/${category._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
