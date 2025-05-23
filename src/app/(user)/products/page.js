'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import ProductFilter from '@/components/products/ProductFilter';
import Pagination from '@/components/common/Pagination';
import Breadcrumb from '@/components/common/Breadcrumb';
import MobileCategoryList from '@/components/common/MobileCategoryList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { categoryAPI, productAPI } from '@/services/api';
export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    count: 0,
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOption, setSortOption] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Get query parameters
  const categorySlug = searchParams.get('category') || '';
  const keyword = searchParams.get('keyword') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'newest';
  const featured = searchParams.get('featured') === 'true';

  useEffect(() => {
    // Set initial filter states from URL params
    setSelectedCategory(categorySlug);
    setSearchTerm(keyword);
    setSortOption(sort);
    setIsFeatured(featured);

    // Fetch categories with product counts
    const fetchCategories = async () => {
      try {
        // Use getCategoriesWithCounts to get categories with product counts
        const data = await categoryAPI.getCategoriesWithCounts();
        console.log('Categories with counts:', data);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [categorySlug, keyword, sort, featured]);

  useEffect(() => {
    // Fetch products based on filters
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          sort: sortOption,
        };

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        if (searchTerm) {
          params.keyword = searchTerm;
        }

        if (priceRange.min) {
          params.minPrice = priceRange.min;
        }

        if (priceRange.max) {
          params.maxPrice = priceRange.max;
        }

        if (isFeatured) {
          params.featured = true;
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
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategory, sortOption, searchTerm, priceRange, isFeatured]);

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const handleSortChange = (sort) => {
    setSortOption(sort);
  };

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products', active: true },
  ];

  // If a category is selected, add it to breadcrumb
  if (selectedCategory && categories.length > 0) {
    const category = categories.find(cat => cat.slug === selectedCategory);
    if (category) {
      breadcrumbItems.pop();
      breadcrumbItems.push(
        { label: 'Products', href: '/products' },
        { label: category.name, href: `/products?category=${category.slug}`, active: true }
      );
    }
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Mobile Category List - only visible on mobile */}
        <div className="md:hidden">
          {categories.length > 0 && (
            <MobileCategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              baseUrl="/products"
              searchQuery={searchTerm}
            />
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
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

          {/* Product Listing */}
          <div className="w-full md:w-3/4">
            <div className="hidden md:flex mb-6 flex-col sm:flex-row justify-between items-start sm:items-center">
              <h1 className="text-2xl font-bold mb-2 sm:mb-0">
                {selectedCategory && categories.length > 0
                  ? categories.find(cat => cat.slug === selectedCategory)?.name || 'All Products'
                  : searchTerm
                    ? `Search Results for "${searchTerm}"`
                    : isFeatured
                      ? 'Featured Products'
                      : 'All Products'
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

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-md">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
                <p>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <p className="text-text-light mb-4">Showing {products.length} of {pagination.count} products</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      baseUrl={`/products?${selectedCategory ? `category=${selectedCategory}&` : ''}${searchTerm ? `keyword=${searchTerm}&` : ''}${sortOption ? `sort=${sortOption}&` : ''}${isFeatured ? `featured=true&` : ''}`}
                    />
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


