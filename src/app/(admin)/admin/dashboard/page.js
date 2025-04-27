'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import SalesChart from '@/components/admin/SalesChart';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    periodRevenue: 0,
    growth: {
      orders: 0,
      revenue: 0,
      customers: 0,
      products: 0
    },
    recentOrders: [],
    lowStockProducts: [],
    outOfStockProducts: [],
    salesData: [],
    period: 'week'
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/dashboard');
      return;
    }

    if (isAuthenticated && !isAdmin) {
      router.push('/');
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        if (!user?.token) {
          console.error('No auth token available');
          setLoading(false);
          return;
        }

        // Fetch dashboard statistics
        const statsResponse = await fetch('/api/admin/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }

        const statsData = await statsResponse.json();

        // Fetch recent orders
        const ordersResponse = await fetch('/api/admin/orders/recent?limit=5', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch recent orders');
        }

        const ordersData = await ordersResponse.json();

        // Fetch low stock products (5 or fewer items)
        const lowStockResponse = await fetch('/api/admin/products/low-stock?limit=3&threshold=5', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!lowStockResponse.ok) {
          throw new Error('Failed to fetch low stock products');
        }

        const lowStockData = await lowStockResponse.json();

        // Fetch out of stock products
        const outOfStockResponse = await fetch('/api/admin/products/out-of-stock?limit=3', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!outOfStockResponse.ok) {
          throw new Error('Failed to fetch out of stock products');
        }

        const outOfStockData = await outOfStockResponse.json();

        // Fetch revenue data for chart
        const revenueResponse = await fetch('/api/admin/orders/revenue?period=week', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!revenueResponse.ok) {
          throw new Error('Failed to fetch revenue data');
        }

        const revenueData = await revenueResponse.json();

        // Format recent orders data
        const formattedOrders = ordersData.orders.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber || order._id.substring(0, 8),
          customer: order.user?.name || 'Unknown Customer',
          date: order.createdAt,
          status: order.status.toLowerCase(),
          total: order.totalPrice || 0
        }));

        // Format low stock products data
        const formattedLowStockProducts = lowStockData.products.map(product => ({
          id: product._id,
          name: product.name,
          stock: product.stock,
          threshold: 5, // Default threshold is now 5
          image: product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg')
        }));

        // Format out of stock products data
        const formattedOutOfStockProducts = outOfStockData.products.map(product => ({
          id: product._id,
          name: product.name,
          stock: 0,
          image: product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg')
        }));

        // Set all the data
        setStats({
          totalOrders: statsData.totalOrders || 0,
          totalRevenue: statsData.totalRevenue || 0,
          totalCustomers: statsData.totalCustomers || 0,
          totalProducts: statsData.totalProducts || 0,
          periodRevenue: revenueData.periodRevenue || 0,
          growth: statsData.growth || {
            orders: 0,
            revenue: 0,
            customers: 0,
            products: 0
          },
          recentOrders: formattedOrders,
          lowStockProducts: formattedLowStockProducts,
          outOfStockProducts: formattedOutOfStockProducts,
          salesData: revenueData.dailyRevenue || [],
          period: revenueData.period || 'week'
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, isAdmin, router, user?.token]);

  // Handle period change for sales chart
  const handlePeriodChange = async (period) => {
    if (period === stats.period) return;

    try {
      setLoading(true);

      // Fetch revenue data for the selected period
      const revenueResponse = await fetch(`/api/admin/orders/revenue?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!revenueResponse.ok) {
        throw new Error('Failed to fetch revenue data');
      }

      const revenueData = await revenueResponse.json();

      // Update the sales data, period revenue, and period
      setStats(prevStats => ({
        ...prevStats,
        salesData: revenueData.dailyRevenue || [],
        periodRevenue: revenueData.periodRevenue || 0,
        period: period
      }));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      setLoading(false);
    }
  };

  // Handle custom date range change
  const handleDateRangeChange = async (startDate, endDate) => {
    if (!startDate || !endDate) return;

    try {
      setLoading(true);

      // Format dates for API request
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      // Fetch revenue data for the custom date range
      const revenueResponse = await fetch(
        `/api/admin/orders/revenue?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      if (!revenueResponse.ok) {
        throw new Error('Failed to fetch revenue data for custom date range');
      }

      const revenueData = await revenueResponse.json();

      // Update the sales data and period revenue
      setStats(prevStats => ({
        ...prevStats,
        salesData: revenueData.dailyRevenue || [],
        periodRevenue: revenueData.periodRevenue || 0,
        period: 'custom' // Set period to custom
      }));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching revenue data for custom date range:', error);
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      delivered: {
        color: 'bg-green-100 text-green-800',
        text: 'Delivered',
      },
      processing: {
        color: 'bg-blue-100 text-blue-800',
        text: 'Processing',
      },
      shipped: {
        color: 'bg-purple-100 text-purple-800',
        text: 'Shipped',
      },
      cancelled: {
        color: 'bg-red-100 text-red-800',
        text: 'Cancelled',
      },
    };

    const config = statusConfig[status] || statusConfig.processing;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name}! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
            <span className="p-2 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            {parseFloat(stats.growth.orders) !== 0 && (
              <p className={`ml-2 text-sm font-medium ${parseFloat(stats.growth.orders) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(stats.growth.orders) >= 0 ? '+' : ''}{stats.growth.orders}%
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <span className="p-2 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            {parseFloat(stats.growth.revenue) !== 0 && (
              <p className={`ml-2 text-sm font-medium ${parseFloat(stats.growth.revenue) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(stats.growth.revenue) >= 0 ? '+' : ''}{stats.growth.revenue}%
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
            <span className="p-2 bg-purple-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
            {parseFloat(stats.growth.customers) !== 0 && (
              <p className={`ml-2 text-sm font-medium ${parseFloat(stats.growth.customers) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(stats.growth.customers) >= 0 ? '+' : ''}{stats.growth.customers}%
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
            <span className="p-2 bg-yellow-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            {parseFloat(stats.growth.products) !== 0 && (
              <p className={`ml-2 text-sm font-medium ${parseFloat(stats.growth.products) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(stats.growth.products) >= 0 ? '+' : ''}{stats.growth.products}%
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
            <p className="text-2xl font-bold mt-1">
              ₹{stats.periodRevenue ? stats.periodRevenue.toLocaleString() : '0'}
              <span className="text-sm font-normal text-gray-500 ml-2">
                {stats.period === 'week' ? 'This Week' :
                 stats.period === 'month' ? 'This Month' :
                 stats.period === 'year' ? 'This Year' :
                 stats.period === 'custom' ? 'Custom Range' : 'This Week'}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePeriodChange('week')}
              className={`px-3 py-1 text-sm rounded-md ${stats.period === 'week' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => handlePeriodChange('month')}
              className={`px-3 py-1 text-sm rounded-md ${stats.period === 'month' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => handlePeriodChange('year')}
              className={`px-3 py-1 text-sm rounded-md ${stats.period === 'year' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-primary"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            {stats.growth && (
              <div className="text-sm">
                <span className={`font-medium ${parseFloat(stats.growth.revenue) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(stats.growth.revenue) >= 0 ? '+' : ''}{stats.growth.revenue}%
                </span>
                <span className="text-gray-500 ml-1">vs previous period</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart visualization */}
        <div className="mt-4">
          {stats.salesData && stats.salesData.length > 0 ? (
            <SalesChart
              salesData={stats.salesData}
              period={stats.period}
              onDateRangeChange={handleDateRangeChange}
            />
          ) : (
            <div className="h-64 w-full flex items-center justify-center text-gray-500">
              No sales data available for this period
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link href="/admin/orders" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        {order.orderNumber || order.id.substring(0, 8)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Out of Stock Products - URGENT */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-red-500">
          <div className="p-6 border-b border-gray-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-semibold text-red-900">Out of Stock Products</h3>
                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">0 in stock</span>
              </div>
              <Link href="/admin/products?filter=out-of-stock" className="text-red-600 text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.outOfStockProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.outOfStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                      <Image src={product.image} alt={product.name} width={48} height={48} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-red-600 font-bold">
                        OUT OF STOCK
                      </p>
                    </div>
                    <div>
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="inline-flex items-center px-3 py-1 border border-red-500 text-red-500 text-sm font-medium rounded-md hover:bg-red-50"
                      >
                        Restock Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No out of stock products
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Running Out of Stock Products */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Running Out of Stock</h3>
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">5 or fewer</span>
            </div>
            <Link href="/admin/products?filter=low-stock" className="text-primary text-sm font-medium hover:underline">
              View All Products
            </Link>
          </div>
        </div>
        <div className="p-6">
          {stats.lowStockProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                    <Image src={product.image} alt={product.name} width={48} height={48} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-yellow-600">
                      Only {product.stock} left in stock
                    </p>
                  </div>
                  <div>
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="inline-flex items-center px-3 py-1 border border-yellow-500 text-yellow-700 text-sm font-medium rounded-md hover:bg-yellow-100"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No low stock products
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
