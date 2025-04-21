'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function OrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [isClient, setIsClient] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);

    // Redirect to login if not authenticated after client-side rendering
    if (isClient && !authLoading && !isAuthenticated) {
      router.push('/login?redirect=/account/orders');
    }
  }, [isAuthenticated, authLoading, isClient, router]);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user || !isClient) return;

      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', 10);

        if (activeTab !== 'all') {
          params.append('status', activeTab);
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
        setOrders(data.orders || []);
        setTotalPages(data.pages || 1);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, isClient, activeTab, page]);

  // Show loading state while checking authentication
  if (authLoading || !isClient) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4 flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '₹0.00';
    }
    return `₹${Number(price).toFixed(2)}`;
  };

  // Filter orders based on active tab (already filtered from API, but keep this for client-side filtering)
  const filteredOrders = orders;

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      // Lower case status values (from mock data)
      delivered: {
        color: 'bg-green-100 text-green-800',
        text: 'Delivered',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      },
      processing: {
        color: 'bg-blue-100 text-blue-800',
        text: 'Processing',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      shipped: {
        color: 'bg-purple-100 text-purple-800',
        text: 'Shipped',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        ),
      },
      cancelled: {
        color: 'bg-red-100 text-red-800',
        text: 'Cancelled',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      },
      returned: {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Returned',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
          </svg>
        ),
      },

      // Database status values (capitalized)
      Pending: {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Pending',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      Processing: {
        color: 'bg-blue-100 text-blue-800',
        text: 'Processing',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      Shipped: {
        color: 'bg-purple-100 text-purple-800',
        text: 'Shipped',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        ),
      },
      Delivered: {
        color: 'bg-green-100 text-green-800',
        text: 'Delivered',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      },
      Cancelled: {
        color: 'bg-red-100 text-red-800',
        text: 'Cancelled',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      },
    };

    const config = statusConfig[status] || statusConfig.Processing;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">My Orders</h1>
          <p className="text-text-light">
            View and manage all your orders in one place
          </p>
        </div>

        {/* Order Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'Pending'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('Processing')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'Processing'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setActiveTab('Shipped')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'Shipped'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setActiveTab('Delivered')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'Delivered'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setActiveTab('Cancelled')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'Cancelled'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              Cancelled
            </button>
            <button
              onClick={() => setActiveTab('Returned')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'Returned'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              Returned
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Order #{order.orderNumber || order._id}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-text-light">
                      Placed on {formatDate(order.createdAt || order.date)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/account/orders/${order._id}`}
                      className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 transition-colors text-sm font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </Link>
                    {(order.status === 'delivered' || order.status === 'Delivered') && (
                      <button className="inline-flex items-center px-4 py-2 bg-gradient-purple-pink text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Write Review
                      </button>
                    )}
                    {(order.status === 'processing' || order.status === 'Processing' || order.status === 'Pending') && (
                      <button className="inline-flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Order
                      </button>
                    )}
                    {(order.status === 'delivered' || order.status === 'Delivered') && (
                      <button className="inline-flex items-center px-4 py-2 border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-50 transition-colors text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                        </svg>
                        Return
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-4">
                    {(order.orderItems || order.items).map((item) => (
                      <div key={item._id || item.id || item.product} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-primary hover:text-primary-dark transition-colors">
                            <Link href={`/products/${item.product || item.id}`}>
                              {item.name}
                            </Link>
                          </h4>
                          <p className="text-sm text-text-light">
                            Qty: {item.qty || item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{item.price * (item.qty || item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-text-light mb-1">
                      Payment Method: <span className="font-medium text-text">{order.paymentMethod}</span>
                    </p>
                    {order.trackingId && order.status !== 'cancelled' && (
                      <p className="text-sm text-text-light">
                        Tracking ID: <span className="font-medium text-text">{order.trackingId}</span>
                      </p>
                    )}
                    {order.deliveryDate && order.status !== 'cancelled' && (
                      <p className="text-sm text-text-light">
                        {order.status === 'delivered' ? 'Delivered on: ' : 'Delivery: '}
                        <span className="font-medium text-text">{order.deliveryDate}</span>
                      </p>
                    )}
                    {(order.status === 'cancelled' || order.status === 'Cancelled') && (
                      <p className="text-sm text-text-light">
                        Cancellation Reason: <span className="font-medium text-text">{order.cancellationReason}</span>
                      </p>
                    )}
                    {(order.status === 'cancelled' || order.status === 'Cancelled') && order.refundStatus && (
                      <p className="text-sm text-text-light">
                        Refund Status: <span className="font-medium text-green-600">{order.refundStatus}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-light mb-1">Order Total:</p>
                    <p className="text-xl font-bold text-primary">₹{order.totalPrice || order.total}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-primary hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-md ${page === i + 1 ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-md ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-primary hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-text-light">Loading your orders...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
            <p className="text-text-light mb-6">
              {activeTab === 'all'
                ? "You haven't placed any orders yet."
                : `You don't have any ${activeTab} orders.`}
            </p>
            <Link href="/products" className="bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
