'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import ProductFilter from '@/components/products/ProductFilter';
import Breadcrumb from '@/components/common/Breadcrumb';
import MobileCategoryList from '@/components/common/MobileCategoryList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { productAPI, categoryAPI } from '@/services/api';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'newest';
  const categorySlug = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    count: 0,
  });
  const [sortOption, setSortOption] = useState(sort);

  // Filter states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getCategoriesWithCounts();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on search query and filters
  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          sort: sortOption,
          keyword: query,
        };

        // Add filter parameters
        if (selectedCategory) {
          params.category = selectedCategory;
        }

        if (priceRange.min) {
          params.minPrice = priceRange.min;
        }

        if (priceRange.max) {
          params.maxPrice = priceRange.max;
        }

        const data = await productAPI.getProducts(params);
        setProducts(data.products);
        setPagination({
          page: data.page,
          pages: data.pages,
          count: data.count,
        });
      } catch (error) {
        setError(error.toString());
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, page, sortOption, selectedCategory, priceRange]);

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortOption(sort);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle price range change
  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
  };

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Search Results', href: `/search?q=${query}`, active: !selectedCategory },
  ];

  // If a category is selected, add it to breadcrumb
  if (selectedCategory && categories.length > 0) {
    const category = categories.find(cat => cat.slug === selectedCategory);
    if (category) {
      breadcrumbItems.push(
        { label: category.name, href: `/search?q=${query}&category=${category.slug}`, active: true }
      );
    }
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Search Query Display */}
      {query && (
        <div className="bg-gray-100 border-b border-gray-200 py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-700">Search Results for: "{query}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Category List - only visible on mobile */}
      <div className="md:hidden">
        {categories.length > 0 && (
          <MobileCategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            baseUrl="/search"
            searchQuery={query}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-3 md:py-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-1/4">
            <ProductFilter
              categories={categories}
              selectedCategory={selectedCategory}
              priceRange={priceRange}
              sortOption={sortOption}
              onCategoryChange={handleCategoryChange}
              onPriceRangeChange={handlePriceRangeChange}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {/* Mobile search info */}
            <div className="md:hidden mb-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">
                  {selectedCategory && categories.length > 0
                    ? `${categories.find(cat => cat.slug === selectedCategory)?.name || ''}`
                    : 'All Results'}
                </h2>
                {products.length > 0 && (
                  <span className="text-xs text-gray-600">
                    {products.length} of {pagination.count} items
                  </span>
                )}
              </div>
            </div>

            {/* Desktop header */}
            <div className="hidden md:flex mb-6 flex-col sm:flex-row justify-between items-start sm:items-center">
              <h1 className="text-2xl font-bold mb-2 sm:mb-0">
                {selectedCategory && categories.length > 0
                  ? `${categories.find(cat => cat.slug === selectedCategory)?.name || ''} Products`
                  : 'All Matching Products'
                }
              </h1>

              <div className="flex items-center">
                <span className="text-xs text-gray-600 whitespace-nowrap mr-2">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-gray-300 rounded-md pl-2 pr-6 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-white"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low-High</option>
                    <option value="price-desc">Price: High-Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="popularity">Popular</option>
                  </select>
                  <svg
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500 pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                <p className="font-medium">Error loading products</p>
                <p>{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {query ? 'No products found' : 'Enter a search term to find products'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {query
                    ? `We couldn't find any products matching "${query}". Try using different keywords or browse our categories.`
                    : 'Use the search bar above to find products by name, description, or category.'}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Browse All Products
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className="hidden md:block mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {products.length} of {pagination.count} products
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-4 md:mt-8 flex justify-center">
                    <div className="flex items-center space-x-1">
                      {/* Previous Page */}
                      {pagination.page > 1 && (
                        <Link
                          href={`/search?q=${query}&page=${pagination.page - 1}&sort=${sortOption}${selectedCategory ? `&category=${selectedCategory}` : ''}${priceRange.min ? `&minPrice=${priceRange.min}` : ''}${priceRange.max ? `&maxPrice=${priceRange.max}` : ''}`}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Previous
                        </Link>
                      )}

                      {/* Page Numbers */}
                      {[...Array(pagination.pages).keys()].map((x) => {
                        const pageNumber = x + 1;
                        // Show current page, first page, last page, and pages around current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === pagination.pages ||
                          (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                        ) {
                          return (
                            <Link
                              key={pageNumber}
                              href={`/search?q=${query}&page=${pageNumber}&sort=${sortOption}${selectedCategory ? `&category=${selectedCategory}` : ''}${priceRange.min ? `&minPrice=${priceRange.min}` : ''}${priceRange.max ? `&maxPrice=${priceRange.max}` : ''}`}
                              className={`px-4 py-2 border ${
                                pageNumber === pagination.page
                                  ? 'bg-gradient-purple-pink text-white border-primary'
                                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                              } rounded-md text-sm font-medium`}
                            >
                              {pageNumber}
                            </Link>
                          );
                        }

                        // Show ellipsis for gaps
                        if (
                          (pageNumber === 2 && pagination.page > 3) ||
                          (pageNumber === pagination.pages - 1 && pagination.page < pagination.pages - 2)
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white"
                            >
                              ...
                            </span>
                          );
                        }

                        return null;
                      })}

                      {/* Next Page */}
                      {pagination.page < pagination.pages && (
                        <Link
                          href={`/search?q=${query}&page=${pagination.page + 1}&sort=${sortOption}${selectedCategory ? `&category=${selectedCategory}` : ''}${priceRange.min ? `&minPrice=${priceRange.min}` : ''}${priceRange.max ? `&maxPrice=${priceRange.max}` : ''}`}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Next
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
