'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNavBar() {
  const pathname = usePathname();

  // Check if the current path matches the nav item
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gradient-purple-pink z-40 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      {/* Gradient overlay at the top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-purple-pink"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-1 bg-primary rounded-full opacity-50"></div>
      </div>
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive('/') ? 'text-white bg-gradient-purple-pink' : 'text-text-muted'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/products"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive('/products') ? 'text-white bg-gradient-purple-pink' : 'text-text-muted'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-xs mt-1">Products</span>
        </Link>
{/* 
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive('/cart') ? 'text-white bg-gradient-purple-pink' : 'text-text-muted'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs mt-1">Cart</span>
        </Link> */}

        <Link
          href="/category"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive('/category') ? 'text-white bg-gradient-purple-pink' : 'text-text-muted'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs mt-1">Categories</span>
        </Link>

        <Link
          href="/account"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive('/account') ? 'text-white bg-gradient-purple-pink' : 'text-text-muted'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Account</span>
        </Link>
      </div>
    </div>
  );
}
