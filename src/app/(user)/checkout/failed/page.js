'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderFailedPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error') || 'An error occurred while processing your order.';

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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Processing Failed</h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/checkout"
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
              >
                Try Again
              </Link>
              <Link
                href="/cart"
                className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                Return to Cart
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-medium mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              If you continue to experience issues with your order, please contact our customer support team:
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@prashasaksamiti.com</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
