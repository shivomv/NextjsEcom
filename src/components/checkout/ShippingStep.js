'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ShippingStep({ shippingAddress = {}, onSubmit }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved addresses if user is authenticated
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      setSavedAddresses(user.addresses);
    }
  }, [user]);

  // Initialize form with existing shipping address if available
  useEffect(() => {
    if (shippingAddress && Object.keys(shippingAddress).length > 0) {
      setFormData(shippingAddress);
    } else if (user && user.name) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name,
        phone: user.phone || '',
      }));
    }
  }, [shippingAddress, user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle saved address selection
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setFormData({
      name: address.name || user.name || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'India',
      phone: address.phone || user.phone || '',
    });
    setErrors({});
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    // Validate postal code format (6 digits for India)
    if (formData.postalCode && !/^\d{6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Postal code must be 6 digits';
    }

    // Validate phone number format (10 digits for India)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Indian states list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Shipping Address</h2>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Saved Addresses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {savedAddresses.map((address, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                  selectedAddress === address ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-200 hover:border-primary'
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <p className="font-medium text-sm sm:text-base">{address.name || user.name}</p>
                <p className="text-xs sm:text-sm text-gray-600">{address.addressLine1}</p>
                {address.addressLine2 && <p className="text-xs sm:text-sm text-gray-600">{address.addressLine2}</p>}
                <p className="text-xs sm:text-sm text-gray-600">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">{address.country}</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Phone: {address.phone || user.phone}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 sm:mt-4">
            <button
              type="button"
              className="text-primary hover:text-primary-dark text-sm sm:text-base"
              onClick={() => {
                setSelectedAddress(null);
                setFormData({
                  name: user.name || '',
                  addressLine1: '',
                  addressLine2: '',
                  city: '',
                  state: '',
                  postalCode: '',
                  country: 'India',
                  phone: user.phone || '',
                });
              }}
            >
              + Add a new address
            </button>
          </div>
        </div>
      )}

      {/* Address Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Full Name */}
          <div className="w-full md:hidden">
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div className="w-full md:hidden">
            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="10-digit mobile number"
            />
            {errors.phone && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Desktop layout for Name and Phone */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            <div>
              <label htmlFor="name-desktop" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name-desktop"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone-desktop" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone-desktop"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10-digit mobile number"
              />
              {errors.phone && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* Address Line 1 */}
          <div className="w-full">
            <label htmlFor="addressLine1" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="House number, Street name"
            />
            {errors.addressLine1 && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.addressLine1}</p>}
          </div>

          {/* Address Line 2 */}
          <div className="w-full">
            <label htmlFor="addressLine2" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Apartment, Suite, Unit, Building, Floor, etc. (optional)"
            />
          </div>

          {/* City */}
          <div className="w-full md:hidden">
            <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.city && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.city}</p>}
          </div>

          {/* State */}
          <div className="w-full md:hidden">
            <label htmlFor="state" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.state}</p>}
          </div>

          {/* Desktop layout for City and State */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            <div>
              <label htmlFor="city-desktop" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city-desktop"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="state-desktop" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                id="state-desktop"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.state}</p>}
            </div>
          </div>

          {/* Postal Code */}
          <div className="w-full md:hidden">
            <label htmlFor="postalCode" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Postal Code *
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="6-digit PIN code"
            />
            {errors.postalCode && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.postalCode}</p>}
          </div>

          {/* Country */}
          <div className="w-full md:hidden">
            <label htmlFor="country" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
              readOnly
            />
            {errors.country && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.country}</p>}
          </div>

          {/* Desktop layout for Postal Code and Country */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            <div>
              <label htmlFor="postalCode-desktop" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                id="postalCode-desktop"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.postalCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="6-digit PIN code"
              />
              {errors.postalCode && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.postalCode}</p>}
            </div>

            <div>
              <label htmlFor="country-desktop" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                id="country-desktop"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                readOnly
              />
              {errors.country && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.country}</p>}
            </div>
          </div>
        </div>

        {/* Save Address Checkbox */}
        {user && (
          <div className="mt-5 sm:mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-700">Save this address for future orders</span>
            </label>
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-6 sm:mt-8">
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 sm:py-4 px-4 sm:px-6 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base font-medium shadow-sm"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
