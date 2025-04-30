'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error') || 'Your payment could not be processed';
  const orderId = searchParams.get('orderId');

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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>

            <div className="space-y-4 mb-6">
              <p className="text-sm text-gray-500">
                Your payment was not successful. This could be due to:
              </p>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>Insufficient funds in your account</li>
                <li>Bank declined the transaction</li>
                <li>Payment gateway timeout</li>
                <li>Network connectivity issues</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  if (orderId) {
                    window.location.href = `/account/orders/${orderId}`;
                  } else {
                    window.location.href = '/checkout';
                  }
                }}
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
              >
                Try Payment Again
              </button>

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
