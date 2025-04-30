'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function CartPage() {
  const { cartItems, addToCart, removeFromCart, loading, isInitialized, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Refresh cart data only once when the component mounts and user is authenticated
  useEffect(() => {
    // Skip if not authenticated or not client-side yet
    if (!isAuthenticated || !isClient) {
      return;
    }

    // Use a ref to track if we've already refreshed the cart
    const hasRefreshed = sessionStorage.getItem('cartRefreshed');

    if (!hasRefreshed) {
      refreshCart();
      // Mark that we've refreshed the cart in this session
      sessionStorage.setItem('cartRefreshed', 'true');

      // Clear this flag after 5 minutes to allow occasional refreshes
      setTimeout(() => {
        sessionStorage.removeItem('cartRefreshed');
      }, 5 * 60 * 1000);
    }
  }, [isAuthenticated, isClient, refreshCart]);

  // Check if any items are out of stock
  const hasOutOfStockItems = cartItems.some(item => item.stock <= 0);

  // Calculate totals whenever cart items change
  useEffect(() => {
    // Safely calculate subtotal with validation
    const subtotal = cartItems.reduce((acc, item) => {
      // Ensure price and qty are valid numbers
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      const qty = typeof item.qty === 'number' ? item.qty : parseInt(item.qty) || 1;
      return acc + price * qty;
    }, 0);

    // Calculate shipping (free over ₹500)
    const shipping = subtotal > 500 ? 0 : 50;

    // Calculate tax (5% GST)
    const taxAmount = subtotal * 0.05;

    setCartTotal(subtotal);
    setShippingCost(shipping);
    setTax(taxAmount);
  }, [cartItems]);

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    // Handle undefined, null, or NaN values
    if (price === undefined || price === null || isNaN(price)) {
      return '₹0.00';
    }
    return `₹${Number(price).toFixed(2)}`;
  };

  // Handle quantity change
  const handleQuantityChange = async (item, qty) => {
    // Validate item and qty
    if (!item || !item.product) {
      console.error('Invalid item:', item);
      return;
    }

    // Ensure stock is a valid number (default to 0 if not available)
    const stock = typeof item.stock === 'number' ? item.stock : parseInt(item.stock) || 0;

    // Skip update if quantity hasn't changed
    if (qty === item.qty) {
      return;
    }

    // Skip update if item is out of stock
    if (stock <= 0) {
      console.error('Cannot update quantity for out-of-stock item:', item.name);
      return;
    }

    // Ensure qty is within valid range
    if (qty > 0 && qty <= stock) {
      try {
        // Get the product ID
        const productId = typeof item.product === 'object' ? item.product._id : item.product;

        await addToCart({
          ...item,
          _id: productId,
          // Ensure price is a number
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
          // Ensure stock is properly passed
          stock: stock,
        }, qty);

        // No need to call refreshCart here as addToCart already updates the cart
        // The server-side update is handled by the addToCart function
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart', active: true },
  ];

  // Only render cart contents on the client side to prevent hydration errors
  const renderCartContents = () => {
    // Show loading state while initializing
    if (!isClient || !isInitialized) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center items-center h-40">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      );
    }

    // Show empty cart or cart items
    return cartItems.length === 0 ? (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">Looks like you haven&apos;t added any products to your cart yet.</p>
        <Link
          href="/products"
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    ) : (
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Cart Items ({cartItems.length})</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={typeof item.product === 'object' ? item.product._id : item.product} className="p-4 flex flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0 relative">
                    {item.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className={`object-cover ${item.stock <= 0 ? 'opacity-50' : ''}`}
                        />

                        {/* Out of stock overlay */}
                        {item.stock <= 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-600 text-white px-2 py-1 text-xs rounded-md font-bold transform -rotate-12 shadow-lg">
                              OUT OF STOCK
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>

                        {/* Out of stock overlay for no image */}
                        {item.stock <= 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-600 text-white px-2 py-1 text-xs rounded-md font-bold transform -rotate-12 shadow-lg">
                              OUT OF STOCK
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="sm:ml-4 flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium">
                            <Link href={`/products/${typeof item.product === 'object' ? item.product._id : item.product}`} className="hover:text-primary">
                              {item.name}
                            </Link>
                          </h3>

                          {/* Out of stock badge */}
                          {item.stock <= 0 && (
                            <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                              OUT OF STOCK
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{item.hindiName}</p>

                        {/* Stock warning messages */}
                        {item.stock <= 0 ? (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            This item is currently out of stock
                          </p>
                        ) : item.stock < 5 ? (
                          <p className="text-amber-600 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Only {item.stock} left in stock
                          </p>
                        ) : null}
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <p className="font-bold">{formatPrice(item.price * item.qty)}</p>
                        <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      {/* Quantity Selector */}
                      <div className="flex items-center">
                        {item.stock <= 0 ? (
                          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-1 rounded-md text-sm">
                            Out of Stock
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleQuantityChange(item, item.qty - 1)}
                              className="bg-gray-200 px-3 py-1 rounded-l-md hover:bg-gray-300"
                              disabled={item.qty <= 1}
                            >
                              -
                            </button>
                            <span className="w-10 text-center border-t border-b border-gray-300 py-1">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, item.qty + 1)}
                              className="bg-gray-200 px-3 py-1 rounded-r-md hover:bg-gray-300"
                              disabled={item.qty >= item.stock}
                            >
                              +
                            </button>
                          </>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={async () => {
                          // Prevent multiple rapid clicks
                          if (loading) return;

                          const productId = typeof item.product === 'object' ? item.product._id : item.product;
                          await removeFromCart(productId);

                          // Refresh for authenticated users after removing an item, but limit frequency
                          if (isAuthenticated) {
                            const lastItemRemoval = sessionStorage.getItem('lastItemRemoval');
                            const now = Date.now();

                            if (!lastItemRemoval || (now - parseInt(lastItemRemoval)) > 2000) {
                              setTimeout(() => refreshCart(), 300); // Small delay to allow server to process
                              sessionStorage.setItem('lastItemRemoval', now.toString());
                            }
                          }
                        }}
                        className={`mt-2 sm:mt-0 flex items-center ${
                          item.stock <= 0
                            ? 'bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium'
                            : 'text-red-600 hover:text-red-800 text-sm'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link
              href="/products"
              className="text-primary hover:text-primary-dark flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Order Summary</h2>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span className="font-medium">{formatPrice(shippingCost)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax (GST 5%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">{formatPrice(cartTotal + shippingCost + tax)}</span>
              </div>

              {/* Checkout Button */}
              {hasOutOfStockItems ? (
                <div className="mt-6 space-y-3">
                  <div className="block w-full bg-red-100 border border-red-300 text-red-700 text-center px-4 py-3 rounded-md">
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Checkout blocked: Out-of-stock items in cart</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Prevent multiple rapid clicks
                      if (loading) return;

                      // Find all out-of-stock items
                      const outOfStockItems = cartItems.filter(item => item.stock <= 0);

                      if (outOfStockItems.length === 0) return;

                      // Remove each out-of-stock item
                      outOfStockItems.forEach(async (item) => {
                        const productId = typeof item.product === 'object' ? item.product._id : item.product;
                        await removeFromCart(productId);
                      });

                      // Refresh cart after a short delay, but only once
                      const lastRemoval = sessionStorage.getItem('lastOutOfStockRemoval');
                      const now = Date.now();

                      if (!lastRemoval || (now - parseInt(lastRemoval)) > 3000) {
                        setTimeout(() => refreshCart(), 500);
                        sessionStorage.setItem('lastOutOfStockRemoval', now.toString());
                      }
                    }}
                    className="block w-full bg-red-600 hover:bg-red-700 text-white text-center px-4 py-3 rounded-md transition-colors"
                  >
                    Remove All Out-of-Stock Items
                  </button>
                </div>
              ) : (
                <Link
                  href={isAuthenticated ? "/checkout" : "/login?redirect=checkout"}
                  className="block w-full bg-primary text-white text-center px-4 py-3 rounded-md hover:bg-primary-dark transition-colors mt-6"
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Link>
              )}

              {/* Free Shipping Notice */}
              {cartTotal < 500 && (
                <div className="mt-4 bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                  <p>Add {formatPrice(500 - cartTotal)} more to qualify for FREE shipping!</p>
                </div>
              )}

              {/* Payment Methods */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">We Accept:</p>
                <div className="flex space-x-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">UPI</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">PayTM</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">PhonePe</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">Cards</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
          <div className="flex items-center gap-4">
            {isClient && isAuthenticated && (
              <button
                onClick={() => {
                  // Prevent multiple rapid refreshes
                  const lastRefresh = sessionStorage.getItem('lastCartRefresh');
                  const now = Date.now();

                  if (!lastRefresh || (now - parseInt(lastRefresh)) > 3000) {
                    refreshCart();
                    sessionStorage.setItem('lastCartRefresh', now.toString());
                    // Reset the cartRefreshed flag to allow the next auto-refresh
                    sessionStorage.removeItem('cartRefreshed');
                  }
                }}
                className="flex items-center text-primary hover:text-primary-dark transition-colors"
                disabled={loading}
                title="Refresh cart data from server"
              >
                <svg className={`h-5 w-5 mr-1 ${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            )}
            {isClient && loading && (
              <div className="flex items-center text-primary">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Updating cart...</span>
              </div>
            )}
          </div>
        </div>

        {/* Out of stock warning */}
        {isClient && hasOutOfStockItems && cartItems.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold">Warning: Out of Stock Items</p>
                <p className="text-sm">
                  Your cart contains items that are currently out of stock. Please remove these items to proceed with checkout.
                </p>
              </div>
            </div>
          </div>
        )}

        {renderCartContents()}
      </div>
    </div>
  );
}
