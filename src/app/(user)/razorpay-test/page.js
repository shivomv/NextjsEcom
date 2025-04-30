'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function RazorpayTestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    setLoading(true);
    setError(null);
    
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      console.log('Razorpay already loaded');
      setScriptLoaded(true);
      setLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      setScriptLoaded(true);
      setLoading(false);
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setError('Failed to load payment gateway. Please try again later.');
      setLoading(false);
    };

    document.body.appendChild(script);
  };

  // Test direct Razorpay integration
  const testDirectRazorpay = () => {
    if (!scriptLoaded) {
      setError('Please load the Razorpay script first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const options = {
        key: 'rzp_test_mZovKJGWt2aMBd', // Enter the Key ID generated from the Dashboard
        amount: '50000', // Amount is in currency subunits. 50000 = 500 INR
        currency: 'INR',
        name: 'Prashasak Samiti Test',
        description: 'Test Transaction',
        image: '/images/logo.png',
        handler: function (response) {
          setResult({
            success: true,
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
          setLoading(false);
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
          method: 'upi'
        },
        notes: {
          address: 'Test Address'
        },
        theme: {
          color: '#6602C2'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      console.log('Opening Razorpay with options:', options);
      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      setError(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Razorpay Test Page</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Step 1: Load Razorpay Script</h2>
        <button
          onClick={loadRazorpayScript}
          disabled={loading || scriptLoaded}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="inline mr-2" />
              Loading...
            </>
          ) : scriptLoaded ? (
            'Script Loaded ✓'
          ) : (
            'Load Razorpay Script'
          )}
        </button>
        
        {scriptLoaded && (
          <p className="text-green-600 mt-2">
            Razorpay script loaded successfully!
          </p>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Step 2: Test Direct Razorpay Integration</h2>
        <p className="text-sm text-gray-600 mb-4">
          This will open the Razorpay checkout form with a test amount of ₹500.
        </p>
        <button
          onClick={testDirectRazorpay}
          disabled={loading || !scriptLoaded}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="inline mr-2" />
              Processing...
            </>
          ) : (
            'Test Razorpay Checkout'
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <h3 className="font-medium">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
          <h3 className="font-medium">Success:</h3>
          <pre className="mt-2 text-sm overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
        <h3 className="font-medium mb-2">Test Card Details:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Card Number: 4111 1111 1111 1111</li>
          <li>Expiry: Any future date</li>
          <li>CVV: Any 3 digits</li>
          <li>Name: Any name</li>
          <li>3D Secure Password: 1234</li>
        </ul>
        
        <h3 className="font-medium mt-4 mb-2">Test UPI:</h3>
        <ul className="list-disc list-inside text-sm">
          <li>UPI ID: success@razorpay</li>
        </ul>
      </div>
    </div>
  );
}
