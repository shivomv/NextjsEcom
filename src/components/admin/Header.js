'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminHeader() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'order',
      message: 'New order #ORD123456789 has been placed',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'stock',
      message: 'Brass Ganesh Idol is running low on stock',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'review',
      message: 'New 5-star review for Pure Cow Ghee',
      time: '3 hours ago',
      read: true,
    },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <Link href="/" className="text-primary hover:text-primary-dark mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 hidden md:block">Prashasak Samiti Admin</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    <button className="text-xs text-primary hover:underline">Mark all as read</button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                        >
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 p-1 rounded-full ${
                              notification.type === 'order' ? 'bg-blue-100 text-blue-600' :
                              notification.type === 'stock' ? 'bg-red-100 text-red-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {notification.type === 'order' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                              ) : notification.type === 'stock' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="ml-2 flex-shrink-0">
                                <span className="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-100 text-center">
                  <Link href="/admin/notifications" className="text-sm text-primary hover:underline">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-purple-pink flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {user?.name || 'Admin User'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
