'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ImageWithFallback from '@/components/common/ImageWithFallback';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/login?redirect=/account/orders');
    return null;
  }

  // Mock orders data
  const orders = [
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

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
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
    };

    const config = statusConfig[status] || statusConfig.processing;

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
              onClick={() => setActiveTab('processing')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'processing'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setActiveTab('shipped')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'shipped'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'delivered'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'cancelled'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'bg-white text-text hover:bg-gray-100'
              }`}
            >
              Cancelled
            </button>
            <button
              onClick={() => setActiveTab('returned')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'returned'
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
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-text-light">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 transition-colors text-sm font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="inline-flex items-center px-4 py-2 bg-gradient-purple-pink text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Write Review
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button className="inline-flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Order
                      </button>
                    )}
                    {order.status === 'delivered' && (
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
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
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
                            <Link href={`/products/${item.id}`}>
                              {item.name}
                            </Link>
                          </h4>
                          <p className="text-sm text-text-light">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{item.price * item.quantity}</p>
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
                    {order.status === 'cancelled' && (
                      <p className="text-sm text-text-light">
                        Cancellation Reason: <span className="font-medium text-text">{order.cancellationReason}</span>
                      </p>
                    )}
                    {order.status === 'cancelled' && order.refundStatus && (
                      <p className="text-sm text-text-light">
                        Refund Status: <span className="font-medium text-green-600">{order.refundStatus}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-light mb-1">Order Total:</p>
                    <p className="text-xl font-bold text-primary">₹{order.total}</p>
                  </div>
                </div>
              </div>
            ))}
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
