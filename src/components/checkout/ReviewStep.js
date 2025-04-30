'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageWithFallback from '@/components/common/ImageWithFallback';

export default function ReviewStep({
  cartItems,
  shippingAddress,
  paymentMethod,
  itemsPrice,
  shippingPrice,
  taxPrice,
  totalPrice,
  onBack,
  onPlaceOrder,
  loading,
  formatPrice,
}) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [giftOptions, setGiftOptions] = useState({
    giftWrapping: false,
    giftMessage: '',
  });

  // Handle terms checkbox change
  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
    if (e.target.checked) {
      setTermsError('');
    }
  };

  // Handle gift options change
  const handleGiftOptionsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGiftOptions({
      ...giftOptions,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Check if any items are out of stock
  const hasOutOfStockItems = cartItems.some(item => item.stock <= 0);

  // Handle place order button click
  const handlePlaceOrder = () => {
    if (!termsAccepted) {
      setTermsError('You must accept the terms and conditions to place an order');
      return;
    }

    if (hasOutOfStockItems) {
      setTermsError('Your order contains out-of-stock items. Please remove them before proceeding.');
      return;
    }

    onPlaceOrder();
  };

  // Get payment method display name
  const getPaymentMethodName = () => {
    switch (paymentMethod.paymentMethod) {
      case 'UPI':
        return 'UPI Payment';
      case 'Card':
        return 'Credit/Debit Card';
      case 'Wallet':
        return 'Digital Wallet';
      case 'COD':
        return 'Cash on Delivery';
      default:
        return paymentMethod.paymentMethod;
    }
  };

  // Get payment method details
  const getPaymentMethodDetails = () => {
    if (paymentMethod.paymentMethod === 'UPI' && paymentMethod.upiId) {
      return `UPI ID: ${paymentMethod.upiId}`;
    } else if (paymentMethod.paymentMethod === 'Card' && paymentMethod.cardDetails) {
      return `Card ending in ${paymentMethod.cardDetails.lastFour}`;
    } else {
      return '';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>

      {/* Out of stock warning banner */}
      {hasOutOfStockItems && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Out of Stock Items in Your Order</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Your order contains items that are currently out of stock. Please remove these items from your cart before placing your order.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Address */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Shipping Address</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="font-medium">{shippingAddress.name}</p>
          <p>{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
          <p>
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
          </p>
          <p>{shippingAddress.country}</p>
          <p className="mt-1">Phone: {shippingAddress.phone}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Payment Method</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="font-medium">{getPaymentMethodName()}</p>
          {getPaymentMethodDetails() && <p className="text-sm text-gray-600">{getPaymentMethodDetails()}</p>}
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Order Items</h3>
        <div className="bg-gray-50 rounded-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.product} className="p-4 flex items-center">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />

                  {/* Out of stock overlay */}
                  {item.stock <= 0 && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-30 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-xs px-1 py-0.5 rounded transform rotate-45">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">{item.name}</h4>
                    {item.stock <= 0 && (
                      <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  {item.hindiName && item.hindiName !== item.name && (
                    <p className="text-sm text-gray-600">{item.hindiName}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.price)} × {item.qty}
                  </p>

                  {/* Stock warning */}
                  {item.stock <= 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      This item is out of stock and cannot be fulfilled
                    </p>
                  )}
                </div>
                <div className="ml-4 font-medium">
                  {formatPrice(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Notes */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Order Notes (Optional)</h3>
        <textarea
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          rows="3"
          placeholder="Add any special instructions or notes for your order"
        ></textarea>
      </div>

      {/* Gift Options */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Gift Options</h3>
        <div className="space-y-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="giftWrapping"
              checked={giftOptions.giftWrapping}
              onChange={handleGiftOptionsChange}
              className="h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="ml-2">
              <span className="font-medium">Add Gift Wrapping</span>
              <p className="text-sm text-gray-600">We&apos;ll wrap your items in premium gift paper with a ribbon</p>
            </span>
          </label>

          {giftOptions.giftWrapping && (
            <div className="ml-6">
              <label htmlFor="giftMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Gift Message
              </label>
              <textarea
                id="giftMessage"
                name="giftMessage"
                value={giftOptions.giftMessage}
                onChange={handleGiftOptionsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows="2"
                placeholder="Add a personal message to include with your gift"
              ></textarea>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Order Summary</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(itemsPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? 'Free' : formatPrice(shippingPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5% GST)</span>
              <span>{formatPrice(taxPrice)}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={handleTermsChange}
            className={`h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded ${
              termsError ? 'border-red-500' : ''
            }`}
          />
          <span className="ml-2 text-sm">
            I have read and agree to the{' '}
            <a href="/terms" target="_blank" className="text-primary hover:underline">
              Terms and Conditions
            </a>
            ,{' '}
            <a href="/privacy-policy" target="_blank" className="text-primary hover:underline">
              Privacy Policy
            </a>
            , and{' '}
            <a href="/refund" target="_blank" className="text-primary hover:underline">
              Refund Policy
            </a>
          </span>
        </label>
        {termsError && <p className="mt-1 text-sm text-red-500">{termsError}</p>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          disabled={loading}
        >
          Back to Payment
        </button>

        {hasOutOfStockItems ? (
          <button
            type="button"
            onClick={() => setTermsError('Your order contains out-of-stock items. Please remove them before proceeding.')}
            className="bg-gray-300 text-gray-600 px-6 py-3 rounded-md cursor-not-allowed focus:outline-none flex items-center"
            disabled={true}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Cannot Place Order
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlaceOrder}
            className={`${paymentMethod.paymentMethod === 'RazorPay' ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600' : 'bg-primary hover:bg-primary-dark'} text-white px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : paymentMethod.paymentMethod === 'RazorPay' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay Now
              </>
            ) : (
              'Confirm Order'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
