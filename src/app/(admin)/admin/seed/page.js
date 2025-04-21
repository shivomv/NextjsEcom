'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function SeedPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSeed = async () => {
    if (!confirm('Are you sure you want to seed the database? This will add initial data if it doesn\'t exist.')) {
      return;
    }

    try {
      setIsSeeding(true);
      setError(null);
      setResult(null);

      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to seed database');
      }

      setResult(data.message);
    } catch (error) {
      console.error('Error seeding database:', error);
      setError(error.message || 'An error occurred while seeding the database');
    } finally {
      setIsSeeding(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Check if user is authenticated and is admin
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Database Seeder</h1>
        <p className="text-gray-600">Seed the database with initial data</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            This tool will seed the database with initial data for categories, products, and other entities.
            It will only add data if it does not already exist.
          </p>
          <p className="text-yellow-600 font-medium">
            Note: This should only be used in development environments.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {result}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSeeding ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Seeding...
              </>
            ) : (
              'Seed Database'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
