'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { fetchBlogPosts, fetchBlogCategories } from '@/services/bloggerApi';

export default function BlogPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['All Categories']);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeError, setSubscribeError] = useState(false);

  // Handle category selection
  const handleCategorySelect = async (category) => {
    try {
      setSelectedCategory(category);
      setLoading(true);
      setError(null);

      // Fetch posts by category
      const labels = category === 'All Categories' ? '' : category;
      const { posts, nextPageToken } = await fetchBlogPosts({
        maxResults: 9,
        labels
      });

      setPosts(posts);
      setNextPageToken(nextPageToken);
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle load more posts
  const handleLoadMore = async () => {
    if (loadingMore || !nextPageToken) return;

    try {
      setLoadingMore(true);

      // Fetch more posts
      const labels = selectedCategory === 'All Categories' ? '' : selectedCategory;
      const { posts: newPosts, nextPageToken: newNextPageToken } = await fetchBlogPosts({
        maxResults: 9,
        pageToken: nextPageToken,
        labels
      });

      // Append new posts to existing posts
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setNextPageToken(newNextPageToken);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || subscribing) return;

    try {
      setSubscribing(true);
      setSubscribeMessage('');
      setSubscribeError(false);

      // Here you would typically call an API to handle the subscription
      // For now, we'll just simulate a successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubscribeMessage('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setSubscribeMessage('Failed to subscribe. Please try again later.');
      setSubscribeError(true);
    } finally {
      setSubscribing(false);
    }
  };

  // Fetch blog posts and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch blog posts
        const { posts, nextPageToken } = await fetchBlogPosts({ maxResults: 9 });
        setPosts(posts);
        setNextPageToken(nextPageToken);

        // Fetch categories
        const fetchedCategories = await fetchBlogCategories();
        setCategories(['All Categories', ...fetchedCategories]);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  category === selectedCategory
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
        ) : error ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-red-500/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog</h2>
            <p className="text-text-light max-w-2xl mx-auto mb-8">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Try Again
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-primary/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-2xl font-bold text-primary mb-4">No Blog Posts Found</h2>
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
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {nextPageToken && (
              <div className="mt-10 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary bg-white rounded-full hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More Posts'
                  )}
                </button>
              </div>
            )}
          </>
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
              <form className="flex flex-col sm:flex-row gap-2 sm:gap-0" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none text-text text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md sm:rounded-l-none sm:rounded-r-md font-medium transition-colors"
                  disabled={subscribing}
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              <p className="text-white/80 text-sm mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
              {subscribeMessage && (
                <p className={`text-sm mt-2 ${subscribeError ? 'text-red-200' : 'text-green-200'}`}>
                  {subscribeMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
