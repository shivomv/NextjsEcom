'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Settings components
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import SocialMediaSettings from '@/components/admin/settings/SocialMediaSettings';
import DeliveryAgenciesSettings from '@/components/admin/settings/DeliveryAgenciesSettings';
import HeroSlidesSettings from '@/components/admin/settings/HeroSlidesSettings';
import PromoBannerSettings from '@/components/admin/settings/PromoBannerSettings';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

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

  // Delivery agencies state
  const [deliveryAgencies, setDeliveryAgencies] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch settings and other data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);

        // Fetch general settings
        const settingsResponse = await fetch('/api/admin/settings?format=object');
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          if (Object.keys(settingsData).length > 0) {
            setSettings(prevSettings => ({
              ...prevSettings,
              ...settingsData,
            }));
          }
        }

        // Fetch delivery agencies
        const deliveryAgenciesResponse = await fetch('/api/admin/delivery-agencies');
        if (deliveryAgenciesResponse.ok) {
          const deliveryAgenciesData = await deliveryAgenciesResponse.json();
          setDeliveryAgencies(deliveryAgenciesData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings. Please try again later.');
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchData();
    }
  }, [isAuthenticated, user]);

  // Handle general settings save
  const handleGeneralSettingsSave = async (data) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSettings({
          ...settings,
          [data.tab]: data.data,
        });
        setSuccess('General settings saved successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving general settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear success message after 3 seconds
      if (!error) {
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    }
  };

  // Handle social media settings save
  const handleSocialMediaSave = async (data) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSettings({
          ...settings,
          [data.tab]: data.data,
        });
        setSuccess('Social media settings saved successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save social media settings');
      }
    } catch (error) {
      console.error('Error saving social media settings:', error);
      setError('Failed to save social media settings. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear success message after 3 seconds
      if (!error) {
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    }
  };

  // Handle hero slides settings save
  const handleHeroSlidesSave = async (data) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Update the settings state with the new data
        setSettings({
          ...settings,
          [data.tab]: data.data,
        });
        setSuccess('Hero slides saved successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save hero slides');
      }
    } catch (error) {
      console.error('Error saving hero slides:', error);
      setError('Failed to save hero slides. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear success message after 3 seconds
      if (!error) {
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    }
  };

  // Handle promotional banner settings save
  const handlePromoBannerSave = async (data) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Update the settings state with the new data
        setSettings({
          ...settings,
          [data.tab]: data.data,
        });
        setSuccess('Promotional banner settings saved successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save promotional banner settings');
      }
    } catch (error) {
      console.error('Error saving promotional banner settings:', error);
      setError('Failed to save promotional banner settings. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear success message after 3 seconds
      if (!error) {
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    }
  };

  // Handle hero section settings save
  const handleHeroSectionSave = async (data) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      // Create an array of settings objects with the hero section data
      const heroSectionSettings = [
        { key: 'heroTitle', value: data.heroTitle, group: 'hero', isPublic: true },
        { key: 'heroSubtitle', value: data.heroSubtitle, group: 'hero', isPublic: true },
        { key: 'heroButtonText', value: data.heroButtonText, group: 'hero', isPublic: true },
        { key: 'heroButtonLink', value: data.heroButtonLink, group: 'hero', isPublic: true },
        { key: 'heroImage', value: data.heroImage, group: 'hero', isPublic: true },
        { key: 'heroImageData', value: data.heroImageData, group: 'hero', isPublic: true },
        { key: 'promoTitle', value: data.promoTitle, group: 'hero', isPublic: true },
        { key: 'promoSubtitle', value: data.promoSubtitle, group: 'hero', isPublic: true },
        { key: 'promoButtonText', value: data.promoButtonText, group: 'hero', isPublic: true },
        { key: 'promoButtonLink', value: data.promoButtonLink, group: 'hero', isPublic: true },
        { key: 'promoImage', value: data.promoImage, group: 'hero', isPublic: true },
        { key: 'promoImageData', value: data.promoImageData, group: 'hero', isPublic: true },
      ];

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroSectionSettings),
      });

      if (response.ok) {
        setSettings({
          ...settings,
          ...data,
        });
        setSuccess('Hero section settings saved successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save hero section settings');
      }
    } catch (error) {
      console.error('Error saving hero section settings:', error);
      setError('Failed to save hero section settings. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear success message after 3 seconds
      if (!error) {
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    }
  };



  // Handle delivery agency save
  const handleDeliveryAgencySave = async (data) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const { agency, id } = data.data;

      let response;
      if (id) {
        // Update existing delivery agency
        response = await fetch(`/api/admin/delivery-agencies/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(agency),
        });
      } else {
        // Create new delivery agency
        response = await fetch('/api/admin/delivery-agencies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(agency),
        });
      }

      if (response.ok) {
        const savedAgency = await response.json();
        if (id) {
          // Update existing delivery agency in state
          setDeliveryAgencies(deliveryAgencies.map(agency => agency._id === id ? savedAgency : agency));
        } else {
          // Add new delivery agency to state
          setDeliveryAgencies([...deliveryAgencies, savedAgency]);
        }
        setSuccess('Delivery agency saved successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save delivery agency');
      }
    } catch (error) {
      console.error('Error saving delivery agency:', error);
      setError('Failed to save delivery agency. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear success message after 3 seconds
      if (!error) {
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    }
  };

  // Handle delivery agency delete
  const handleDeliveryAgencyDelete = async (id) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/admin/delivery-agencies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove delivery agency from state
        setDeliveryAgencies(deliveryAgencies.filter(agency => agency._id !== id));
        setSuccess('Delivery agency deleted successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete delivery agency');
      }
    } catch (error) {
      console.error('Error deleting delivery agency:', error);
      setError('Failed to delete delivery agency. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear success message after 3 seconds
      if (!error) {
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    }
  };



  // Redirect if not admin
  useEffect(() => {
    if (isClient && !loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login?redirect=/admin/settings');
    }
  }, [isClient, loading, isAuthenticated, user, router]);

  if (loading || !isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'general'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'social'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Social Media
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'slides'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Hero Slides
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'promo'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Promotional Banner
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'delivery'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Delivery Agencies
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'general' && (
          <GeneralSettings
            settings={settings}
            onSave={handleGeneralSettingsSave}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'social' && (
          <SocialMediaSettings
            socialMedia={settings.socialMedia}
            onSave={handleSocialMediaSave}
            isSaving={isSaving}
          />
        )}



        {activeTab === 'slides' && (
          <HeroSlidesSettings
            settings={settings}
            onSave={handleHeroSlidesSave}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'promo' && (
          <PromoBannerSettings
            settings={settings}
            onSave={handlePromoBannerSave}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'delivery' && (
          <DeliveryAgenciesSettings
            deliveryAgencies={deliveryAgencies}
            onSave={handleDeliveryAgencySave}
            onDelete={handleDeliveryAgencyDelete}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}