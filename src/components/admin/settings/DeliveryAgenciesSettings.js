'use client';

import { useState } from 'react';
import Image from 'next/image';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CloudinaryImagePicker from '@/components/common/CloudinaryImagePicker';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function DeliveryAgenciesSettings({ deliveryAgencies, onSave, onDelete, isLoading }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    logo: '',
    logoData: null,
    trackingUrl: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    isActive: true,
    serviceAreas: [],
    estimatedDeliveryDays: {
      min: 1,
      max: 7,
    },
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: parseInt(value) || 0,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    }
  };

  const handleServiceAreasChange = (e) => {
    const areas = e.target.value.split(',').map(area => area.trim());
    setFormData({
      ...formData,
      serviceAreas: areas,
    });
  };

  const handleImageSelect = (imageUrl, imageData) => {
    setFormData({
      ...formData,
      logo: imageUrl,
      logoData: imageData,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, editingId);
    resetForm();
  };

  const handleEdit = (agency) => {
    setFormData({
      name: agency.name || '',
      code: agency.code || '',
      logo: agency.logo || '',
      logoData: agency.logoData || null,
      trackingUrl: agency.trackingUrl || '',
      contactEmail: agency.contactEmail || '',
      contactPhone: agency.contactPhone || '',
      website: agency.website || '',
      isActive: agency.isActive,
      serviceAreas: agency.serviceAreas || [],
      estimatedDeliveryDays: {
        min: agency.estimatedDeliveryDays?.min || 1,
        max: agency.estimatedDeliveryDays?.max || 7,
      },
      notes: agency.notes || '',
    });
    setEditingId(agency._id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this delivery agency?')) {
      onDelete(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      logo: '',
      logoData: null,
      trackingUrl: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      isActive: true,
      serviceAreas: [],
      estimatedDeliveryDays: {
        min: 1,
        max: 7,
      },
      notes: '',
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Delivery Agencies</h2>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {showAddForm ? 'Cancel' : (
            <span className="flex items-center">
              <PlusIcon className="h-5 w-5 mr-1" />
              Add New Agency
            </span>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">
              {editingId ? 'Edit Delivery Agency' : 'Add New Delivery Agency'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Agency Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Agency Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Unique code for this agency (e.g., dhl, fedex, bluedart)
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency Logo (Optional)
              </label>
              <CloudinaryImagePicker
                onImageSelect={handleImageSelect}
                currentImage={formData.logo}
              />
              {formData.logo && (
                <div className="mt-2">
                  <Image
                    src={formData.logo}
                    alt={formData.name}
                    width={150}
                    height={50}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="trackingUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking URL
                </label>
                <input
                  type="text"
                  id="trackingUrl"
                  name="trackingUrl"
                  value={formData.trackingUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder="https://example.com/track/{trackingId}"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Use {'{trackingId}'} as a placeholder for the tracking number
                </p>
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone (Optional)
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="serviceAreas" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Areas (Optional)
                </label>
                <input
                  type="text"
                  id="serviceAreas"
                  value={formData.serviceAreas.join(', ')}
                  onChange={handleServiceAreasChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Delhi, Mumbai, Bangalore"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Comma-separated list of areas
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Delivery Days
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="estimatedDeliveryDays.min"
                    value={formData.estimatedDeliveryDays.min}
                    onChange={handleNumberChange}
                    min="1"
                    className="w-20 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="mx-2">to</span>
                  <input
                    type="number"
                    name="estimatedDeliveryDays.max"
                    value={formData.estimatedDeliveryDays.max}
                    onChange={handleNumberChange}
                    min={formData.estimatedDeliveryDays.min}
                    className="w-20 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="ml-2">days</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {editingId ? 'Update Agency' : 'Add Agency'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveryAgencies.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No delivery agencies found. Add your first agency.
                    </td>
                  </tr>
                ) : (
                  deliveryAgencies.map((agency) => (
                    <tr key={agency._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {agency.logo && (
                          <Image
                            src={agency.logo}
                            alt={agency.name}
                            width={80}
                            height={30}
                            className="rounded-md"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {agency.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agency.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${agency.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {agency.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agency.estimatedDeliveryDays?.min || 1} - {agency.estimatedDeliveryDays?.max || 7} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(agency)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(agency._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
