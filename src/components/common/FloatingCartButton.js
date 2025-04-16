'use client';

import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function FloatingCartButton() {
  const { cartItems } = useCart();

  // Don't show the button if cart is empty
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-gradient-purple-pink hover:opacity-90 text-white rounded-full p-4 shadow-lg z-40 transition-all duration-300 transform hover:scale-110 md:hidden border-2 border-white backdrop-blur-none"
      aria-label="View Cart"
    >
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="absolute -top-2 -right-2 bg-gradient-pink-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {cartItems.length}
        </span>
      </div>
    </Link>
  );
}
