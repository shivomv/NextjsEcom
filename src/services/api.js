'use client';

import axios from 'axios';
import { setAuthToken, clearAuthToken } from '@/utils/cookies';

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
      console.log('[API Service] UserInfo from localStorage:', userInfo ? 'Found' : 'Not found');
      
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          const token = parsedUserInfo.token;
          console.log('[API Service] Token extracted:', token ? 'Yes' : 'No');
          
          if (token) {
            // Set token in cookie for server-side access
            setAuthToken(token);
            
            // Also set Authorization header as fallback
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[API Service] Token set in cookie and header for:', config.url);
          }
        } catch (error) {
          console.error('[API Service] Error parsing user info from localStorage:', error);
          // Remove invalid user info
          localStorage.removeItem('userInfo');
          // Clear cookie
          clearAuthToken();
        }
      } else {
        console.warn('[API Service] No userInfo in localStorage for request to:', config.url);
        // Clear cookie if no user info
        clearAuthToken();
      }
    }
    
    // Enable credentials to send cookies
    config.withCredentials = true;
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

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    try {
      const { data } = await api.get(`/products/featured?limit=${limit}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get recent products
  getRecentProducts: async (limit = 8) => {
    try {
      const { data } = await api.get(`/products/recent?limit=${limit}`);
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
      const { data } = await api.post('/users', userData);

      // Store user data in localStorage
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        // Set token in cookie
        setAuthToken(data.token);
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
        // Set token in cookie
        setAuthToken(data.token);
      }

      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  },

  // Logout user
  logout: async () => {
    // Remove from localStorage and cookie
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userInfo');
      // Clear cookie
      clearAuthToken();
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

  // Create order after payment
  createOrderAfterPayment: async (orderData) => {
    try {
      const { data } = await api.post('/orders/create-after-payment', orderData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get all orders (admin)
  getAllOrders: async (params = {}) => {
    try {
      const { data } = await api.get('/orders', { params });
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

// Admin API
export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const { data } = await api.get('/admin/dashboard/stats');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Products Management
  getAdminProducts: async (params = {}) => {
    try {
      const { data } = await api.get('/admin/products', { params });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  getProductsCount: async () => {
    try {
      const { data } = await api.get('/admin/products/count');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  getLowStockProducts: async (threshold = 10) => {
    try {
      const { data } = await api.get(`/admin/products/low-stock?threshold=${threshold}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  getOutOfStockProducts: async () => {
    try {
      const { data } = await api.get('/admin/products/out-of-stock');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  createProduct: async (productData) => {
    try {
      const { data } = await api.post('/products', productData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const { data } = await api.put(`/products/${id}`, productData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  deleteProduct: async (id) => {
    try {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Categories Management
  createCategory: async (categoryData) => {
    try {
      const { data } = await api.post('/categories', categoryData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const { data } = await api.put(`/categories/${id}`, categoryData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  deleteCategory: async (id) => {
    try {
      const { data } = await api.delete(`/categories/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Orders Management
  getAdminOrders: async (params = {}) => {
    try {
      const { data } = await api.get('/orders', { params });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  getOrdersCount: async () => {
    try {
      const { data } = await api.get('/admin/orders/count');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  getRecentOrders: async (limit = 10) => {
    try {
      const { data } = await api.get(`/admin/orders/recent?limit=${limit}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  getOrdersRevenue: async (params = {}) => {
    try {
      const { data } = await api.get('/admin/orders/revenue', { params });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  updateOrder: async (id, orderData) => {
    try {
      const { data } = await api.put(`/orders/${id}`, orderData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Users Management
  getAllUsers: async (params = {}) => {
    try {
      const { data } = await api.get('/users', { params });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  getUsersCount: async () => {
    try {
      const { data } = await api.get('/admin/users/count');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Settings Management
  getSettings: async () => {
    try {
      const { data } = await api.get('/admin/settings');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const { data } = await api.post('/admin/settings', settingsData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Delivery Agencies Management
  getDeliveryAgencies: async () => {
    try {
      const { data } = await api.get('/admin/delivery-agencies');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  createDeliveryAgency: async (agencyData) => {
    try {
      const { data } = await api.post('/admin/delivery-agencies', agencyData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  updateDeliveryAgency: async (id, agencyData) => {
    try {
      const { data } = await api.put(`/admin/delivery-agencies/${id}`, agencyData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  deleteDeliveryAgency: async (id) => {
    try {
      const { data } = await api.delete(`/admin/delivery-agencies/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Banners Management
  getBanners: async () => {
    try {
      const { data } = await api.get('/admin/banners');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  createBanner: async (bannerData) => {
    try {
      const { data } = await api.post('/admin/banners', bannerData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  updateBanner: async (id, bannerData) => {
    try {
      const { data } = await api.put(`/admin/banners/${id}`, bannerData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  deleteBanner: async (id) => {
    try {
      const { data } = await api.delete(`/admin/banners/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Payment Gateways Management
  getPaymentGateways: async () => {
    try {
      const { data } = await api.get('/admin/payment-gateways');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  updatePaymentGateway: async (id, gatewayData) => {
    try {
      const { data } = await api.put(`/admin/payment-gateways/${id}`, gatewayData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Web Pages Management
  getWebPages: async () => {
    try {
      const { data } = await api.get('/admin/web-pages');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  getWebPageById: async (id) => {
    try {
      const { data } = await api.get(`/admin/web-pages/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  createWebPage: async (pageData) => {
    try {
      const { data } = await api.post('/admin/web-pages', pageData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  updateWebPage: async (id, pageData) => {
    try {
      const { data } = await api.put(`/admin/web-pages/${id}`, pageData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  deleteWebPage: async (id) => {
    try {
      const { data } = await api.delete(`/admin/web-pages/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Upload Management
  uploadImage: async (formData) => {
    try {
      const { data } = await api.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  deleteImage: async (publicId) => {
    try {
      const { data } = await api.delete('/admin/upload', {
        data: { publicId },
      });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

// Reviews API
export const reviewAPI = {
  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    try {
      const { data } = await api.get(`/products/${productId}/reviews`, { params });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get user's review for a product
  getUserReview: async (productId) => {
    try {
      const { data } = await api.get(`/products/${productId}/user-review`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Create product review
  createReview: async (productId, reviewData) => {
    try {
      const { data } = await api.post(`/products/${productId}/reviews`, reviewData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Update product review
  updateReview: async (productId, reviewData) => {
    try {
      const { data } = await api.put(`/products/${productId}/reviews`, reviewData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Check if user purchased product
  checkPurchase: async (productId) => {
    try {
      const { data } = await api.get(`/products/${productId}/check-purchase`);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

// Payment API
export const paymentAPI = {
  // Create Razorpay order
  createRazorpayOrder: async (orderData) => {
    try {
      const { data } = await api.post('/payment/razorpay', orderData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Verify Razorpay payment
  verifyRazorpayPayment: async (paymentData) => {
    try {
      const { data } = await api.post('/payment/razorpay/verify', paymentData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Create payment
  createPayment: async (paymentData) => {
    try {
      const { data } = await api.post('/payment/razorpay/create-payment', paymentData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

// Settings API
export const settingsAPI = {
  // Get public settings
  getPublicSettings: async () => {
    try {
      const { data } = await api.get('/settings');
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

// Upload API
export const uploadAPI = {
  // Upload public image
  uploadPublicImage: async (formData) => {
    try {
      const { data } = await api.post('/upload-public', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Upload private image (authenticated)
  uploadPrivateImage: async (formData) => {
    try {
      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

// Receipt API
export const receiptAPI = {
  // Get order receipt
  getOrderReceipt: async (orderId) => {
    try {
      const { data } = await api.get(`/orders/receipt/${orderId}`, {
        responseType: 'blob',
      });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
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
  admin: adminAPI,
  reviews: reviewAPI,
  payment: paymentAPI,
  settings: settingsAPI,
  upload: uploadAPI,
  receipt: receiptAPI,
};

export default apiService;
