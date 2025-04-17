'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import LoadingSpinner from '@/components/common/LoadingSpinner';

// Dashboard card component
const DashboardCard = ({ title, value, icon, bgColor }) => (
  <div className={`${bgColor} rounded-lg shadow-md p-6 flex items-center`}>
    <div className="rounded-full p-3 bg-white bg-opacity-30 mr-4">
      {icon}
    </div>
    <div>
      <h3 className="text-white text-lg font-medium">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (isClient && !loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login?redirect=/admin');
    }
  }, [isClient, loading, isAuthenticated, user, router]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);

        // Fetch orders count
        const ordersResponse = await fetch('/api/admin/orders/count', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        // Fetch products count
        const productsResponse = await fetch('/api/admin/products/count', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        // Fetch users count
        const usersResponse = await fetch('/api/admin/users/count', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        // Fetch revenue data
        const revenueResponse = await fetch('/api/admin/orders/revenue', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!ordersResponse.ok || !productsResponse.ok || !usersResponse.ok || !revenueResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const ordersData = await ordersResponse.json();
        const productsData = await productsResponse.json();
        const usersData = await usersResponse.json();
        const revenueData = await revenueResponse.json();

        setDashboardData({
          ordersCount: ordersData.count || 0,
          productsCount: productsData.count || 0,
          usersCount: usersData.count || 0,
          totalRevenue: revenueData.totalRevenue || 0,
          pendingOrders: ordersData.pendingCount || 0,
          lowStockProducts: productsData.lowStockCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  // Loading state
  if (loading || !isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Show placeholder data if real data is not available yet
  const data = dashboardData || {
    ordersCount: '...',
    productsCount: '...',
    usersCount: '...',
    totalRevenue: '...',
    pendingOrders: '...',
    lowStockProducts: '...'
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}!</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center my-12">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Dashboard cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Orders"
              value={data.ordersCount}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              bgColor="bg-blue-500"
            />
            <DashboardCard
              title="Total Products"
              value={data.productsCount}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              bgColor="bg-green-500"
            />
            <DashboardCard
              title="Total Users"
              value={data.usersCount}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              bgColor="bg-purple-500"
            />
            <DashboardCard
              title="Total Revenue"
              value={typeof data.totalRevenue === 'number' ? `₹${data.totalRevenue.toLocaleString()}` : data.totalRevenue}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              bgColor="bg-yellow-500"
            />
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders Requiring Attention</h2>
              <div className="flex items-center justify-between p-4 bg-orange-100 rounded-lg">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Pending Orders</p>
                    <p className="text-xl font-bold text-gray-800">{data.pendingOrders}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/admin/orders?status=pending')}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  View
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventory Alerts</h2>
              <div className="flex items-center justify-between p-4 bg-red-100 rounded-lg">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Low Stock Products</p>
                    <p className="text-xl font-bold text-gray-800">{data.lowStockProducts}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/admin/products?filter=lowStock')}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Recent activity section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/admin/orders')}
                className="flex items-center justify-center p-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Manage Orders
              </button>
              <button
                onClick={() => router.push('/admin/products/new')}
                className="flex items-center justify-center p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Product
              </button>
              <button
                onClick={() => router.push('/admin/categories')}
                className="flex items-center justify-center p-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Manage Categories
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
