'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ShippingStep from '@/components/checkout/ShippingStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import ReviewStep from '@/components/checkout/ReviewStep';
import Breadcrumb from '@/components/common/Breadcrumb';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { orderAPI, paymentAPI } from '@/services/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    loading: cartLoading,
    clearCart,
  } = useCart();

  const [activeStep, setActiveStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState({});
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if client-side and initialize from localStorage
  useEffect(() => {
    setIsClient(true);

    // Get shipping address from localStorage
    const savedShippingAddress = localStorage.getItem('shippingAddress');
    if (savedShippingAddress) {
      setShippingAddress(JSON.parse(savedShippingAddress));
    }

    // Get payment method from localStorage
    const savedPaymentMethod = localStorage.getItem('paymentMethod');
    if (savedPaymentMethod) {
      setPaymentMethod(JSON.parse(savedPaymentMethod));
    }

    setIsInitialized(true);
  }, []);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (isClient && !authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/checkout');
      } else if (cartItems.length === 0) {
        router.push('/cart');
      }
    }
  }, [isAuthenticated, authLoading, cartItems, router, isClient]);

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '₹0.00';
    }
    return `₹${Number(price).toFixed(2)}`;
  };

  // Save shipping address to localStorage
  const saveShippingAddress = (data) => {
    localStorage.setItem('shippingAddress', JSON.stringify(data));
    setShippingAddress(data);
  };

  // Save payment method to localStorage
  const savePaymentMethod = (data) => {
    localStorage.setItem('paymentMethod', JSON.stringify(data));
    setPaymentMethod(data);
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

      // Check if payment method is Razorpay
      const isRazorpayPayment = typeof paymentMethod === 'object' &&
        paymentMethod.paymentMethod === 'RazorPay';

      if (isRazorpayPayment) {
        // For Razorpay payments, initialize payment directly
        await handleRazorpayPayment();
      } else {
        // For COD orders, create the order immediately
        await handleCODOrder();
      }
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

  // Handle COD order creation
  const handleCODOrder = async () => {
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

    // Call API to create order using API service
    console.log('Sending order to API with token:', user.token ? 'Token exists' : 'No token');
    const data = await orderAPI.createOrder(orderData);
    console.log('Order API response data:', data);

    // For COD orders, redirect to success page
    console.log('Redirecting to success page for COD payment');
    router.push(`/checkout/success?id=${data._id}`);
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    // Create a temporary payment object to send to the Razorpay API
    const paymentData = {
      amount: totalPrice,
      currency: 'INR',
      receipt: `temp_receipt_${Date.now()}`,
      notes: {
        orderData: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            product: typeof item.product === 'object' ? item.product._id : item.product,
          })),
          shippingAddress,
          paymentMethod: 'RazorPay',
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        })
      }
    };

    // Store the order data in session storage (for after payment success)
    const tempOrderData = {
      items: cartItems.map(item => ({
        name: item.name,
        hindiName: item.hindiName || item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: typeof item.product === 'object' ? item.product._id : item.product,
      })),
      shippingAddress,
      paymentMethod: 'RazorPay',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };
    sessionStorage.setItem('tempOrderData', JSON.stringify(tempOrderData));

    // Call API to create Razorpay payment order using API service
    const data = await paymentAPI.createPayment(paymentData);

    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      await loadRazorpayScript();
    }

    // Open Razorpay checkout
    openRazorpayCheckout(data, tempOrderData);
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };

      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        setError('Failed to load payment gateway. Please try again later.');
        reject(new Error('Failed to load Razorpay script'));
      };

      document.body.appendChild(script);
    });
  };

  // Open Razorpay checkout
  const openRazorpayCheckout = (paymentData, orderData) => {
    const options = {
      key: paymentData.key,
      amount: paymentData.amount.toString(),
      currency: paymentData.currency,
      name: paymentData.name,
      description: paymentData.description,
      image: paymentData.image,
      order_id: paymentData.order.id,
      handler: async function(response) {
        try {
          console.log('Payment successful, handling response:', response);

          // Create order after successful payment
          const createOrderData = {
            orderItems: orderData.items.map(item => ({
              name: item.name,
              hindiName: item.hindiName || item.name,
              qty: item.qty,
              image: item.image,
              price: item.price,
              product: item.product,
            })),
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod,
            itemsPrice: orderData.itemsPrice,
            taxPrice: orderData.taxPrice,
            shippingPrice: orderData.shippingPrice,
            totalPrice: orderData.totalPrice,
            // Add payment result information
            paymentResult: {
              id: response.razorpay_payment_id,
              status: 'completed',
              update_time: new Date().toISOString(),
              email_address: user.email || '',
            },
            // Mark as paid since payment is already completed
            isPaid: true,
            paidAt: new Date().toISOString(),
          };

          console.log('Creating order with data:', JSON.stringify(createOrderData));

          // Call API to create order using API service
          const responseData = await orderAPI.createOrderAfterPayment({
            orderData: createOrderData,
            paymentData: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }
          });
          console.log('Order API response data:', responseData);

          // Clear the temporary order data
          sessionStorage.removeItem('tempOrderData');

          // Clear the cart
          clearCart();

          // Use window.location for redirection instead of router.push
          console.log('Redirecting to success page with order ID:', responseData._id);
          window.location.href = `/checkout/success?id=${responseData._id}`;
        } catch (error) {
          console.error('Error creating order after payment:', error);
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
          setError('Payment was successful, but there was an error creating your order. Please contact customer support.');
          setOrderLoading(false);
        }
      },
      prefill: {
        name: user.name || shippingAddress.name || '',
        email: user.email || '',
        contact: shippingAddress.phone || '',
      },
      notes: paymentData.notes,
      theme: paymentData.theme,
      modal: {
        ondismiss: function() {
          console.log('Checkout form closed by user');
          setOrderLoading(false);

          // Show a message to the user
          setError('Payment cancelled. You can try again or return to your cart.');

          // Optionally redirect to payment failed page after a short delay
          setTimeout(() => {
            window.location.href = '/checkout/payment-failed?error=Payment cancelled by user';
          }, 3000);
        }
      }
    };

    const razorpayInstance = new window.Razorpay(options);

    razorpayInstance.on('payment.failed', function(response) {
      console.error('Payment failed:', response.error);
      setError(`Payment failed: ${response.error.description}`);
      setOrderLoading(false);

      // Log the error details
      console.log('Payment failed with error:', {
        code: response.error.code,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason,
        metadata: response.error.metadata,
      });

      // Use window.location for redirection instead of router.push
      console.log('Redirecting to payment failed page');
      window.location.href = `/checkout/payment-failed?error=${encodeURIComponent(response.error.description)}`;
    });

    razorpayInstance.open();
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
    <div className="bg-background min-h-screen py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <Breadcrumb items={breadcrumbItems} />

        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">Checkout</h1>

        {/* Checkout Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto px-2">
            {/* Mobile Progress Indicator */}
            <div className="w-full md:hidden flex items-center justify-between">
              <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 ${activeStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className="text-xs sm:text-sm font-medium">Ship</span>
              </div>

              <div className={`flex-1 h-1 mx-1 ${activeStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>

              <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 ${activeStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <span className="text-xs sm:text-sm font-medium">Pay</span>
              </div>

              <div className={`flex-1 h-1 mx-1 ${activeStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>

              <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 ${activeStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
                <span className="text-xs sm:text-sm font-medium">Review</span>
              </div>
            </div>

            {/* Desktop Progress Indicator */}
            <div className="hidden md:flex items-center justify-between w-full">
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
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded-md mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
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
          <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden lg:sticky lg:top-24">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold">Order Summary</h2>
              </div>

              <div className="p-3 sm:p-4">
                {/* Items */}
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 max-h-40 sm:max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.product} className="flex justify-between text-xs sm:text-sm">
                      <span className="truncate pr-2 max-w-[70%]">
                        {item.name} × {item.qty}
                      </span>
                      <span className="flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between py-2 border-t border-gray-100 text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(itemsPrice)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between py-2 text-sm">
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? 'Free' : formatPrice(shippingPrice)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between py-2 text-sm">
                  <span>Tax (5% GST)</span>
                  <span>{formatPrice(taxPrice)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between py-2 border-t border-gray-200 font-bold text-sm sm:text-base">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                {/* Free Shipping Notice */}
                {itemsPrice < 500 && (
                  <div className="mt-3 sm:mt-4 bg-blue-50 text-blue-700 p-2 sm:p-3 rounded-md text-xs sm:text-sm">
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
