'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MobileCategoryList({
  categories,
  selectedCategory,
  onCategoryChange,
  baseUrl = '/products',
  searchQuery = ''
}) {
  // Group categories by parent/child relationship
  const parentCategories = categories.filter(cat => !cat.parent);

  // Get subcategories for each parent category
  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parent === parentId);
  };

  // Track expanded parent categories
  const [expandedCategories, setExpandedCategories] = useState({});

  // Toggle expanded state for a parent category
  const toggleExpanded = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle category selection
  const handleCategoryClick = (slug, e) => {
    e.preventDefault();
    onCategoryChange(slug);

    // Build URL for navigation
    const url = new URL(baseUrl, window.location.origin);

    if (searchQuery) {
      url.searchParams.set('q', searchQuery);
    }

    if (slug) {
      url.searchParams.set('category', slug);
    }

    // Use history API to update URL without full page reload
    window.history.pushState({}, '', url.pathname + url.search);
  };

  return (
    <div className="">
        <div className="bg-white border-b border-gray-200 mb-3 rounded">
        <div className="flex overflow-x-auto pb-2 pt-3 hide-scrollbar gap-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <a
            href={baseUrl}
            onClick={(e) => handleCategoryClick('', e)}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 p-1 ${
              !selectedCategory
                ? 'text-primary'
                : 'text-gray-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-1 bg-gray-100 ${
              !selectedCategory
                ? 'border-2 border-primary'
                : ''
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <span className="text-xs text-center truncate w-full">All</span>
          </a>

          {parentCategories.map((category) => (
            <div key={category._id} className="relative flex-shrink-0 pt-1 pr-1">
              <a
                href={`${baseUrl}?category=${category.slug}`}
                onClick={(e) => handleCategoryClick(category.slug, e)}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 p-1 ${
                  selectedCategory === category.slug
                    ? 'text-primary'
                    : 'text-gray-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-1 bg-gray-100 ${
                  selectedCategory === category.slug
                    ? 'border-2 border-primary'
                    : ''
                }`}>
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-md object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = category.name.charAt(0).toUpperCase();
                      }}
                    />
                  ) : (
                    <span className={`text-sm font-medium ${selectedCategory === category.slug ? 'text-primary' : ''}`}>
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className={`text-xs text-center w-full ${selectedCategory === category.slug ? 'font-medium text-primary' : ''}`}>
                  {category.name}
                </span>
              </a>

              {getSubcategories(category._id).length > 0 && (
                <button
                  onClick={() => toggleExpanded(category._id)}
                  className="absolute top-1 right-1 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 shadow-sm"
                >
                  {expandedCategories[category._id] ? '-' : '+'}
                </button>
              )}

              {/* Subcategories */}
              {expandedCategories[category._id] && getSubcategories(category._id).length > 0 && (
                <div className="mt-2 pt-1 flex overflow-x-auto hide-scrollbar gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {getSubcategories(category._id).map((subcat) => (
                    <a
                      key={subcat._id}
                      href={`${baseUrl}?category=${subcat.slug}`}
                      onClick={(e) => handleCategoryClick(subcat.slug, e)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 p-1 ${
                        selectedCategory === subcat.slug
                          ? 'text-primary'
                          : 'text-gray-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-1 bg-gray-100 ${
                        selectedCategory === subcat.slug
                          ? 'border-2 border-primary'
                          : ''
                      }`}>
                        {subcat.image ? (
                          <Image
                            src={subcat.image}
                            alt={subcat.name}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-md object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = subcat.name.charAt(0).toUpperCase();
                            }}
                          />
                        ) : (
                          <span className={`text-xs font-medium ${selectedCategory === subcat.slug ? 'text-primary' : ''}`}>
                            {subcat.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs text-center w-full ${selectedCategory === subcat.slug ? 'font-medium text-primary' : ''}`}>
                        {subcat.name}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
