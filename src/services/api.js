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

// Cart API
export const cartAPI = {
  // Get user cart
  getCart: async () => {
    try {
      // Check if user is authenticated
      const userInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;

      if (userInfo) {
        // Authenticated user - use protected endpoint
        try {
          const { data } = await api.get('/cart');
          return data;
        } catch (error) {
          console.error('Error fetching authenticated cart:', error);
          // If there's an auth error, fall back to guest cart
          const { data } = await api.get('/cart/guest');
          return data;
        }
      } else {
        // Guest user - use guest endpoint
        const { data } = await api.get('/cart/guest');
        return data;
      }
    } catch (error) {
      console.error('Error in getCart:', error);
      // Return empty cart as fallback
      return { cartItems: [], totalPrice: 0, totalItems: 0 };
    }
  },

  // Add item to cart
  addToCart: async (productId, qty) => {
    try {
      // Check if user is authenticated
      const userInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;

      if (userInfo) {
        // Authenticated user - use protected endpoint
        try {
          const { data } = await api.post('/cart', { productId, qty });
          return data;
        } catch (error) {
          console.error('Error adding to authenticated cart:', error);
          // Return success for guest users (will be handled by local storage)
          return { success: true };
        }
      } else {
        // Guest user - handled by local storage in CartContext
        return { success: true };
      }
    } catch (error) {
      console.error('Error in addToCart:', error);
      return { success: false, error: error.message };
    }
  },

  // Update cart item quantity
  updateCartItem: async (productId, qty) => {
    try {
      // Check if user is authenticated
      const userInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;

      if (userInfo) {
        // Authenticated user - use protected endpoint
        try {
          const { data } = await api.put(`/cart/${productId}`, { qty });
          return data;
        } catch (error) {
          console.error('Error updating authenticated cart:', error);
          // Return success for guest users (will be handled by local storage)
          return { success: true };
        }
      } else {
        // Guest user - handled by local storage in CartContext
        return { success: true };
      }
    } catch (error) {
      console.error('Error in updateCartItem:', error);
      return { success: false, error: error.message };
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      // Check if user is authenticated
      const userInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;

      if (userInfo) {
        // Authenticated user - use protected endpoint
        try {
          const { data } = await api.delete(`/cart/${productId}`);
          return data;
        } catch (error) {
          console.error('Error removing from authenticated cart:', error);
          // Return success for guest users (will be handled by local storage)
          return { success: true };
        }
      } else {
        // Guest user - handled by local storage in CartContext
        return { success: true };
      }
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      return { success: false, error: error.message };
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      // Check if user is authenticated
      const userInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;

      if (userInfo) {
        // Authenticated user - use protected endpoint
        try {
          const { data } = await api.delete('/cart');
          return data;
        } catch (error) {
          console.error('Error clearing authenticated cart:', error);
          // Return success for guest users (will be handled by local storage)
          return { success: true };
        }
      } else {
        // Guest user - handled by local storage in CartContext
        return { success: true };
      }
    } catch (error) {
      console.error('Error in clearCart:', error);
      return { success: false, error: error.message };
    }
  },
};

// Export the API instance with all endpoints
const apiService = {
  ...api,
  products: productAPI,
  categories: categoryAPI,
  users: userAPI,
  orders: orderAPI,
  cart: cartAPI,
};

export default apiService;
