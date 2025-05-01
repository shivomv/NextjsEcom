'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import StarRating from '@/components/common/StarRating';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product, compact = false }) {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    if (e) e.preventDefault();

    // Prevent adding out-of-stock items (stock is undefined, null, 0, or negative)
    if (product.stock === undefined || product.stock === null || product.stock <= 0) {
      console.error('Cannot add out-of-stock product to cart:', product.name);

      // Show toast notification if available
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('This product is out of stock and cannot be added to your cart.');
      }

      return;
    }

    setIsAddingToCart(true);
    try {
      const success = await addToCart(product, 1);

      // Show success message if available
      if (success && typeof window !== 'undefined' && window.toast) {
        window.toast.success(`${product.name} added to cart`);
      }

      return success;
    } catch (error) {
      console.error('Error adding to cart:', error);

      // Show error message if available
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Failed to add product to cart');
      }

      return false;
    } finally {
      // Reset button state after a short delay
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    }
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-primary/10 hover:border-primary/30 ${compact ? 'h-full flex flex-col' : ''}`}>
      <Link
        href={`/products/${product._id}`}
        className={`block relative ${compact ? 'h-36 sm:h-40' : 'h-48 sm:h-56'} overflow-hidden`}
      >
        <div className="relative w-full h-full">
          <ImageWithFallback
            src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover ${product.stock <= 0 ? 'opacity-70' : ''}`}
            loading="eager"
            priority={true}
          />

          {/* Out of stock overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className={`bg-red-600 text-white ${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2'} rounded-md font-bold transform rotate-45 shadow-lg border-2 border-white`}>
                OUT OF STOCK
              </div>
            </div>
          )}
        </div>

        {/* Discount badge - only show if product is in stock */}
        {product.stock > 0 && product.mrp > 0 && product.mrp > product.price && (
          <div className={`absolute top-2 left-2 bg-gradient-pink-orange text-white ${compact ? 'text-[10px] px-2 py-1' : 'text-xs px-3 py-1.5'} rounded-full font-medium shadow-md border border-white`}>
            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
          </div>
        )}

        {!compact && (
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-400 hover:text-white transition-all duration-300 border border-primary/10"
            aria-label="Add to wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </Link>

      <div className={`${compact ? 'p-3 flex-1 flex flex-col' : 'p-4 sm:p-5'}`}>
        <Link href={`/products/${product._id}`} className="block flex-1">
          {!compact && (
            <h3 className="text-sm text-gradient-purple-pink font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-purple-pink mr-1.5"></span>
              {product.category?.name || 'Religious Product'}

              {/* Stock status badge next to category */}
              {product.stock <= 0 && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                  OUT OF STOCK
                </span>
              )}
            </h3>
          )}

          <h2 className={`${compact ? 'text-sm font-semibold mb-1 line-clamp-1' : 'text-lg font-bold mb-1 line-clamp-2'} hover:text-gradient-purple-pink transition-colors font-heading flex items-center`}>
            {product.name}
          </h2>

          {(!compact || (compact && product.hindiName)) && (
            <p className={`text-text-muted ${compact ? 'text-xs mb-1 line-clamp-1' : 'mb-2 line-clamp-1'} font-hindi`}>
              {product.hindiName}
            </p>
          )}
        </Link>

        {/* Rating display - only show in non-compact mode */}
        {!compact && product.ratings > 0 && product.numReviews > 0 && (
          <div className="mb-2 flex items-center">
            <StarRating
              rating={product.ratings}
              showCount={true}
              count={product.numReviews}
              size="sm"
              color="text-yellow-400"
            />
          </div>
        )}

        <div className={`${compact ? 'mt-auto' : ''} flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2`}>
          <div>
            <span className={`${compact ? 'text-sm' : 'text-lg'} font-bold text-text`}>{formatPrice(product.price)}</span>
            {product.mrp > 0 && product.mrp > product.price && (
              <span className={`${compact ? 'text-xs' : 'text-sm'} text-text-muted line-through ml-2`}>
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          {product.stock <= 0 ? (
            <></>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`${
                isAddingToCart
                  ? 'bg-gradient-pink-orange'
                  : 'bg-gradient-pink-orange hover:bg-secondary'
              } text-white ${compact ? 'p-1.5 sm:p-2' : 'p-2.5'} rounded-md transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg border border-white/20 transform hover:-translate-y-0.5`}
              aria-label="Add to Cart"
              title="Add to Cart"
            >
              {isAddingToCart ? (
                <div className={`${compact ? 'h-4 w-4' : 'h-6 w-6'} animate-spin rounded-full border-2 border-white border-t-transparent`}></div>
              ) : (
                <svg className={`${compact ? 'h-4 w-4' : 'h-6 w-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Stock indicator - only show in non-compact mode */}
        {!compact && product.stock > 0 && product.stock <= 5 && (
          <div className="mt-2 text-xs text-kumkum font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Only {product.stock} left in stock
          </div>
        )}
      </div>
    </div>
  );
}
