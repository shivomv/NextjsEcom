'use client';

import { useState } from 'react';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { FaExclamationCircle, FaCreditCard, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

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
    <div className="p-3 sm:p-4 md:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Review Your Order</h2>

      {/* Out of stock warning banner */}
      {hasOutOfStockItems && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Out of Stock Items in Your Order</h3>
              <div className="mt-1 text-xs sm:text-sm text-red-700">
                <p>Your order contains items that are currently out of stock. Please remove these items from your cart before placing your order.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Address */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Shipping Address</h3>
        <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
          <p className="font-medium text-sm sm:text-base">{shippingAddress.name}</p>
          <p className="text-xs sm:text-sm">{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && <p className="text-xs sm:text-sm">{shippingAddress.addressLine2}</p>}
          <p className="text-xs sm:text-sm">
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
          </p>
          <p className="text-xs sm:text-sm">{shippingAddress.country}</p>
          <p className="text-xs sm:text-sm mt-1">Phone: {shippingAddress.phone}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Payment Method</h3>
        <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
          <p className="font-medium text-sm sm:text-base">{getPaymentMethodName()}</p>
          {getPaymentMethodDetails() && <p className="text-xs sm:text-sm text-gray-600">{getPaymentMethodDetails()}</p>}
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Order Items</h3>
        <div className="bg-gray-50 rounded-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.product} className="p-3 sm:p-4 flex items-center">
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded overflow-hidden relative">
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
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <div className="flex items-center flex-wrap">
                    <h4 className="font-medium text-sm sm:text-base truncate mr-2">{item.name}</h4>
                    {item.stock <= 0 && (
                      <span className="mt-1 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  {item.hindiName && item.hindiName !== item.name && (
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{item.hindiName}</p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formatPrice(item.price)} × {item.qty}
                  </p>

                  {/* Stock warning */}
                  {item.stock <= 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      This item is out of stock and cannot be fulfilled
                    </p>
                  )}
                </div>
                <div className="ml-2 sm:ml-4 font-medium text-xs sm:text-sm whitespace-nowrap">
                  {formatPrice(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Notes */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Order Notes (Optional)</h3>
        <textarea
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          rows="2"
          placeholder="Add any special instructions or notes for your order"
        ></textarea>
      </div>

      {/* Gift Options */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Gift Options</h3>
        <div className="space-y-3 sm:space-y-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="giftWrapping"
              checked={giftOptions.giftWrapping}
              onChange={handleGiftOptionsChange}
              className="h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="ml-2">
              <span className="font-medium text-sm sm:text-base">Add Gift Wrapping</span>
              <p className="text-xs sm:text-sm text-gray-600">We&apos;ll wrap your items in premium gift paper with a ribbon</p>
            </span>
          </label>

          {giftOptions.giftWrapping && (
            <div className="ml-6">
              <label htmlFor="giftMessage" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Gift Message
              </label>
              <textarea
                id="giftMessage"
                name="giftMessage"
                value={giftOptions.giftMessage}
                onChange={handleGiftOptionsChange}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows="2"
                placeholder="Add a personal message to include with your gift"
              ></textarea>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Order Summary</h3>
        <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? 'Free' : formatPrice(shippingPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (5% GST)</span>
              <span>{formatPrice(taxPrice)}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm sm:text-base">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-4 sm:mb-6">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={handleTermsChange}
            className={`h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded ${
              termsError ? 'border-red-500' : ''
            }`}
          />
          <span className="ml-2 text-xs sm:text-sm">
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
        {termsError && <p className="mt-1 text-xs sm:text-sm text-red-500">{termsError}</p>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
        <button
          type="button"
          onClick={onBack}
          className="order-2 sm:order-1 w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base font-medium"
          disabled={loading}
        >
          Back to Payment
        </button>

        {hasOutOfStockItems ? (
          <button
            type="button"
            onClick={() => setTermsError('Your order contains out-of-stock items. Please remove them before proceeding.')}
            className="order-1 sm:order-2 w-full sm:w-auto bg-gray-300 text-gray-600 px-4 sm:px-6 py-3 sm:py-4 rounded-md cursor-not-allowed focus:outline-none flex items-center justify-center text-sm sm:text-base font-medium"
            disabled={true}
          >
            <FaExclamationTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Cannot Place Order
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlaceOrder}
            className={`order-1 sm:order-2 w-full sm:w-auto ${paymentMethod.paymentMethod === 'RazorPay' ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600' : 'bg-primary hover:bg-primary-dark'} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center text-sm sm:text-base font-medium shadow-sm`}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Processing...
              </>
            ) : paymentMethod.paymentMethod === 'RazorPay' ? (
              <>
                <FaCreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
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
