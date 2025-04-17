'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    lowStockProducts: [],
    salesData: []
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

        // In a real application, you would fetch this data from your API
        // For now, we'll use mock data

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStats({
          totalOrders: 156,
          totalRevenue: 245699,
          totalCustomers: 89,
          totalProducts: 124,
          recentOrders: [
            {
              id: 'ORD123456789',
              customer: 'John Doe',
              date: '2023-10-15',
              status: 'delivered',
              total: 2499,
            },
            {
              id: 'ORD987654321',
              customer: 'Jane Smith',
              date: '2023-10-14',
              status: 'processing',
              total: 1598,
            },
            {
              id: 'ORD456789123',
              customer: 'Amit Patel',
              date: '2023-10-13',
              status: 'shipped',
              total: 4299,
            },
            {
              id: 'ORD789123456',
              customer: 'Priya Sharma',
              date: '2023-10-12',
              status: 'processing',
              total: 899,
            },
            {
              id: 'ORD321654987',
              customer: 'Rahul Kumar',
              date: '2023-10-11',
              status: 'delivered',
              total: 1299,
            },
          ],
          lowStockProducts: [
            {
              id: 1,
              name: 'Brass Ganesh Idol',
              stock: 3,
              threshold: 5,
              image: '/images/products/ganesh-idol.jpg',
            },
            {
              id: 2,
              name: 'Pure Cow Ghee',
              stock: 2,
              threshold: 10,
              image: '/images/products/cow-ghee.jpg',
            },
            {
              id: 3,
              name: 'Rudraksha Mala',
              stock: 4,
              threshold: 5,
              image: '/images/products/rudraksha-mala.jpg',
            },
          ],
          salesData: [
            { date: '2023-10-09', revenue: 12500 },
            { date: '2023-10-10', revenue: 15800 },
            { date: '2023-10-11', revenue: 9600 },
            { date: '2023-10-12', revenue: 14200 },
            { date: '2023-10-13', revenue: 18900 },
            { date: '2023-10-14', revenue: 21500 },
            { date: '2023-10-15', revenue: 16700 },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, isAdmin, router]);

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
            <p className="ml-2 text-sm text-green-600 font-medium">+12.5%</p>
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
            <p className="ml-2 text-sm text-green-600 font-medium">+8.2%</p>
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
            <p className="ml-2 text-sm text-green-600 font-medium">+5.8%</p>
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
            <p className="ml-2 text-sm text-green-600 font-medium">+3.2%</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-primary text-white rounded-md">Weekly</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Monthly</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Yearly</button>
          </div>
        </div>
        <div className="h-64 relative">
          {/* This would be a chart in a real application */}
          <div className="absolute inset-0 flex items-end">
            {stats.salesData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary-light rounded-t-sm"
                  style={{
                    height: `${(day.revenue / 25000) * 100}%`,
                    maxHeight: '90%',
                    backgroundColor: 'rgba(102, 2, 194, 0.2)'
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-gray-500">
            <span>₹25k</span>
            <span>₹20k</span>
            <span>₹15k</span>
            <span>₹10k</span>
            <span>₹5k</span>
            <span>₹0</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Low Stock Products</h3>
              <Link href="/admin/products" className="text-primary text-sm font-medium hover:underline">
                View All Products
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                    <Image src={product.image} alt={product.name} width={48} height={48} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-red-600">
                      Only {product.stock} left in stock
                    </p>
                  </div>
                  <div>
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="inline-flex items-center px-3 py-1 border border-primary text-primary text-sm font-medium rounded-md hover:bg-primary/5"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
