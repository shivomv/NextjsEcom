'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { useCategories } from '@/context/CategoryContext';
import Breadcrumb from '@/components/common/Breadcrumb';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function CategoriesPage() {
  const { categories, loading: categoriesLoading } = useCategories();
  const [parentCategories, setParentCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});

  // Organize categories into parent and subcategories
  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      // Get parent categories (those without a parent)
      const parents = categories.filter(cat => !cat.parent);
      setParentCategories(parents);

      // Group subcategories by parent
      const subs = {};
      categories.forEach(cat => {
        if (cat.parent) {
          if (!subs[cat.parent]) {
            subs[cat.parent] = [];
          }
          subs[cat.parent].push(cat);
        }
      });
      setSubcategories(subs);
    }
  }, [categories, categoriesLoading]);

  // Show loading state
  if (categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/category', active: true }
          ]} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10"></div>
        <div className="relative h-[15vh] min-h-[120px] sm:min-h-[150px] md:min-h-[180px] w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500"></div>
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg">
              Browse Categories
            </h1>
            <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto drop-shadow">
              Explore our wide range of products by category
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {parentCategories.map((category) => (
            <Link 
              key={category._id} 
              href={`/category/${category.slug}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold text-lg drop-shadow-md">
                    {category.name}
                  </h3>
                  {subcategories[category._id] && (
                    <p className="text-white/80 text-xs">
                      {subcategories[category._id].length} subcategories
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Subcategories Sections */}
        {parentCategories.map((parent) => (
          subcategories[parent._id] && subcategories[parent._id].length > 0 && (
            <div key={parent._id} className="mt-10 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{parent.name}</h2>
                <Link 
                  href={`/category/${parent.slug}`}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {subcategories[parent._id].map((subcat) => (
                  <Link 
                    key={subcat._id} 
                    href={`/category/${subcat.slug}`}
                    className="block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-24 w-full overflow-hidden">
                      <ImageWithFallback
                        src={subcat.image}
                        alt={subcat.name}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="p-2 text-center">
                      <h3 className="text-sm font-medium text-gray-800">
                        {subcat.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        ))}

        {/* No Categories Message */}
        {parentCategories.length === 0 && (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No Categories Found</h3>
            <p className="text-text-light mb-6">
              We couldn&apos;t find any categories. Please check back later.
            </p>
            <Link href="/products" className="bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
