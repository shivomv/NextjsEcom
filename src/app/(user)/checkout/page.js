'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Breadcrumb from '@/components/common/Breadcrumb';
import ShippingStep from '@/components/checkout/ShippingStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import ReviewStep from '@/components/checkout/ReviewStep';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    saveShippingAddress,
    savePaymentMethod,
    loading: cartLoading,
    isInitialized
  } = useCart();

  const [activeStep, setActiveStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState('');

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isClient && !authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isClient, authLoading, isAuthenticated, router]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (isClient && isInitialized && cartItems.length === 0) {
      router.push('/cart');
    }
  }, [isClient, cartItems, isInitialized, router]);

  // Calculate totals
  const itemsPrice = cartItems.reduce((acc, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    const qty = typeof item.qty === 'number' ? item.qty : parseInt(item.qty) || 1;
    return acc + price * qty;
  }, 0);

  // Calculate shipping (free over ₹500)
  const shippingPrice = itemsPrice > 500 ? 0 : 50;

  // Calculate tax (5% GST)
  const taxPrice = itemsPrice * 0.05;

  // Calculate total
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '₹0.00';
    }
    return `₹${Number(price).toFixed(2)}`;
  };

  // Handle shipping form submission
  const handleShippingSubmit = (data) => {
    saveShippingAddress(data);
    setActiveStep(2);
    window.scrollTo(0, 0);
  };

  // Handle payment method selection
  const handlePaymentSubmit = (data) => {
    savePaymentMethod(data);
    setActiveStep(3);
    window.scrollTo(0, 0);
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    try {
      setOrderLoading(true);
      setError('');

      // Create order object
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          hindiName: item.hindiName || item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          // Extract just the product ID if it's an object
          product: typeof item.product === 'object' ? item.product._id : item.product,
        })),
        shippingAddress,
        // Extract the payment method string if it's an object
        paymentMethod: typeof paymentMethod === 'object' && paymentMethod.paymentMethod ?
          paymentMethod.paymentMethod : 'COD',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      console.log('Sending order data:', JSON.stringify(orderData));

      // Call API to create order
      console.log('Sending order to API with token:', user.token ? 'Token exists' : 'No token');

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      console.log('Order API response status:', response.status);

      const data = await response.json();
      console.log('Order API response data:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create order');
      }

      // Redirect to order success page
      router.push(`/checkout/success?id=${data._id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Provide more detailed error message
      if (error.message.includes('invalid response')) {
        setError('There was a problem connecting to the order service. Please try again in a few moments.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Could not connect to the server. Please check your internet connection and try again.');
      } else if (error.message.includes('Not authorized')) {
        setError('Your session has expired. Please log in again to continue.');
        // Redirect to login page after a short delay
        setTimeout(() => router.push('/login?redirect=/checkout'), 3000);
      } else {
        setError(error.message || 'An error occurred while placing your order');
      }

      // Log the error for debugging
      console.log('Order creation failed. Please check the server logs for more details.');
    } finally {
      setOrderLoading(false);
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout', href: '/checkout' },
  ];

  // Loading state
  if (authLoading || cartLoading || !isClient || !isInitialized) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />

        <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

        {/* Checkout Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>

            <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>

            <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>

            <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>

            <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Shipping Step */}
              {activeStep === 1 && (
                <ShippingStep
                  shippingAddress={shippingAddress}
                  onSubmit={handleShippingSubmit}
                />
              )}

              {/* Payment Step */}
              {activeStep === 2 && (
                <PaymentStep
                  paymentMethod={paymentMethod}
                  onSubmit={handlePaymentSubmit}
                  onBack={() => setActiveStep(1)}
                />
              )}

              {/* Review Step */}
              {activeStep === 3 && (
                <ReviewStep
                  cartItems={cartItems}
                  shippingAddress={shippingAddress}
                  paymentMethod={paymentMethod}
                  itemsPrice={itemsPrice}
                  shippingPrice={shippingPrice}
                  taxPrice={taxPrice}
                  totalPrice={totalPrice}
                  onBack={() => setActiveStep(2)}
                  onPlaceOrder={handlePlaceOrder}
                  loading={orderLoading}
                  formatPrice={formatPrice}
                />
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>

              <div className="p-4">
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.product} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span>{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <span>Subtotal</span>
                  <span>{formatPrice(itemsPrice)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between py-2">
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? 'Free' : formatPrice(shippingPrice)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between py-2">
                  <span>Tax (5% GST)</span>
                  <span>{formatPrice(taxPrice)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                {/* Free Shipping Notice */}
                {itemsPrice < 500 && (
                  <div className="mt-4 bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                    <p>Orders over ₹500 qualify for FREE shipping!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
