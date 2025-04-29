'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-primary/10 hover:border-primary/30">
      <Link href={`/products/${product._id}`} className="block relative h-48 sm:h-56 overflow-hidden">
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
              <div className="bg-red-600 text-white px-4 py-2 rounded-md font-bold transform rotate-45 shadow-lg border-2 border-white">
                OUT OF STOCK
              </div>
            </div>
          )}
        </div>

        {/* Discount badge - only show if product is in stock */}
        {product.stock > 0 && product.comparePrice > 0 && product.comparePrice > product.price && (
          <div className="absolute top-2 left-2 bg-gradient-pink-orange text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md border border-white">
            {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
          </div>
        )}

        <button
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gradient-pink-orange hover:text-white transition-colors border border-primary/10"
          aria-label="Add to wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      <div className="p-4 sm:p-5">
        <Link href={`/products/${product._id}`} className="block">
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
          <h2 className="text-lg font-bold mb-1 hover:text-gradient-purple-pink transition-colors line-clamp-2 font-heading flex items-center">
            {product.name}
          </h2>
          <p className="text-text-muted mb-2 line-clamp-1 font-hindi">{product.hindiName}</p>
        </Link>

        {/* Rating display */}
        {product.ratings > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex text-gradient-pink-orange">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill={i < Math.floor(product.ratings) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-text-muted ml-1 font-medium">
              ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <span className="text-lg font-bold text-text">{formatPrice(product.price)}</span>
            {product.comparePrice > 0 && product.comparePrice > product.price && (
              <span className="text-sm text-text-muted line-through ml-2">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {product.stock <= 0 ? (
            <div className="bg-red-100 text-red-600 p-2.5 rounded-md flex items-center justify-center border-2 border-red-400 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-bold">OUT OF STOCK</span>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`${
                isAddingToCart
                  ? 'bg-gradient-pink-orange'
                  : 'bg-gradient-pink-orange hover:bg-secondary'
              } text-white p-2.5 rounded-md transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg border border-white/20 transform hover:-translate-y-0.5`}
              aria-label="Add to Cart"
              title="Add to Cart"
            >
              {isAddingToCart ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock > 0 && product.stock <= 5 && (
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
