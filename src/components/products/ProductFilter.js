'use client';

import { useState } from 'react';

export default function ProductFilter({
  categories,
  selectedCategory,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
  };
  
  // Group categories by parent/child relationship
  const parentCategories = categories.filter(cat => !cat.parentCategory);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h2 className="text-lg font-bold">Filters</h2>
        <button
          onClick={toggleFilter}
          className="text-primary hover:text-primary-dark"
        >
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
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
                    ({category.hindiName})
                  </span>
                </button>
                
                {/* Subcategories */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {category.subcategories.map((subcat) => (
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
  );
}
