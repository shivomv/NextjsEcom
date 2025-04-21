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
          const response = await fetch(`/api/products?category=${slug}`);
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }

      setLoading(false);
    };

    if (!categoriesLoading) {
      fetchCategoryData();
    }
  }, [slug, categoriesLoading, getCategoryBySlug]);

  // Fallback category data if needed
  const mockCategoryData = {
    idols: {
      name: 'Religious Idols',
      description: 'Authentic and traditionally crafted religious idols made with pure materials',
      image: '/images/categories/idols-banner.jpg',
      products: [
        {
          id: 1,
          name: 'Brass Ganesh Idol',
          price: 1299,
          image: '/images/products/ganesh-idol.jpg',
          rating: 4.8,
          reviews: 124,
          slug: 'brass-ganesh-idol',
        },
        {
          id: 2,
          name: 'Marble Lakshmi Statue',
          price: 2499,
          image: '/images/products/lakshmi-statue.jpg',
          rating: 4.9,
          reviews: 86,
          slug: 'marble-lakshmi-statue',
        },
        {
          id: 3,
          name: 'Panchaloka Shiva Idol',
          price: 3999,
          image: '/images/products/shiva-idol.jpg',
          rating: 4.7,
          reviews: 92,
          slug: 'panchaloka-shiva-idol',
        },
        {
          id: 4,
          name: 'Brass Krishna Idol',
          price: 1899,
          image: '/images/products/krishna-idol.jpg',
          rating: 4.6,
          reviews: 78,
          slug: 'brass-krishna-idol',
        },
        {
          id: 5,
          name: 'Silver Plated Durga Idol',
          price: 4299,
          image: '/images/products/durga-idol.jpg',
          rating: 4.9,
          reviews: 65,
          slug: 'silver-plated-durga-idol',
        },
        {
          id: 6,
          name: 'Wooden Hanuman Statue',
          price: 1599,
          image: '/images/products/hanuman-statue.jpg',
          rating: 4.5,
          reviews: 53,
          slug: 'wooden-hanuman-statue',
        },
      ],
    },
    'cow-products': {
      name: 'Cow Products',
      description: 'Pure and authentic cow products made from indigenous cow breeds',
      image: '/images/categories/cow-products-banner.jpg',
      products: [
        {
          id: 7,
          name: 'Pure Cow Ghee',
          price: 699,
          image: '/images/products/cow-ghee.jpg',
          rating: 4.9,
          reviews: 215,
          slug: 'pure-cow-ghee',
        },
        {
          id: 8,
          name: 'Cow Dung Cakes (Pack of 12)',
          price: 299,
          image: '/images/products/dung-cakes.jpg',
          rating: 4.7,
          reviews: 89,
          slug: 'cow-dung-cakes',
        },
        {
          id: 9,
          name: 'Panchagavya Set',
          price: 899,
          image: '/images/products/panchagavya.jpg',
          rating: 4.8,
          reviews: 76,
          slug: 'panchagavya-set',
        },
        {
          id: 10,
          name: 'Cow Urine Distillate',
          price: 399,
          image: '/images/products/cow-urine.jpg',
          rating: 4.6,
          reviews: 62,
          slug: 'cow-urine-distillate',
        },
        {
          id: 11,
          name: 'Cow Milk Soap',
          price: 199,
          image: '/images/products/cow-milk-soap.jpg',
          rating: 4.8,
          reviews: 124,
          slug: 'cow-milk-soap',
        },
        {
          id: 12,
          name: 'Cow Dung Incense Sticks',
          price: 149,
          image: '/images/products/dung-incense.jpg',
          rating: 4.5,
          reviews: 97,
          slug: 'cow-dung-incense',
        },
      ],
    },
    diwali: {
      name: 'Diwali Special',
      description: 'Traditional and eco-friendly products for the festival of lights',
      image: '/images/categories/diwali-banner.jpg',
      products: [
        {
          id: 13,
          name: 'Handmade Clay Diyas (Set of 12)',
          price: 349,
          image: '/images/products/clay-diyas.jpg',
          rating: 4.8,
          reviews: 186,
          slug: 'handmade-clay-diyas',
        },
        {
          id: 14,
          name: 'Brass Kuber Diya',
          price: 899,
          image: '/images/products/kuber-diya.jpg',
          rating: 4.9,
          reviews: 92,
          slug: 'brass-kuber-diya',
        },
        {
          id: 15,
          name: 'Rangoli Color Set',
          price: 299,
          image: '/images/products/rangoli-colors.jpg',
          rating: 4.7,
          reviews: 78,
          slug: 'rangoli-color-set',
        },
        {
          id: 16,
          name: 'Lakshmi-Ganesh Idol Set',
          price: 1999,
          image: '/images/products/lakshmi-ganesh-set.jpg',
          rating: 4.9,
          reviews: 124,
          slug: 'lakshmi-ganesh-set',
        },
        {
          id: 17,
          name: 'Decorative Door Hangings',
          price: 499,
          image: '/images/products/door-hangings.jpg',
          rating: 4.6,
          reviews: 67,
          slug: 'decorative-door-hangings',
        },
        {
          id: 18,
          name: 'Traditional Oil Lamp',
          price: 1299,
          image: '/images/products/oil-lamp.jpg',
          rating: 4.8,
          reviews: 85,
          slug: 'traditional-oil-lamp',
        },
      ],
    },
    gifts: {
      name: 'Spiritual Gifts',
      description: 'Meaningful spiritual gifts for all occasions',
      image: '/images/categories/gifts-banner.jpg',
      products: [
        {
          id: 19,
          name: 'Rudraksha Mala',
          price: 799,
          image: '/images/products/rudraksha-mala.jpg',
          rating: 4.8,
          reviews: 112,
          slug: 'rudraksha-mala',
        },
        {
          id: 20,
          name: 'Silver Om Pendant',
          price: 1299,
          image: '/images/products/om-pendant.jpg',
          rating: 4.9,
          reviews: 78,
          slug: 'silver-om-pendant',
        },
        {
          id: 21,
          name: 'Bhagavad Gita - Deluxe Edition',
          price: 899,
          image: '/images/products/bhagavad-gita.jpg',
          rating: 5.0,
          reviews: 156,
          slug: 'bhagavad-gita-deluxe',
        },
        {
          id: 22,
          name: 'Crystal Pyramid Set',
          price: 1499,
          image: '/images/products/crystal-pyramid.jpg',
          rating: 4.7,
          reviews: 64,
          slug: 'crystal-pyramid-set',
        },
        {
          id: 23,
          name: 'Meditation Cushion Set',
          price: 1299,
          image: '/images/products/meditation-cushion.jpg',
          rating: 4.6,
          reviews: 89,
          slug: 'meditation-cushion-set',
        },
        {
          id: 24,
          name: 'Brass Bell with Wooden Stand',
          price: 999,
          image: '/images/products/brass-bell.jpg',
          rating: 4.8,
          reviews: 72,
          slug: 'brass-bell-stand',
        },
      ],
    },
  };

  // Default category data if the slug doesn't match any category
  const defaultCategory = {
    name: 'Products',
    description: 'Explore our collection of spiritual and religious products',
    image: '/images/categories/default-banner.jpg',
    products: [],
  };

  // Use real category data or fallback to mock data
  const displayCategory = category || mockCategoryData[slug] || defaultCategory;
  const displayProducts = products.length > 0 ? products : (mockCategoryData[slug]?.products || []);

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
            <button
              onClick={() => setActiveFilter('all')}
              className={`p-2 rounded-full ${activeFilter === 'all' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors flex items-center justify-center shadow-sm`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* New Arrivals Button */}
            <button
              onClick={() => setActiveFilter('new')}
              className={`p-2 rounded-full ${activeFilter === 'new' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors flex items-center justify-center shadow-sm`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Best Sellers Button */}
            <button
              onClick={() => setActiveFilter('best-sellers')}
              className={`p-2 rounded-full ${activeFilter === 'best-sellers' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors flex items-center justify-center shadow-sm`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </button>

            {/* Featured Button */}
            <button
              onClick={() => setActiveFilter('featured')}
              className={`p-2 rounded-full ${activeFilter === 'featured' ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'} transition-colors flex items-center justify-center shadow-sm`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>

            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                className="p-2 rounded-full bg-white text-text hover:bg-gray-100 transition-colors flex items-center justify-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>

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
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/products/${product.slug}`} className="block relative h-64 w-full overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-110 duration-500"
                  />
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
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-text-light text-sm ml-1">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">₹{product.price}</span>
                    <button className="bg-gradient-purple-pink text-white p-2 rounded-full hover:opacity-90 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
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
