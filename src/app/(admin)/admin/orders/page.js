'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';

export default function OrdersManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Get filter from URL if present
    const filterParam = searchParams.get('status');
    if (filterParam) {
      setFilter(filterParam);
    }

    // Get page from URL if present
    const pageParam = searchParams.get('page');
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    }

    // Get date range from URL if present
    const startDateParam = searchParams.get('startDate');
    if (startDateParam) {
      setStartDate(startDateParam);
    }

    const endDateParam = searchParams.get('endDate');
    if (endDateParam) {
      setEndDate(endDateParam);
    }
  }, [searchParams]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', 10);

        if (filter !== 'all') {
          params.append('status', filter);
        }

        if (startDate && endDate) {
          params.append('startDate', startDate);
          params.append('endDate', endDate);
        }

        const response = await fetch(`/api/orders?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user, currentPage, filter, startDate, endDate]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    setCurrentPage(1);

    // Update URL with filter parameter
    const params = new URLSearchParams();
    if (newFilter !== 'all') params.append('status', newFilter);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    router.push(`/admin/orders?${params.toString()}`);
  };

  // Handle date filter
  const handleDateFilter = (e) => {
    e.preventDefault();

    // Update URL with date parameters
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('status', filter);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    router.push(`/admin/orders?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Update URL with page parameter
    const params = new URLSearchParams();
    params.append('page', page);
    if (filter !== 'all') params.append('status', filter);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    router.push(`/admin/orders?${params.toString()}`);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="w-full md:w-48">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status-filter"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <form onSubmit={handleDateFilter} className="flex flex-col md:flex-row gap-4 items-end">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Apply Date Filter
            </button>
          </form>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
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
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber || order._id.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.user?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{order.totalPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {[...Array(totalPages).keys()].map((page) => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page + 1
                          ? 'z-10 bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
