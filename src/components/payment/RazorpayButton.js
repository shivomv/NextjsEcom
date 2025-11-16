'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { paymentAPI } from '@/services/api';

export default function RazorpayButton({ orderId, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const router = useRouter();

  // Load Razorpay script on component mount
  useEffect(() => {
    const loadRazorpayScript = () => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        console.log('Razorpay already loaded');
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        setScriptLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        setError('Failed to load payment gateway. Please try again later.');
      };

      document.body.appendChild(script);
    };

    loadRazorpayScript();

    // Cleanup function
    return () => {
      // We don't remove the script on unmount as it might be needed by other components
    };
  }, []);

  const handlePayment = async () => {
    try {
      if (!scriptLoaded) {
        setError('Payment gateway is still loading. Please try again in a moment.');
        return;
      }

      setLoading(true);
      setError(null);

      console.log('Creating Razorpay order for order ID:', orderId);

      // Step 1: Create order on your server using API service
      const data = await paymentAPI.createRazorpayOrder({ orderId });
      console.log('Order created successfully:', data.order.id);

      // Step 2: Initialize Razorpay checkout form (as per documentation)
      const options = {
        key: data.key,
        amount: data.amount.toString(),
        currency: data.currency,
        name: data.name,
        description: data.description,
        image: data.image,
        order_id: data.order.id,
        handler: async function(response) {
          try {
            console.log('Payment successful, verifying payment');

            // Step 3: Verify payment signature on your server using API service
            const verifyData = await paymentAPI.verifyRazorpayPayment({
              orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log('Payment verified successfully');

            // Call success callback
            if (onSuccess) {
              onSuccess(verifyData);
            }

            // Redirect to order details page
            router.push(`/account/orders/${orderId}?success=true`);
          } catch (error) {
            console.error('Payment verification error:', error);
            setError(error.message || 'Payment verification failed');
            setLoading(false);

            if (onError) {
              onError(error);
            }
          }
        },
        prefill: {
          name: data.prefill.name,
          email: data.prefill.email,
          contact: data.prefill.contact,
          method: "upi"
        },
        notes: data.notes,
        theme: data.theme,
        modal: {
          ondismiss: function() {
            console.log('Checkout form closed by user');
            setLoading(false);

            // If the user dismisses the payment modal, consider it a cancellation
            if (onError) {
              onError({
                message: 'Payment cancelled by user',
                code: 'PAYMENT_CANCELLED',
                source: 'user',
              });
            }
          },
        }
      };

      console.log('Initializing Razorpay with options:', {
        key: options.key,
        amount: options.amount,
        currency: options.currency,
        order_id: options.order_id,
        prefill: options.prefill,
        config: options.config
      });

      const paymentObject = new window.Razorpay(options);

      // Register event handlers for better debugging
      paymentObject.on('payment.failed', function(response) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);

        if (onError) {
          onError({
            message: response.error.description,
            code: response.error.code,
            source: 'razorpay',
            metadata: response.error
          });
        }
      });

      paymentObject.on('payment.error', function(error) {
        console.error('Payment error:', error);
        setError(`Payment error: ${error.description || error.message || 'Unknown error'}`);
        setLoading(false);

        if (onError) {
          onError({
            message: error.description || error.message || 'Unknown payment error',
            source: 'razorpay',
            metadata: error
          });
        }
      });

      // Log when payment modal is opened
      paymentObject.on('payment.opening', function() {
        console.log('Razorpay payment modal is opening');
      });

      // Log when payment is processing
      paymentObject.on('payment.processing', function() {
        console.log('Payment is processing');
      });

      // Open Razorpay checkout form
      console.log('Opening Razorpay payment modal');
      paymentObject.open();

    } catch (error) {
      console.error('Error during payment process:', error);
      setError(error.message || 'Payment initialization failed');
      setLoading(false);

      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        {!scriptLoaded && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-md">
            <div className="flex flex-col items-center">
              <LoadingSpinner size="md" className="mb-2" />
              <span className="text-sm text-gray-600">Loading payment gateway...</span>
            </div>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || !scriptLoaded}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-6 rounded-md font-medium hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-70 flex items-center justify-center text-lg shadow-md"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Processing Payment...
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

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <div className="px-2 py-1 bg-gray-100 rounded text-xs">Visa</div>
        <div className="px-2 py-1 bg-gray-100 rounded text-xs">Mastercard</div>
        <div className="px-2 py-1 bg-gray-100 rounded text-xs">RuPay</div>
        <div className="px-2 py-1 bg-gray-100 rounded text-xs">UPI</div>
        <div className="px-2 py-1 bg-gray-100 rounded text-xs">NetBanking</div>
      </div>

      {error && (
        <div className="mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-md">
          <div className="font-medium">Payment Error:</div>
          {error}
        </div>
      )}
    </div>
  );
}
