'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function StatisticsPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    orders: {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      byDate: []
    },
    products: {
      total: 0,
      active: 0,
      inactive: 0,
      lowStock: 0,
      featured: 0,
      byCategory: []
    },
    customers: {
      total: 0,
      new: 0,
      returning: 0,
      byLocation: []
    },
    revenue: {
      total: 0,
      period: 0,
      byDate: [],
      byPaymentMethod: []
    }
  });

  const fetchStatisticsData = useCallback(async () => {
    try {
      setLoading(true);

      if (!user?.token) {
        console.error('No auth token available');
        setLoading(false);
        return;
      }

      // Fetch orders statistics
      const ordersResponse = await fetch(`/api/admin/orders/count?period=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      // Fetch products statistics
      const productsResponse = await fetch('/api/admin/products/count', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      // Fetch customers statistics
      const customersResponse = await fetch('/api/admin/users/count', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      // Fetch revenue statistics
      const revenueResponse = await fetch(`/api/admin/orders/revenue?period=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!ordersResponse.ok || !productsResponse.ok || !customersResponse.ok || !revenueResponse.ok) {
        throw new Error('Failed to fetch statistics data');
      }

      const ordersData = await ordersResponse.json();
      const productsData = await productsResponse.json();
      const customersData = await customersResponse.json();
      const revenueData = await revenueResponse.json();

      // Set all the data
      setStats({
        orders: {
          total: ordersData.count || 0,
          pending: ordersData.pendingCount || 0,
          processing: ordersData.processingCount || 0,
          shipped: ordersData.shippedCount || 0,
          delivered: ordersData.deliveredCount || 0,
          cancelled: ordersData.cancelledCount || 0,
          byDate: ordersData.byDate || []
        },
        products: {
          total: productsData.count || 0,
          active: productsData.activeCount || 0,
          inactive: productsData.inactiveCount || 0,
          lowStock: productsData.lowStockCount || 0,
          featured: productsData.featuredCount || 0,
          byCategory: productsData.byCategory || []
        },
        customers: {
          total: customersData.count || 0,
          new: customersData.newCount || 0,
          returning: customersData.returningCount || 0,
          byLocation: customersData.byLocation || []
        },
        revenue: {
          total: revenueData.totalRevenue || 0,
          period: revenueData.periodRevenue || 0,
          byDate: revenueData.dailyRevenue || [],
          byPaymentMethod: revenueData.byPaymentMethod || []
        }
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics data:', error);
      setLoading(false);
    }
  }, [user, timeRange]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login?redirect=/admin/statistics');
      return;
    }

    fetchStatisticsData();
  }, [isAuthenticated, isAdmin, router, timeRange, fetchStatisticsData]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Statistics</h1>
        <p className="text-gray-600">
          Comprehensive statistics and analytics for your store.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Time Range:</span>
          <button
            onClick={() => handleTimeRangeChange('week')}
            className={`px-3 py-1 text-xs rounded-md ${
              timeRange === 'week' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handleTimeRangeChange('month')}
            className={`px-3 py-1 text-xs rounded-md ${
              timeRange === 'month' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => handleTimeRangeChange('year')}
            className={`px-3 py-1 text-xs rounded-md ${
              timeRange === 'year' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last 12 Months
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'customers'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'revenue'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Revenue
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Orders Statistics</h2>
            </div>

            {/* Orders Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Total</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.orders.total}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-700">Pending</h3>
                <p className="text-2xl font-semibold text-yellow-900">{stats.orders.pending}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-700">Processing</h3>
                <p className="text-2xl font-semibold text-blue-900">{stats.orders.processing}</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-indigo-700">Shipped</h3>
                <p className="text-2xl font-semibold text-indigo-900">{stats.orders.shipped}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-700">Delivered</h3>
                <p className="text-2xl font-semibold text-green-900">{stats.orders.delivered}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-red-700">Cancelled</h3>
                <p className="text-2xl font-semibold text-red-900">{stats.orders.cancelled}</p>
              </div>
            </div>

            {/* Orders by Date Table */}
            <div className="p-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Orders by Date</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Order Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.revenue.byDate.length > 0 ? (
                      stats.revenue.byDate.map((day, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(day.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {day.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{day.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{day.count > 0 ? (day.revenue / day.count).toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No data available for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Products Statistics</h2>
            </div>

            {/* Products Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Total</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.products.total}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-700">Active</h3>
                <p className="text-2xl font-semibold text-green-900">{stats.products.active}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-red-700">Inactive</h3>
                <p className="text-2xl font-semibold text-red-900">{stats.products.inactive}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-700">Low Stock</h3>
                <p className="text-2xl font-semibold text-yellow-900">{stats.products.lowStock}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-700">Featured</h3>
                <p className="text-2xl font-semibold text-purple-900">{stats.products.featured}</p>
              </div>
            </div>

            {/* Products by Category Table */}
            <div className="p-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Products by Category</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Active
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inactive
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.products.byCategory && stats.products.byCategory.length > 0 ? (
                      stats.products.byCategory.map((category, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category.activeCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category.inactiveCount}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No category data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Customers Statistics</h2>
            </div>

            {/* Customers Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.customers.total}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-700">New Customers</h3>
                <p className="text-2xl font-semibold text-green-900">{stats.customers.new}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-700">Returning Customers</h3>
                <p className="text-2xl font-semibold text-blue-900">{stats.customers.returning}</p>
              </div>
            </div>

            {/* Customers by Location Table */}
            <div className="p-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Customers by Location</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customers
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.customers.byLocation && stats.customers.byLocation.length > 0 ? (
                      stats.customers.byLocation.map((location, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {location.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {location.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {((location.count / stats.customers.total) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                          No location data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Statistics</h2>
            </div>

            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.revenue.total.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-700">
                  {timeRange === 'week' ? 'Last 7 Days' :
                   timeRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'} Revenue
                </h3>
                <p className="text-2xl font-semibold text-green-900">₹{stats.revenue.period.toLocaleString()}</p>
              </div>
            </div>

            {/* Revenue by Date Table */}
            <div className="p-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Revenue by Date</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Order Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.revenue.byDate.length > 0 ? (
                      stats.revenue.byDate.map((day, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(day.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {day.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{day.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{day.count > 0 ? (day.revenue / day.count).toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No data available for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue by Payment Method Table */}
            <div className="p-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Revenue by Payment Method</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.revenue.byPaymentMethod && stats.revenue.byPaymentMethod.length > 0 ? (
                      stats.revenue.byPaymentMethod.map((method, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {method.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {method.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{method.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {((method.revenue / stats.revenue.total) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No payment method data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
