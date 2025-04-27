'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function BlogPage() {
  const [loading, setLoading] = useState(true);

  // In a real implementation, we would fetch blog posts from an API
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // These would come from an API in a real implementation
  const categories = [
    'All Categories',
    'Festivals',
    'Spirituality',
    'Craftsmanship',
    'Ayurveda',
    'Rituals',
    'Science & Spirituality',
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10"></div>
        <div className="relative h-[40vh] min-h-[300px] max-h-[400px] w-full">
          <ImageWithFallback
            src="/images/blog-banner.jpg"
            alt="Prashasak Samiti Blog"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Our Blog
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow">
              Insights on spirituality, traditional practices, and cultural heritage
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  index === 0
                    ? 'bg-gradient-purple-pink text-white'
                    : 'bg-white text-text hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-primary/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-2xl font-bold text-primary mb-4">Blog Coming Soon</h2>
            <p className="text-text-light max-w-2xl mx-auto mb-8">
              We're working on creating valuable content about spirituality, traditional practices, and cultural heritage.
              Check back soon for articles, guides, and insights.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Explore Our Products
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-purple-pink text-white rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h2 className="text-2xl font-bold mb-2">Subscribe to Our Blog</h2>
              <p className="text-white/90">
                Get the latest articles, festival guides, and spiritual insights delivered directly to your inbox.
              </p>
            </div>
            <div className="md:w-1/2">
              <form className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none text-text text-base"
                />
                <button
                  type="submit"
                  className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md sm:rounded-l-none sm:rounded-r-md font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-white/80 text-sm mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
