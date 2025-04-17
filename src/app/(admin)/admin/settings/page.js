'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    siteName: 'Prashasak Samiti',
    siteDescription: 'Your source for authentic spiritual products',
    contactEmail: 'contact@prashasaksamiti.com',
    contactPhone: '+91 1234567890',
    address: '123 Temple Street, Spiritual District, New Delhi, India',
    enablePaymentGateways: {
      razorpay: true,
      paypal: false,
      cod: true,
    },
    taxRate: 18,
    shippingFee: 100,
    freeShippingThreshold: 1000,
    enableNotifications: {
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      lowStock: true,
    },
    socialMedia: {
      facebook: 'https://facebook.com/prashasaksamiti',
      instagram: 'https://instagram.com/prashasaksamiti',
      twitter: '',
      youtube: 'https://youtube.com/prashasaksamiti',
    },
    maintenanceMode: false,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);

        // In a real application, you would fetch settings from your API
        // For now, we'll use the default settings defined above

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, you would set the settings from the API response
        // setSettings(data);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings. Please try again later.');
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchSettings();
    }
  }, [isAuthenticated, user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      // In a real application, you would save settings to your API
      // For now, we'll just simulate a successful save

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess('Settings saved successfully!');
      setIsSaving(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
      setIsSaving(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  // Handle nested input change
  const handleNestedInputChange = (category, name, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [name]: value,
      },
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  // Handle nested checkbox change
  const handleNestedCheckboxChange = (category, name, checked) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [name]: checked,
      },
    });
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
        <h1 className="text-2xl font-bold text-gray-800">Store Settings</h1>
        <p className="text-gray-600">Configure your store settings</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <LoadingSpinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">General Settings</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <input
                  type="text"
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                  Enable Maintenance Mode
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Payment Settings</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="taxRate"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  id="shippingFee"
                  name="shippingFee"
                  value={settings.shippingFee}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                  Free Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  id="freeShippingThreshold"
                  name="freeShippingThreshold"
                  value={settings.freeShippingThreshold}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Gateways
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="razorpay"
                      checked={settings.enablePaymentGateways.razorpay}
                      onChange={(e) => handleNestedCheckboxChange('enablePaymentGateways', 'razorpay', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="razorpay" className="ml-2 block text-sm text-gray-700">
                      Razorpay
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="paypal"
                      checked={settings.enablePaymentGateways.paypal}
                      onChange={(e) => handleNestedCheckboxChange('enablePaymentGateways', 'paypal', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="paypal" className="ml-2 block text-sm text-gray-700">
                      PayPal
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cod"
                      checked={settings.enablePaymentGateways.cod}
                      onChange={(e) => handleNestedCheckboxChange('enablePaymentGateways', 'cod', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="cod" className="ml-2 block text-sm text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Notification Settings</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-700">
                Enable email notifications for the following events:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderConfirmation"
                    checked={settings.enableNotifications.orderConfirmation}
                    onChange={(e) => handleNestedCheckboxChange('enableNotifications', 'orderConfirmation', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="orderConfirmation" className="ml-2 block text-sm text-gray-700">
                    Order Confirmation
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderShipped"
                    checked={settings.enableNotifications.orderShipped}
                    onChange={(e) => handleNestedCheckboxChange('enableNotifications', 'orderShipped', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="orderShipped" className="ml-2 block text-sm text-gray-700">
                    Order Shipped
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderDelivered"
                    checked={settings.enableNotifications.orderDelivered}
                    onChange={(e) => handleNestedCheckboxChange('enableNotifications', 'orderDelivered', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="orderDelivered" className="ml-2 block text-sm text-gray-700">
                    Order Delivered
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowStock"
                    checked={settings.enableNotifications.lowStock}
                    onChange={(e) => handleNestedCheckboxChange('enableNotifications', 'lowStock', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="lowStock" className="ml-2 block text-sm text-gray-700">
                    Low Stock Alerts
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Social Media</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  id="facebook"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'facebook', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  id="instagram"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'instagram', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter URL
                </label>
                <input
                  type="url"
                  id="twitter"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'twitter', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube URL
                </label>
                <input
                  type="url"
                  id="youtube"
                  value={settings.socialMedia.youtube}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'youtube', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-4"
              onClick={() => router.push('/admin')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
