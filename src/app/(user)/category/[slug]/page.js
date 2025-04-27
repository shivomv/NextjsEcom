'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { useCategories } from '@/context/CategoryContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// This is a dynamic page that will display products based on the category slug
export default function CategoryPage({ params }) {
  const { slug } = params;
  const { getCategoryBySlug, loading: categoriesLoading } = useCategories();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSortOption, setActiveSortOption] = useState('popularity');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.filter-dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Fetch category data and products
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);

      // Get category from context
      const categoryData = getCategoryBySlug(slug);

      if (categoryData) {
        setCategory(categoryData);

        // Fetch products for this category
        try {
          console.log(`Fetching products for category: ${slug} (ID: ${categoryData._id})`);
          // Use the category ID instead of slug for more reliable filtering
          const response = await fetch(`/api/products?category=${categoryData._id}`);
          if (response.ok) {
            const data = await response.json();
            console.log('Products API response:', data);
            // The API returns an object with a products array
            setProducts(data.products || []);
          } else {
            console.error('Failed to fetch products:', response.status);
            setProducts([]);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        }
      }

      setLoading(false);
    };

    if (!categoriesLoading) {
      fetchCategoryData();
    }
  }, [slug, categoriesLoading, getCategoryBySlug]);

  // No mock data - using real data from API

  // Default category data if the slug doesn't match any category
  const defaultCategory = {
    name: 'Products',
    description: 'Explore our collection of spiritual and religious products',
    image: '/images/categories/default-banner.jpg',
    products: [],
  };

  // Use real category data or fallback to default
  const displayCategory = category || defaultCategory;
  const displayProducts = products;

  // Show loading state
  if (loading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10"></div>
        <div className="relative h-[8vh] min-h-[100px] sm:min-h-[120px] md:min-h-[150px] max-h-[100px] sm:max-h-[120px] md:max-h-[150px] w-full">
          <ImageWithFallback
            src={displayCategory.image}
            alt={displayCategory.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg">
              {displayCategory.name}
            </h1>
            <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto drop-shadow">
              {displayCategory.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 py-6 sm:py-8 md:py-10">
        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Desktop View */}
          <div className="hidden md:flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full ${activeFilter === 'all' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors font-medium flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All Products
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`px-4 py-2 rounded-full ${activeFilter === 'new' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors font-medium flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              New Arrivals
            </button>
            <button
              onClick={() => setActiveFilter('best-sellers')}
              className={`px-4 py-2 rounded-full ${activeFilter === 'best-sellers' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors font-medium flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Best Sellers
            </button>
            <button
              onClick={() => setActiveFilter('featured')}
              className={`px-4 py-2 rounded-full ${activeFilter === 'featured' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors font-medium flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Featured
            </button>
          </div>

          {/* Mobile View - Icon Only Buttons with Sort Dropdown */}
          <div className="flex md:hidden justify-center w-full gap-2 mb-2 relative filter-dropdown-container">
            {/* All Products Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveFilter('all')}
                className={`p-2 rounded-full ${activeFilter === 'all' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors flex items-center justify-center shadow-sm`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className={`text-xs mt-1 ${activeFilter === 'all' ? 'text-primary font-medium' : 'text-text-light'}`}>All</span>
            </div>

            {/* New Arrivals Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveFilter('new')}
                className={`p-2 rounded-full ${activeFilter === 'new' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors flex items-center justify-center shadow-sm`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <span className={`text-xs mt-1 ${activeFilter === 'new' ? 'text-primary font-medium' : 'text-text-light'}`}>New</span>
            </div>

            {/* Best Sellers Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveFilter('best-sellers')}
                className={`p-2 rounded-full ${activeFilter === 'best-sellers' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors flex items-center justify-center shadow-sm`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </button>
              <span className={`text-xs mt-1 ${activeFilter === 'best-sellers' ? 'text-primary font-medium' : 'text-text-light'}`}>Best</span>
            </div>

            {/* Featured Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveFilter('featured')}
                className={`p-2 rounded-full ${activeFilter === 'featured' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors flex items-center justify-center shadow-sm`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
              <span className={`text-xs mt-1 ${activeFilter === 'featured' ? 'text-primary font-medium' : 'text-text-light'}`}>Featured</span>
            </div>

            {/* Sort Button */}
            <div className="flex flex-col items-center relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                className="p-2 rounded-full bg-white text-text hover:bg-gray-100 transition-colors flex items-center justify-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
              <span className="text-xs mt-1 text-text-light">Sort</span>

              {openDropdown === 'sort' && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                  <button
                    onClick={() => {
                      setActiveSortOption('popularity');
                      setOpenDropdown(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeSortOption === 'popularity' ? 'bg-primary-light text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Popularity
                  </button>
                  <button
                    onClick={() => {
                      setActiveSortOption('price-asc');
                      setOpenDropdown(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeSortOption === 'price-asc' ? 'bg-primary-light text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => {
                      setActiveSortOption('price-desc');
                      setOpenDropdown(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeSortOption === 'price-desc' ? 'bg-primary-light text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => {
                      setActiveSortOption('newest');
                      setOpenDropdown(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeSortOption === 'newest' ? 'bg-primary-light text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => {
                      setActiveSortOption('rating');
                      setOpenDropdown(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeSortOption === 'rating' ? 'bg-primary-light text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Rating
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Sort Dropdown */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-text-light">Sort by:</span>
            <select
              className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={activeSortOption}
              onChange={(e) => setActiveSortOption(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Rating</option>
            </select>
          </div>


        </div>

        {/* Products Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/products/${product.slug}`} className="block relative h-64 w-full overflow-hidden">
                  <ImageWithFallback
                    src={product.image || (product.images && product.images[0])}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-110 duration-500"
                  />
                  {product.mrp > product.price && (
                    <div className="absolute top-2 left-2 bg-gradient-pink-orange text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md border border-white">
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product.slug}`} className="block">
                    <h3 className="text-lg font-semibold mb-2 text-primary hover:text-primary-dark transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating || product.ratings || 0) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-text-light text-sm ml-1">
                      ({product.numReviews || 0} reviews)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-primary">₹{product.price}</span>
                      {product.mrp > product.price && (
                        <span className="text-sm text-text-light line-through ml-2">₹{product.mrp}</span>
                      )}
                    </div>
                    <button className="bg-gradient-purple-pink text-white p-2 rounded-full hover:opacity-90 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                  {product.countInStock <= 5 && product.countInStock > 0 && (
                    <div className="mt-2 text-xs text-red-600 font-medium">
                      Only {product.countInStock} left in stock
                    </div>
                  )}
                  {product.countInStock === 0 && (
                    <div className="mt-2 text-xs text-red-600 font-medium">
                      Out of stock
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No Products Found</h3>
            <p className="text-text-light mb-6">
              We couldn&apos;t find any products in this category. Please check back later or explore other categories.
            </p>
            <Link href="/products" className="bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
              Browse All Products
            </Link>
          </div>
        )}

        {/* Pagination */}
        {displayProducts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-text-light hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-purple-pink text-white">
                1
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-text-light hover:bg-gray-100 transition-colors">
                2
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-text-light hover:bg-gray-100 transition-colors">
                3
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-text-light hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
