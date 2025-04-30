'use client';

import axios from 'axios';

const API_URL = '/api';

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
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          const token = parsedUserInfo.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error parsing user info from localStorage:', error);
          // Remove invalid user info
          localStorage.removeItem('userInfo');
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.warn('Authentication error:', error.response.data);

      // If we're not on the login page, clear auth and redirect
      if (typeof window !== 'undefined' &&
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')) {

        // Clear user data on auth error
        localStorage.removeItem('userInfo');

        // Only redirect if it's a token validation error, not a login attempt
        const isLoginAttempt = error.config.url.includes('/login') || error.config.url.includes('/register');
        if (!isLoginAttempt) {
          // Redirect to login page with return URL
          const returnUrl = encodeURIComponent(window.location.pathname);
          window.location.href = `/login?redirect=${returnUrl}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

// Product API
export const productAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    try {
      // If fuzzy search is enabled, add it to the params
      if (params.fuzzy !== undefined) {
        params.fuzzy = params.fuzzy.toString();
      }
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

  // Get product by slug (legacy support)
  getProductBySlug: async (slug) => {
    try {
      // Try to determine if the slug is actually an ID
      if (slug && slug.match(/^[0-9a-fA-F]{24}$/)) {
        return await productAPI.getProductById(slug);
      }
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

  // Get all categories with product counts
  getCategoriesWithCounts: async () => {
    try {
      const { data } = await api.get('/categories/with-counts');
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
      const { data } = await api.post('/users/register', userData);

      // Store user data in localStorage
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('userInfo', JSON.stringify(data));
      }

      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  },

  // Login user with real backend
  login: async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data } = await api.post('/users/login', { email, password });

      // Store user data in localStorage
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('userInfo', JSON.stringify(data));
      }

      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Call logout endpoint to invalidate token on server (if implemented)
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove from localStorage even if server request fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
      }
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
          return { data };
        } catch (error) {
          console.error('Error fetching authenticated cart:', error);
          // If there's an auth error, fall back to guest cart
          return { data: { cartItems: [], totalPrice: 0, totalItems: 0 } };
        }
      } else {
        // Guest user - return empty cart data
        return { data: { cartItems: [], totalPrice: 0, totalItems: 0 } };
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
        // Check for rate limiting
        const now = Date.now();
        const lastApiClearTime = window._lastApiCartClearTime || 0;

        // Limit API calls to once every 5 seconds
        if (now - lastApiClearTime < 5000) {
          console.log('API call to clear cart skipped - too soon since last call');
          return { success: true, message: 'Rate limited, using cached result' };
        }

        // Update the last API clear time
        window._lastApiCartClearTime = now;

        // Authenticated user - use protected endpoint
        try {
          console.log('Sending DELETE request to /api/cart');
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
