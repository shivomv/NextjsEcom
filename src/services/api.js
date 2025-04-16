'use client';

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Product API
export const productAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    try {
      const { data } = await api.get('/products', { params });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    try {
      const { data } = await api.get(`/products/slug/${slug}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get top rated products
  getTopProducts: async (limit = 5) => {
    try {
      const { data } = await api.get(`/products/top?limit=${limit}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get related products
  getRelatedProducts: async (id, limit = 4) => {
    try {
      const { data } = await api.get(`/products/${id}/related?limit=${limit}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

// Category API
export const categoryAPI = {
  // Get all categories
  getCategories: async () => {
    try {
      const { data } = await api.get('/categories');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const { data } = await api.get(`/categories/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    try {
      const { data } = await api.get(`/categories/slug/${slug}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get parent categories
  getParentCategories: async () => {
    try {
      const { data } = await api.get('/categories/parents');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get subcategories
  getSubcategories: async (id) => {
    try {
      const { data } = await api.get(`/categories/${id}/subcategories`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get festival categories
  getFestivalCategories: async () => {
    try {
      const { data } = await api.get('/categories/festivals');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

// User API
export const userAPI = {
  // Register user
  register: async (userData) => {
    try {
      const { data } = await api.post('/users', userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Login user (mock implementation for demo)
  login: async (email, password) => {
    try {
      // For demo purposes, we'll accept any email/password combination
      // In a real app, this would validate against a backend

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock user data
      const userData = {
        id: '1',
        name: email.split('@')[0], // Use part of email as name
        email,
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
        role: email.includes('admin') ? 'admin' : 'user',
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(userData));
      }

      return userData;
    } catch (error) {
      throw error.message || 'Login failed';
    }
  },

  // Logout user
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userInfo');
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const { data } = await api.get('/users/profile');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const { data } = await api.put('/users/profile', userData);
      if (typeof window !== 'undefined') {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        localStorage.setItem(
          'userInfo',
          JSON.stringify({ ...userInfo, ...data })
        );
      }
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Add user address
  addAddress: async (addressData) => {
    try {
      const { data } = await api.post('/users/address', addressData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Update user address
  updateAddress: async (id, addressData) => {
    try {
      const { data } = await api.put(`/users/address/${id}`, addressData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Delete user address
  deleteAddress: async (id) => {
    try {
      const { data } = await api.delete(`/users/address/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

// Order API
export const orderAPI = {
  // Create order
  createOrder: async (orderData) => {
    try {
      const { data } = await api.post('/orders', orderData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Update order to paid
  payOrder: async (id, paymentResult) => {
    try {
      const { data } = await api.put(`/orders/${id}/pay`, paymentResult);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get logged in user orders
  getMyOrders: async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

export default api;
