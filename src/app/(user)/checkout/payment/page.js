'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import Link from 'next/link';

export default function PaymentPage() {
  const router = useRouter();
  // Search params are used in a commented section (kept for future use)
  const { user, isAuthenticated } = useAuth();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  // Order ID state (not used directly but kept for future use)
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    // Get temporary order data from session storage
    const tempOrderData = sessionStorage.getItem('tempOrderData');
    if (!tempOrderData) {
      router.push('/cart');
      return;
    }

    try {
      const parsedOrderData = JSON.parse(tempOrderData);
      setOrderData(parsedOrderData);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing order data:', error);
      setError('Invalid order data. Please try again.');
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '₹0.00';
    }
    return `₹${Number(price).toFixed(2)}`;
  };

  // Initialize Razorpay payment without creating an order first
  const initializePayment = async () => {
    try {
      setPaymentProcessing(true);
      setError('');

      if (!orderData) {
        throw new Error('No order data available');
      }

      // Create a temporary payment object to send to the Razorpay API
      const paymentData = {
        amount: orderData.totalPrice,
        currency: 'INR',
        receipt: `temp_receipt_${Date.now()}`,
        notes: {
          orderData: JSON.stringify({
            items: orderData.items.map(item => ({
              name: item.name,
              qty: item.qty,
              price: item.price,
              product: item.product,
            })),
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod,
            itemsPrice: orderData.itemsPrice,
            taxPrice: orderData.taxPrice,
            shippingPrice: orderData.shippingPrice,
            totalPrice: orderData.totalPrice,
          })
        }
      };

      // Call API to create Razorpay payment order (without creating an actual order in our database)
      const response = await fetch('/api/payment/razorpay/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to initialize payment');
      }

      // Store the payment data for the Razorpay button
      sessionStorage.setItem('razorpayPaymentData', JSON.stringify(data));

      // Set payment as ready
      setPaymentProcessing(false);

      return data;
    } catch (error) {
      console.error('Error initializing payment:', error);
      setError(error.message || 'Failed to initialize payment');
      setPaymentProcessing(false);
      return null;
    }
  };

  // Handle payment success - create order after successful payment
  const handlePaymentSuccess = async (paymentData) => {
    console.log('Payment successful:', paymentData);

    try {
      setPaymentProcessing(true);

      // Get the order data from session storage
      const tempOrderData = JSON.parse(sessionStorage.getItem('tempOrderData'));

      if (!tempOrderData) {
        throw new Error('Order data not found');
      }

      // Create order object with payment information
      const createOrderData = {
        orderItems: tempOrderData.items.map(item => ({
          name: item.name,
          hindiName: item.hindiName || item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress: tempOrderData.shippingAddress,
        paymentMethod: tempOrderData.paymentMethod,
        itemsPrice: tempOrderData.itemsPrice,
        taxPrice: tempOrderData.taxPrice,
        shippingPrice: tempOrderData.shippingPrice,
        totalPrice: tempOrderData.totalPrice,
        // Add payment result information
        paymentResult: {
          id: paymentData.razorpay_payment_id,
          status: 'completed',
          update_time: new Date().toISOString(),
          email_address: user.email || '',
        },
        // Mark as paid since payment is already completed
        isPaid: true,
        paidAt: new Date().toISOString(),
      };

      // Call API to create order
      const response = await fetch('/api/orders/create-after-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderData: createOrderData,
          paymentData: {
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_signature: paymentData.razorpay_signature,
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order after payment');
      }

      // Clear the temporary order data
      sessionStorage.removeItem('tempOrderData');
      sessionStorage.removeItem('razorpayPaymentData');

      // Clear the cart
      clearCart();

      // Redirect to success page with the new order ID
      router.push(`/checkout/success?id=${data._id}`);
    } catch (error) {
      console.error('Error creating order after payment:', error);
      setError('Payment was successful, but there was an error creating your order. Please contact customer support.');
      setPaymentProcessing(false);
    }
  };

  // Handle payment failure
  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);

    // Just redirect to payment failed page with error message
    router.push(`/checkout/payment-failed?error=${encodeURIComponent(error.message || 'Payment failed')}`);
  };

  // Handle cancel payment
  const handleCancelPayment = () => {
    // Clear the temporary order data
    sessionStorage.removeItem('tempOrderData');

    // Redirect to cart page
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cart"
                  className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Complete Your Payment</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Details</h2>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p className="font-medium">Online Payment (Razorpay)</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    You&apos;ll be redirected to Razorpay&apos;s secure payment gateway to complete your payment.
                  </p>
                </div>
              </div>

              {/* Payment Button */}
              <div className="mb-6">
                <div className="bg-white p-6 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Complete Your Payment</h3>

                  {/* Direct Razorpay Payment Component */}
                  <div className="w-full">
                    <button
                      onClick={async () => {
                        const paymentData = await initializePayment();
                        if (paymentData) {
                          // Create a direct Razorpay instance without creating an order first
                          if (window.Razorpay) {
                            const options = {
                              key: paymentData.key,
                              amount: paymentData.amount.toString(),
                              currency: paymentData.currency,
                              name: paymentData.name,
                              description: paymentData.description,
                              image: paymentData.image,
                              order_id: paymentData.order.id,
                              handler: function(response) {
                                // Handle successful payment
                                handlePaymentSuccess(response);
                              },
                              prefill: paymentData.prefill,
                              notes: paymentData.notes,
                              theme: paymentData.theme,
                              modal: {
                                ondismiss: function() {
                                  console.log('Checkout form closed by user');
                                  setPaymentProcessing(false);

                                  // Handle cancellation
                                  handlePaymentFailure({
                                    message: 'Payment cancelled by user',
                                    code: 'PAYMENT_CANCELLED',
                                    source: 'user',
                                  });
                                },
                              }
                            };

                            const razorpayInstance = new window.Razorpay(options);

                            razorpayInstance.on('payment.failed', function(response) {
                              console.error('Payment failed:', response.error);
                              handlePaymentFailure({
                                message: response.error.description,
                                code: response.error.code,
                                source: 'razorpay',
                              });
                            });

                            razorpayInstance.open();
                          } else {
                            setError('Payment gateway not loaded. Please refresh the page and try again.');
                          }
                        }
                      }}
                      disabled={paymentProcessing}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-6 rounded-md font-medium hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-70 flex items-center justify-center text-lg shadow-md"
                    >
                      {paymentProcessing ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Pay Now
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handleCancelPayment}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel and Return to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Security */}
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Secure Payment</h3>
                  <p className="text-xs text-gray-600">
                    Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.
                  </p>
                </div>
              </div>
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
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
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
                  <span>{formatPrice(orderData.itemsPrice)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between py-2">
                  <span>Shipping</span>
                  <span>{orderData.shippingPrice === 0 ? 'Free' : formatPrice(orderData.shippingPrice)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between py-2">
                  <span>Tax (5% GST)</span>
                  <span>{formatPrice(orderData.taxPrice)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
                  <span>Total</span>
                  <span>{formatPrice(orderData.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
