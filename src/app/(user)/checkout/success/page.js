'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch order details');
        }

        setOrder(data);

        // Clear cart after successful order
        clearCart();
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error.message || 'An error occurred while fetching your order');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user && orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, isAuthenticated, user, clearCart]);

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

  // Loading state
  if (loading) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
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
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/account/orders"
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
                >
                  View My Orders
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

  // No order ID
  if (!orderId) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
              <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/account/orders"
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
                >
                  View My Orders
                </Link>
                <Link
                  href="/"
                  className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
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
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-500 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
            <p className="text-gray-600">
              Your order has been placed successfully. We&apos;ll send you a confirmation email shortly.
            </p>
          </div>

          {order ? (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="p-4 flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Shipping Address */}
                <div>
                  <h3 className="font-medium mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h3 className="font-medium mb-3">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Payment Method</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.itemsPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(order.taxPrice)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                        <span>Total</span>
                        <span>{formatPrice(order.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="mb-8">
                <h3 className="font-medium mb-3">Order Status</h3>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-700">
                    Your order is currently <span className="font-medium">{order.orderStatus || 'Processing'}</span>.
                    {!order.isPaid && ' Payment is pending.'}
                    {order.isPaid && !order.isDelivered && ' Your payment has been received and your order is being processed.'}
                    {order.isDelivered && ' Your order has been delivered.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">
                Order details will be available soon. You can view all your orders in your account.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/account/orders"
              className="bg-primary text-white px-6 py-3 rounded-md text-center hover:bg-primary-dark transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/"
              className="border border-gray-300 px-6 py-3 rounded-md text-center hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
