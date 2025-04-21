'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminTemplate({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get redirect parameter from URL if it exists
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (isClient && !loading) {
      if (!isAuthenticated) {
        // Not logged in, redirect to login page
        router.push(`/login?redirect=/admin`);
      } else if (user?.role !== 'admin') {
        // Logged in but not admin, redirect directly to home
        router.push('/');
      }
    }
  }, [isClient, loading, isAuthenticated, user, router]);

  // Loading state
  if (loading || !isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Render admin content only if user is authenticated and is an admin
  if (isClient && !loading && isAuthenticated && user?.role === 'admin') {
    return children;
  }

  // Show loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
}
