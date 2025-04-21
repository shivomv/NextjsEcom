'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';

export default function OrderDetails({ params }) {
  const { id } = params;
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const [status, setStatus] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);

        const response = await fetch(`/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const data = await response.json();
        setOrder(data);
        setStatus(data.status);
        setIsPaid(data.isPaid || false);
        setCourier(data.courier || '');
        setTrackingNumber(data.trackingNumber || '');
        setNotes(data.notes || '');
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchOrder();
    }
  }, [isAuthenticated, user, id]);

  // Handle order update
  const handleUpdateOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      setAlert({
        show: true,
        type: 'error',
        message: 'You must be logged in to update an order'
      });
      return;
    }

    // Validate that non-COD orders must be paid before delivery
    if (status === 'Delivered' && !isPaid && order.paymentMethod !== 'COD') {
      setAlert({
        show: true,
        type: 'error',
        message: 'Order must be paid before it can be marked as delivered'
      });
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);

      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          status,
          isPaid,
          courier,
          trackingNumber,
          notes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order');
      }

      const data = await response.json();
      setOrder(data);

      // Show success message
      setAlert({
        show: true,
        type: 'success',
        message: 'Order updated successfully'
      });
    } catch (error) {
      console.error('Error updating order:', error);
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'An error occurred while updating the order'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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

  // Get courier name for display
  const getCourierName = (courier) => {
    switch (courier) {
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
      case 'other':
        return 'Other';
      default:
        return courier || 'Not specified';
    }
  };

  // Get tracking URL based on courier service
  const getTrackingUrl = (trackingNumber, courier) => {
    if (!trackingNumber) return '#';

    switch (courier) {
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
        return '#';
    }
  };

  // Get valid status options based on current status
  const getValidStatusOptions = (currentStatus) => {
    // Define valid transitions
    const validTransitions = {
      'Pending': ['Pending', 'Processing', 'Cancelled'],
      'Processing': ['Processing', 'Shipped', 'Cancelled'],
      'Shipped': ['Shipped', 'Delivered', 'Cancelled'],
      'Delivered': ['Delivered', 'Cancelled'], // Can only cancel after delivery in special cases
      'Cancelled': ['Cancelled'] // Cannot transition from cancelled
    };

    // Return valid options for the current status
    return validTransitions[currentStatus] || ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  };

  // Loading state
  if (loading || !isClient || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error && !order) {
    return (
      <>
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
        <button
          onClick={() => router.push('/admin/orders')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Back to Orders
        </button>
      </>
    );
  }

  return (
    <>
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Order #{order.orderNumber || order._id.substring(0, 8)}
          </h1>
          <p className="text-gray-600">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="mt-4 md:mt-0 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Orders
        </Link>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order details and items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h2>
            <div className="flex items-center">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                {order.status}
              </span>
              <div className="ml-4 text-sm text-gray-600">
                {order.isPaid ? (
                  <span className="text-green-600">Paid on {formatDate(order.paidAt)}</span>
                ) : (
                  <span className="text-red-600">Not Paid</span>
                )}
                {' • '}
                {order.isDelivered ? (
                  <span className="text-green-600">Delivered on {formatDate(order.deliveredAt)}</span>
                ) : (
                  <span className="text-red-600">Not Delivered</span>
                )}
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Status History</h3>
                <div className="space-y-2">
                  {order.statusHistory.map((entry, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 h-4 w-4 mt-1 rounded-full ${getStatusBadgeColor(entry.status)}`}></div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900">{entry.status}</p>
                        <p className="text-xs text-gray-500">{formatDate(entry.timestamp)}</p>
                        {entry.note && <p className="text-xs text-gray-600 mt-0.5">{entry.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.status === 'Shipped' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tracking Information</h3>
                {order.courier && (
                  <div className="mb-1 text-sm text-gray-600">
                    <span className="font-medium">Courier:</span> {getCourierName(order.courier)}
                  </div>
                )}
                {order.trackingNumber && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                    {order.courier && (
                      <a
                        href={getTrackingUrl(order.trackingNumber, order.courier)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-primary hover:text-primary-dark transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Track
                      </a>
                    )}
                  </div>
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
              {order.orderItems.map((item) => (
                <li key={item._id} className="px-6 py-4 flex items-center">
                  <div className="h-16 w-16 flex-shrink-0 relative">
                    {item.image ? (
                      <Image
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
                      {item.qty} x ₹{item.price.toFixed(2)} = ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Items Total:</span>
                <span>₹{order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="font-medium">Tax:</span>
                <span>₹{order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="font-medium">Shipping:</span>
                <span>₹{order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t border-gray-200">
                <span>Total:</span>
                <span>₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer info and order actions */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Customer</h3>
              <p className="text-sm text-gray-900">{order.user?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-900">{order.user?.email || 'No email'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Shipping Address</h3>
              <p className="text-sm text-gray-900">{order.shippingAddress.name}</p>
              <p className="text-sm text-gray-900">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-sm text-gray-900">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-sm text-gray-900">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-sm text-gray-900">{order.shippingAddress.country}</p>
              <p className="text-sm text-gray-900 mt-1">
                <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Order actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Update Order</h2>
            <form onSubmit={handleUpdateOrder}>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setStatus(newStatus);

                    // Clear tracking info if status is changed from Shipped to something else
                    if (status === 'Shipped' && newStatus !== 'Shipped') {
                      setCourier('');
                      setTrackingNumber('');
                    }

                    // If status is changed to Delivered, automatically mark as paid
                    // This ensures consistency between status and payment status
                    if (newStatus === 'Delivered') {
                      setIsPaid(true);
                    }
                  }}
                >
                  {getValidStatusOptions(order.status).map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Only showing valid status transitions from {order.status}
                </p>
                {status === 'Delivered' && (
                  <p className="mt-1 text-sm text-amber-600">
                    This order will be automatically marked as paid when delivered.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="payment-status-paid"
                      name="payment-status"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      checked={isPaid}
                      onChange={() => setIsPaid(true)}
                      disabled={order.paymentMethod === 'COD' && status === 'Delivered'}
                    />
                    <label htmlFor="payment-status-paid" className="ml-2 block text-sm text-gray-900">
                      Paid
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="payment-status-unpaid"
                      name="payment-status"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      checked={!isPaid}
                      onChange={() => setIsPaid(false)}
                      disabled={status === 'Delivered'}
                    />
                    <label htmlFor="payment-status-unpaid" className={`ml-2 block text-sm ${status === 'Delivered' ? 'text-gray-400' : 'text-gray-900'}`}>
                      Unpaid
                    </label>
                  </div>
                </div>
                {status === 'Delivered' && (
                  <p className="mt-1 text-sm text-gray-500">
                    All delivered orders are automatically marked as paid.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="courier" className="block text-sm font-medium text-gray-700 mb-1">
                  Courier Service
                </label>
                <select
                  id="courier"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  disabled={status !== 'Shipped'}
                >
                  <option value="">Select a courier service</option>
                  <option value="indiapost">India Post</option>
                  <option value="delhivery">Delhivery</option>
                  <option value="bluedart">BlueDart</option>
                  <option value="dtdc">DTDC</option>
                  <option value="fedex">FedEx</option>
                  <option value="dhl">DHL</option>
                  <option value="ekart">Ekart Logistics</option>
                  <option value="other">Other</option>
                </select>
                {status === 'Shipped' && !courier && (
                  <p className="mt-1 text-sm text-amber-600">Please select a courier service before adding tracking number</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="tracking"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  disabled={status !== 'Shipped' || !courier}
                />
                {status === 'Shipped' && courier && !trackingNumber && (
                  <p className="mt-1 text-sm text-amber-600">Please enter a tracking number</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this order"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Updating...
                  </div>
                ) : (
                  'Update Order'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
