'use client';

import { useState } from 'react';

export default function ProductFilter({
  categories,
  selectedCategory,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  sortOption,
  onSortChange,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState({
    min: priceRange.min || '',
    max: priceRange.max || '',
  });

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    onPriceRangeChange(localPriceRange.min, localPriceRange.max);
  };

  const handleCategoryClick = (slug) => {
    onCategoryChange(slug === selectedCategory ? '' : slug);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    if (isSortOpen) setIsSortOpen(false);
  };

  const toggleSort = () => {
    setIsSortOpen(!isSortOpen);
    if (isFilterOpen) setIsFilterOpen(false);
  };

  // Group categories by parent/child relationship
  const parentCategories = categories.filter(cat => !cat.parent);

  // Get subcategories for each parent category
  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parent === parentId);
  };

  return (
    <>
      <div className="md:hidden">
        <div className="flex gap-2 items-center m-1">
          <button
            onClick={toggleFilter}
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50 text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter
          </button>
          <button
            onClick={toggleSort}
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50 text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
            Sort By
          </button>
        </div>

        {/* Sort dropdown for mobile */}
        <div className={`${isSortOpen ? 'block' : 'hidden'} bg-white p-3  shadow-md rounded-md border border-gray-200 w-full`}>
          <div className="mb-2 font-medium text-gray-700">Sort By:</div>
          <div className="space-y-2">
            <button
              onClick={() => { onSortChange('newest'); toggleSort(); }}
              className={`w-full text-left px-3 py-2 rounded-md ${sortOption === 'newest' ? 'bg-primary-light text-primary' : 'hover:bg-gray-100'}`}
            >
              Newest
            </button>
            <button
              onClick={() => { onSortChange('price-asc'); toggleSort(); }}
              className={`w-full text-left px-3 py-2 rounded-md ${sortOption === 'price-asc' ? 'bg-primary-light text-primary' : 'hover:bg-gray-100'}`}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => { onSortChange('price-desc'); toggleSort(); }}
              className={`w-full text-left px-3 py-2 rounded-md ${sortOption === 'price-desc' ? 'bg-primary-light text-primary' : 'hover:bg-gray-100'}`}
            >
              Price: High to Low
            </button>
            <button
              onClick={() => { onSortChange('rating'); toggleSort(); }}
              className={`w-full text-left px-3 py-2 rounded-md ${sortOption === 'rating' ? 'bg-primary-light text-primary' : 'hover:bg-gray-100'}`}
            >
              Top Rated
            </button>
          </div>
        </div>

        {/* Filter dropdown for mobile */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} bg-white p-3 mt-1 shadow-md rounded-md border border-gray-200 w-full`}>
          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3">Categories</h3>
            <ul className="space-y-2">
              {parentCategories.map((category) => (
                <li key={category._id}>
                  <button
                    onClick={() => handleCategoryClick(category.slug)}
                    className={`block w-full text-left py-1 px-2 rounded-md ${
                      selectedCategory === category.slug
                        ? 'bg-primary-light text-primary font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                    <span className="text-sm text-gray-500 ml-1">
                      ({category.productCount || 0})
                    </span>
                  </button>

                  {/* Subcategories */}
                  {getSubcategories(category._id).length > 0 && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {getSubcategories(category._id).map((subcat) => (
                        <li key={subcat._id}>
                          <button
                            onClick={() => handleCategoryClick(subcat.slug)}
                            className={`block w-full text-left py-1 px-2 rounded-md text-sm ${
                              selectedCategory === subcat.slug
                                ? 'bg-primary-light text-primary font-medium'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {subcat.name}
                            <span className="text-sm text-gray-500 ml-1">
                              ({subcat.productCount || 0})
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3">Price Range</h3>
            <form onSubmit={handlePriceSubmit} className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-1/2">
                  <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">
                    Min (₹)
                  </label>
                  <input
                    type="number"
                    id="min-price"
                    min="0"
                    value={localPriceRange.min}
                    onChange={(e) => setLocalPriceRange({ ...localPriceRange, min: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">
                    Max (₹)
                  </label>
                  <input
                    type="number"
                    id="max-price"
                    min="0"
                    value={localPriceRange.max}
                    onChange={(e) => setLocalPriceRange({ ...localPriceRange, max: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="10000"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Apply
              </button>
            </form>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3">Availability</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
                />
                <span className="ml-2">In Stock</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
                />
                <span className="ml-2">Out of Stock</span>
              </label>
            </div>
          </div>

          {/* Festival Related */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3">Festival</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
                />
                <span className="ml-2">Diwali</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
                />
                <span className="ml-2">Navratri</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
                />
                <span className="ml-2">Ganesh Chaturthi</span>
              </label>
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              onCategoryChange('');
              setLocalPriceRange({ min: '', max: '' });
              onPriceRangeChange('', '');
            }}
            className="w-full border border-gray-300 text-text py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Desktop filters - always visible on md and up */}
      <div className="hidden md:block bg-white p-2 m-1 shadow-md rounded-md border border-gray-200">
        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-md font-bold mb-3">Categories</h3>
          <ul className="space-y-2">
            {parentCategories.map((category) => (
              <li key={category._id}>
                <button
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`block w-full text-left py-1 px-2 rounded-md ${
                    selectedCategory === category.slug
                      ? 'bg-primary-light text-primary font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                  <span className="text-sm text-gray-500 ml-1">
                    ({category.productCount || 0})
                  </span>
                </button>

                {/* Subcategories */}
                {getSubcategories(category._id).length > 0 && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {getSubcategories(category._id).map((subcat) => (
                      <li key={subcat._id}>
                        <button
                          onClick={() => handleCategoryClick(subcat.slug)}
                          className={`block w-full text-left py-1 px-2 rounded-md text-sm ${
                            selectedCategory === subcat.slug
                              ? 'bg-primary-light text-primary font-medium'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {subcat.name}
                          <span className="text-sm text-gray-500 ml-1">
                            ({subcat.productCount || 0})
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-md font-bold mb-3">Price Range</h3>
          <form onSubmit={handlePriceSubmit} className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-1/2">
                <label htmlFor="min-price-desktop" className="block text-sm text-gray-600 mb-1">
                  Min (₹)
                </label>
                <input
                  type="number"
                  id="min-price-desktop"
                  min="0"
                  value={localPriceRange.min}
                  onChange={(e) => setLocalPriceRange({ ...localPriceRange, min: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="max-price-desktop" className="block text-sm text-gray-600 mb-1">
                  Max (₹)
                </label>
                <input
                  type="number"
                  id="max-price-desktop"
                  min="0"
                  value={localPriceRange.max}
                  onChange={(e) => setLocalPriceRange({ ...localPriceRange, max: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="10000"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h3 className="text-md font-bold mb-3">Availability</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
              />
              <span className="ml-2">In Stock</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
              />
              <span className="ml-2">Out of Stock</span>
            </label>
          </div>
        </div>

        {/* Festival Related */}
        <div className="mb-6">
          <h3 className="text-md font-bold mb-3">Festival</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
              />
              <span className="ml-2">Diwali</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
              />
              <span className="ml-2">Navratri</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
              />
              <span className="ml-2">Ganesh Chaturthi</span>
            </label>
          </div>
        </div>

        {/* Reset Filters */}
        <button
          onClick={() => {
            onCategoryChange('');
            setLocalPriceRange({ min: '', max: '' });
            onPriceRangeChange('', '');
          }}
          className="w-full border border-gray-300 text-text py-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </>
  );
}
