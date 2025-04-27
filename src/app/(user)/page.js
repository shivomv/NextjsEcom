'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { useCategories } from '@/context/CategoryContext';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Home() {
  const { parentCategories, loading: categoriesLoading } = useCategories();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState(null);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?sort=rating&limit=4');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.products || []);
        } else {
          console.error('Failed to fetch products:', response.status);
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Use fetched products
  const displayProducts = featuredProducts;

  // Handle add to cart
  const handleAddToCart = (product) => {
    setAddingToCartId(product._id || product.id);
    addToCart(product, 1);

    // Reset button state after animation
    setTimeout(() => {
      setAddingToCartId(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10"></div>
        <div className="relative h-[60vh] min-h-[400px] max-h-[600px] w-full">
          <ImageWithFallback
            src="/images/hero-banner.jpg"
            alt="Spiritual Products"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Authentic Spiritual Products
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl drop-shadow-md">
              Discover our collection of traditional and authentic spiritual items crafted with devotion
            </p>
            <Link
              href="/products"
              className="bg-gradient-purple-pink hover:opacity-90 text-white px-8 py-3 rounded-full font-medium text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Shop by Category</h2>
          <div className="w-24 h-1 bg-gradient-purple-pink mx-auto rounded-full"></div>
        </div>

        {categoriesLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {parentCategories.map((category) => (
              <Link
                href={`/category/${category.slug}`}
                key={category._id || category.id}
                className="group relative overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="relative h-40 md:h-52 w-full">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <h3 className="absolute bottom-3 left-0 right-0 text-center text-white font-bold text-lg z-20">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="py-12 px-4 container mx-auto bg-pattern-dots rounded-lg">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Products</h2>
          <div className="w-24 h-1 bg-gradient-pink-orange mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div key={product._id || product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <Link href={`/products/${product.slug}`} className="block relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={product.image || (product.images && product.images[0])}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-110 duration-500"
                  />
                  {product.originalPrice > product.price && (
                    <div className="absolute top-2 left-2 bg-gradient-pink-orange text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md border border-white">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-lg font-bold mb-1 hover:text-gradient-purple-pink transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center mb-2">
                    <div className="flex text-gradient-pink-orange">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating || product.ratings || 0) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                      <span className="text-xs ml-1 text-text-light">({product.reviews || product.numReviews || 0})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-text-light line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCartId === (product._id || product.id)}
                      className="bg-gradient-purple-pink hover:opacity-90 text-white p-2 rounded-full shadow-md transition-all transform hover:scale-110"
                      aria-label="Add to Cart"
                      title="Add to Cart"
                    >
                      {addingToCartId === (product._id || product.id) ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Featured Products Available</h3>
            <p className="text-gray-500 mb-6">Our featured products will be available soon.</p>
            <Link
              href="/products"
              className="inline-flex items-center bg-gradient-purple-pink text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Browse All Products
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center bg-white hover:bg-gradient-purple-pink hover:text-white border-2 border-gradient-purple-pink text-gradient-purple-pink px-6 py-2 rounded-full font-medium transition-colors"
          >
            View All Products
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 px-4 container mx-auto">
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-800/90 z-10"></div>
          <div className="relative h-[300px] w-full">
            <ImageWithFallback
              src="/images/promo-banner.jpg"
              alt="Special Offers"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Special Navratri Collection
              </h2>
              <p className="text-lg text-white mb-6 max-w-2xl drop-shadow-md">
                Exclusive discounts on all puja items and decorations for the festive season
              </p>
              <Link
                href="/products?category=navratri-collection"
                className="bg-white-900 text-gradient-purple-pink px-8 py-3 rounded-full font-medium text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Shop the Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-4 container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">What Our Customers Say</h2>
          <div className="w-24 h-1 bg-gradient-purple-pink mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex text-gradient-pink-orange mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
            <p className="text-text mb-4">&quot;The quality of the puja items I received was exceptional. The brass work is intricate and the finish is perfect. Will definitely order again!&quot;</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-purple-pink flex items-center justify-center text-white font-bold">RS</div>
              <div className="ml-3">
                <h4 className="font-bold">Rahul Sharma</h4>
                <p className="text-sm text-text-light">Delhi</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex text-gradient-pink-orange mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
            <p className="text-text mb-4">&quot;Fast delivery and excellent packaging. The incense sticks have a beautiful fragrance that lasts long. Very satisfied with my purchase.&quot;</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-pink-orange flex items-center justify-center text-white font-bold">AP</div>
              <div className="ml-3">
                <h4 className="font-bold">Anjali Patel</h4>
                <p className="text-sm text-text-light">Mumbai</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex text-gradient-pink-orange mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
            <p className="text-text mb-4">&quot;The Lakshmi Ganesh idol is beautifully crafted with great attention to detail. The customer service was also very helpful when I had questions.&quot;</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-purple-pink flex items-center justify-center text-white font-bold">VK</div>
              <div className="ml-3">
                <h4 className="font-bold">Vijay Kumar</h4>
                <p className="text-sm text-text-light">Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
