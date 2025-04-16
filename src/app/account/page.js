'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AccountPage() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=account');
    }
  }, [isAuthenticated, router]);
  
  // Set initial form values
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const updatedData = {
        name,
        email,
        phone,
      };
      
      await updateProfile(updatedData);
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!currentPassword) {
      setError('Current password is required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await updateProfile({
        password: newPassword,
        currentPassword,
      });
      
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account', active: true },
  ];
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-primary text-white">
                <h2 className="text-xl font-bold">My Account</h2>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeTab === 'profile'
                          ? 'bg-primary-light text-primary font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Profile Information
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeTab === 'password'
                          ? 'bg-primary-light text-primary font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Change Password
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/account/orders"
                      className="block px-3 py-2 rounded-md hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/addresses"
                      className="block px-3 py-2 rounded-md hover:bg-gray-100"
                    >
                      Addresses
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {activeTab === 'profile' && (
                <div>
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Profile Information</h2>
                  </div>
                  
                  <div className="p-6">
                    {success && (
                      <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-md">
                        {success}
                      </div>
                    )}
                    
                    {error && (
                      <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md">
                        {error}
                      </div>
                    )}
                    
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`bg-primary text-white px-6 py-2 rounded-md ${
                            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
                          } transition-colors`}
                        >
                          {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              
              {activeTab === 'password' && (
                <div>
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Change Password</h2>
                  </div>
                  
                  <div className="p-6">
                    {success && (
                      <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-md">
                        {success}
                      </div>
                    )}
                    
                    {error && (
                      <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md">
                        {error}
                      </div>
                    )}
                    
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Password must be at least 6 characters long
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`bg-primary text-white px-6 py-2 rounded-md ${
                            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
                          } transition-colors`}
                        >
                          {loading ? 'Updating...' : 'Change Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
