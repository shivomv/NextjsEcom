'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ImageWithFallback from '@/components/common/ImageWithFallback';

export default function OrderDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);

    // Redirect to login if not authenticated after client-side rendering
    if (isClient && !authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/account/orders/${id}`);
    }
  }, [isAuthenticated, authLoading, isClient, router, id]);

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);

        // First try to fetch from API if we have a MongoDB ID
        if (id.length === 24 || id.startsWith('PS')) {
          try {
            const response = await fetch(`/api/orders/${id}`, {
              headers: {
                'Authorization': `Bearer ${user.token}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              setOrder(data);
              setIsLoading(false);
              return;
            }
          } catch (apiError) {
            console.error('Error fetching from API:', apiError);
            // Continue to mock data if API fails
          }
        }

        // If API fetch fails or ID is not a MongoDB ID, use mock data
        // This is for development/demo purposes
        const mockOrders = [
          {
            id: 'ORD123456789',
            date: '2023-10-15',
            status: 'delivered',
            total: 2499,
            items: [
              {
                id: 1,
                name: 'Brass Ganesh Idol',
                price: 1299,
                quantity: 1,
                image: '/images/products/ganesh-idol.jpg',
              },
              {
                id: 2,
                name: 'Pure Cow Ghee',
                price: 699,
                quantity: 1,
                image: '/images/products/cow-ghee.jpg',
              },
              {
                id: 3,
                name: 'Rudraksha Mala',
                price: 799,
                quantity: 1,
                image: '/images/products/rudraksha-mala.jpg',
              },
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Temple Street, Spiritual District',
              city: 'New Delhi',
              state: 'Delhi',
              pincode: '110001',
              country: 'India',
              phone: '9876543210',
            },
            paymentMethod: 'Credit Card',
            deliveryDate: '2023-10-20',
            trackingId: 'TRK987654321',
          },
          {
            id: 'ORD987654321',
            date: '2023-09-28',
            status: 'processing',
            total: 1598,
            items: [
              {
                id: 4,
                name: 'Handmade Clay Diyas (Set of 12)',
                price: 349,
                quantity: 1,
                image: '/images/products/clay-diyas.jpg',
              },
              {
                id: 5,
                name: 'Brass Kuber Diya',
                price: 899,
                quantity: 1,
                image: '/images/products/kuber-diya.jpg',
              },
              {
                id: 6,
                name: 'Rangoli Color Set',
                price: 299,
                quantity: 1,
                image: '/images/products/rangoli-colors.jpg',
              },
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Temple Street, Spiritual District',
              city: 'New Delhi',
              state: 'Delhi',
              pincode: '110001',
              country: 'India',
              phone: '9876543210',
            },
            paymentMethod: 'UPI',
            deliveryDate: 'Expected by Oct 30, 2023',
            trackingId: 'TRK123456789',
          },
          {
            id: 'ORD456789123',
            date: '2023-08-15',
            status: 'cancelled',
            total: 4299,
            items: [
              {
                id: 7,
                name: 'Silver Plated Durga Idol',
                price: 4299,
                quantity: 1,
                image: '/images/products/durga-idol.jpg',
              },
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Temple Street, Spiritual District',
              city: 'New Delhi',
              state: 'Delhi',
              pincode: '110001',
              country: 'India',
              phone: '9876543210',
            },
            paymentMethod: 'Net Banking',
            cancellationReason: 'Changed my mind',
            refundStatus: 'Refunded',
          },
        ];

        const mockOrder = mockOrders.find(order => order.id === id);

        if (mockOrder) {
          setOrder(mockOrder);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user && isClient) {
      fetchOrder();
    }
  }, [isAuthenticated, user, id, isClient]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '₹0.00';
    }
    return `₹${Number(price).toFixed(2)}`;
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get tracking URL based on courier service
  const getTrackingUrl = (trackingNumber, courier) => {
    if (!trackingNumber) return '#';

    switch (courier?.toLowerCase()) {
      case 'indiapost':
        return `https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?ConsignmentNo=${trackingNumber}`;
      case 'delhivery':
        return `https://www.delhivery.com/track/?tracking_id=${trackingNumber}`;
      case 'bluedart':
        return `https://www.bluedart.com/tracking?trackingId=${trackingNumber}`;
      case 'dtdc':
        return `https://www.dtdc.in/tracking/tracking_results.asp?TrkType=Tracking_Awb&TrackingID=${trackingNumber}`;
      case 'fedex':
        return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
      case 'dhl':
        return `https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`;
      case 'ekart':
        return `https://ekartlogistics.com/shipmenttrack/${trackingNumber}`;
      default:
        return `https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?ConsignmentNo=${trackingNumber}`;
    }
  };

  // Check if an order has reached a specific status
  const hasReachedStatus = (order, status) => {
    // If the order has statusTimeline, use it
    if (order.statusTimeline && order.statusTimeline[status]) {
      return order.statusTimeline[status].completed;
    }

    // Fallback to status history if available
    if (order.statusHistory && order.statusHistory.length > 0) {
      return order.statusHistory.some(entry => entry.status === status);
    }

    // For backward compatibility with existing orders
    const statusRank = {
      'Pending': 1,
      'Processing': 2,
      'Shipped': 3,
      'Delivered': 4
    };

    // If the order is cancelled, only return true for 'Cancelled'
    if (order.status === 'Cancelled') {
      return status === 'Cancelled';
    }

    // Otherwise, check if the current status is at or beyond the requested status
    return statusRank[order.status] >= statusRank[status];
  };

  // Get the timestamp when a status was reached
  const getStatusTimestamp = (order, status) => {
    // If the order has statusTimeline, use it
    if (order.statusTimeline && order.statusTimeline[status] && order.statusTimeline[status].completed) {
      return order.statusTimeline[status].timestamp;
    }

    // Fallback to status history if available
    if (order.statusHistory && order.statusHistory.length > 0) {
      const statusEntry = order.statusHistory.find(entry => entry.status === status);
      return statusEntry ? statusEntry.timestamp : null;
    }

    // For backward compatibility
    if (status === 'Pending') return order.createdAt;
    if (status === 'Delivered' && order.status === 'Delivered') return order.deliveredAt;
    return null;
  };

  // Get courier name for display
  const getCourierName = (courier) => {
    switch (courier?.toLowerCase()) {
      case 'indiapost':
        return 'India Post';
      case 'delhivery':
        return 'Delhivery';
      case 'bluedart':
        return 'BlueDart';
      case 'dtdc':
        return 'DTDC';
      case 'fedex':
        return 'FedEx';
      case 'dhl':
        return 'DHL';
      case 'ekart':
        return 'Ekart Logistics';
      default:
        return 'India Post';
    }
  };

  // Show loading state while checking authentication or loading order
  if (authLoading || !isClient || isLoading) {
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

  // Error state
  if (error) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/account/orders"
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Back to Orders
                </Link>
                <Link
                  href="/"
                  className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No order
  if (!order) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
              <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/account/orders"
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Back to Orders
                </Link>
                <Link
                  href="/"
                  className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back button and order info */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Order #{order.orderNumber || order.id}
            </h1>
            <p className="text-text-light">
              Placed on {order.createdAt ? formatDate(order.createdAt) : formatDate(order.date)}
            </p>
          </div>
          <Link
            href="/account/orders"
            className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order details and items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h2>
              {/* Order Status Timeline */}
              <div className="mb-6">
                <div className="relative">
                  {/* Timeline Track */}
                  <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>

                  {/* Timeline Steps */}
                  <div className="space-y-8">
                    {/* Order Placed */}
                    <div className="relative flex items-start">
                      <div className={`absolute left-0 rounded-full h-10 w-10 flex items-center justify-center ${hasReachedStatus(order, 'Pending') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="ml-14">
                        <h3 className="text-base font-medium text-gray-900">Order Placed</h3>
                        <p className="mt-1 text-sm text-gray-600">{formatDate(order.createdAt || order.date)}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          Payment Method: <span className="font-medium">{order.paymentMethod}</span>
                        </p>
                        {order.isPaid && (
                          <p className="mt-1 text-sm text-green-600">
                            Paid on {formatDate(order.paidAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Processing */}
                    <div className="relative flex items-start">
                      <div className={`absolute left-0 rounded-full h-10 w-10 flex items-center justify-center ${hasReachedStatus(order, 'Processing') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-14">
                        <h3 className="text-base font-medium text-gray-900">Processing</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {hasReachedStatus(order, 'Processing')
                            ? getStatusTimestamp(order, 'Processing')
                              ? `Processed on ${formatDate(getStatusTimestamp(order, 'Processing'))}`
                              : 'Your order has been processed.'
                            : 'Waiting to be processed.'}
                        </p>
                      </div>
                    </div>

                    {/* Shipped */}
                    <div className="relative flex items-start">
                      <div className={`absolute left-0 rounded-full h-10 w-10 flex items-center justify-center ${hasReachedStatus(order, 'Shipped') ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                      </div>
                      <div className="ml-14">
                        <h3 className="text-base font-medium text-gray-900">Shipped</h3>
                        {hasReachedStatus(order, 'Shipped') ? (
                          <>
                            <p className="mt-1 text-sm text-gray-600">
                              Your order has been shipped and is on its way to you.
                              {getStatusTimestamp(order, 'Shipped') && (
                                <span className="block mt-1">
                                  Shipped on {formatDate(getStatusTimestamp(order, 'Shipped'))}
                                </span>
                              )}
                            </p>
                            {(order.trackingNumber || order.trackingId) && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm font-medium text-gray-700">Tracking Information</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Courier: <span className="font-medium">{getCourierName(order.courier || 'indiapost')}</span>
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Tracking Number: <span className="font-medium">{order.trackingNumber || order.trackingId}</span>
                                </p>
                                {order.deliveryDate && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Expected Delivery: <span className="font-medium">{order.deliveryDate}</span>
                                  </p>
                                )}
                                <div className="mt-2">
                                  <a
                                    href={getTrackingUrl(order.trackingNumber || order.trackingId, order.courier || 'indiapost')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm text-primary hover:text-primary-dark transition-colors"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Track Your Package
                                  </a>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="mt-1 text-sm text-gray-600">Your order has not been shipped yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Delivered */}
                    <div className="relative flex items-start">
                      <div className={`absolute left-0 rounded-full h-10 w-10 flex items-center justify-center ${hasReachedStatus(order, 'Delivered') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-14">
                        <h3 className="text-base font-medium text-gray-900">Delivered</h3>
                        {hasReachedStatus(order, 'Delivered') ? (
                          <>
                            <p className="mt-1 text-sm text-gray-600">Your order has been delivered.</p>
                            {order.deliveredAt && (
                              <p className="mt-1 text-sm text-green-600">
                                Delivered on {formatDate(order.deliveredAt)}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="mt-1 text-sm text-gray-600">Your order has not been delivered yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Received */}
                    {hasReachedStatus(order, 'Payment Received') && (
                      <div className="relative flex items-start">
                        <div className="absolute left-0 rounded-full h-10 w-10 flex items-center justify-center bg-green-100 text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-14">
                          <h3 className="text-base font-medium text-gray-900">Payment Received</h3>
                          <p className="mt-1 text-sm text-gray-600">Your payment has been received.</p>
                          {getStatusTimestamp(order, 'Payment Received') && (
                            <p className="mt-1 text-sm text-green-600">
                              Received on {formatDate(getStatusTimestamp(order, 'Payment Received'))}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cancelled (only show if order is cancelled) */}
                    {order.status === 'Cancelled' && (
                      <div className="relative flex items-start">
                        <div className="absolute left-0 rounded-full h-10 w-10 flex items-center justify-center bg-red-100 text-red-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <div className="ml-14">
                          <h3 className="text-base font-medium text-gray-900">Cancelled</h3>
                          <p className="mt-1 text-sm text-gray-600">Your order has been cancelled.</p>
                          {order.cancellationReason && (
                            <p className="mt-1 text-sm text-gray-600">
                              Reason: <span className="font-medium">{order.cancellationReason}</span>
                            </p>
                          )}
                          {order.refundStatus && (
                            <p className="mt-1 text-sm text-green-600">
                              Refund Status: <span className="font-medium">{order.refundStatus}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Status Badge */}
              <div className="flex items-center mt-4">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                  Current Status: {order.status}
                </span>
              </div>

              {order.status === 'cancelled' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Cancellation Details</h3>
                  {order.cancellationReason && (
                    <p className="text-sm text-gray-900">
                      Reason: <span className="font-medium">{order.cancellationReason}</span>
                    </p>
                  )}
                  {order.refundStatus && (
                    <p className="text-sm text-green-600 mt-1">
                      Refund Status: <span className="font-medium">{order.refundStatus}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Order items */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {(order.orderItems || order.items).map((item, index) => (
                  <li key={item._id || item.id || index} className="px-6 py-4 flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 relative">
                      {item.image ? (
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.qty || item.quantity} x {formatPrice(item.price)} = {formatPrice((item.qty || item.quantity) * item.price)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Items Total:</span>
                  <span>{formatPrice(order.itemsPrice || order.total)}</span>
                </div>
                {order.taxPrice && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-medium">Tax:</span>
                    <span>{formatPrice(order.taxPrice)}</span>
                  </div>
                )}
                {order.shippingPrice !== undefined && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-medium">Shipping:</span>
                    <span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t border-gray-200">
                  <span>Total:</span>
                  <span>{formatPrice(order.totalPrice || order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer info and order actions */}
          <div className="space-y-6">
            {/* Shipping info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h2>
              <div>
                <p className="text-sm text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-sm text-gray-900">{order.shippingAddress.address || order.shippingAddress.addressLine1}</p>
                {(order.shippingAddress.addressLine2) && (
                  <p className="text-sm text-gray-900">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode || order.shippingAddress.pincode}
                </p>
                <p className="text-sm text-gray-900">{order.shippingAddress.country}</p>
                <p className="text-sm text-gray-900 mt-2">
                  <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h2>
              <p className="text-sm text-gray-900">
                <span className="font-medium">Method:</span> {order.paymentMethod}
              </p>
              <p className="text-sm text-gray-900 mt-1">
                <span className="font-medium">Status:</span> {order.isPaid ? 'Paid' : 'Pending'}
              </p>
              {order.isPaid && order.paidAt && (
                <p className="text-sm text-gray-900 mt-1">
                  <span className="font-medium">Paid on:</span> {formatDate(order.paidAt)}
                </p>
              )}
            </div>

            {/* Order actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Actions</h2>
              <div className="space-y-3">
                {order.status === 'delivered' && (
                  <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Write a Review
                  </button>
                )}
                {order.status === 'pending' && (
                  <button className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Order
                  </button>
                )}
                <button className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
