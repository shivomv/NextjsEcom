'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const CategoryContext = createContext();

// Custom hook to use the category context
export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

// Provider component
export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [festivalCategories, setFestivalCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data);
      
      // Filter parent categories (top-level)
      const parents = data.filter(category => !category.parent);
      setParentCategories(parents);
      
      // Filter festival categories
      const festivals = data.filter(category => category.isFestival);
      setFestivalCategories(festivals);
      
      return data;
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get subcategories for a parent category
  const getSubcategories = (parentId) => {
    return categories.filter(category => category.parent === parentId);
  };

  // Get a category by ID
  const getCategoryById = (id) => {
    return categories.find(category => category._id === id);
  };

  // Get a category by slug
  const getCategoryBySlug = (slug) => {
    return categories.find(category => category.slug === slug);
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Context value
  const value = {
    categories,
    parentCategories,
    festivalCategories,
    loading,
    error,
    fetchCategories,
    getSubcategories,
    getCategoryById,
    getCategoryBySlug
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}
