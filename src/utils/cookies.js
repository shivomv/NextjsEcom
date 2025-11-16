/**
 * Cookie utility functions for client-side cookie management
 */

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration in days (default: 30)
 */
export const setCookie = (name, value, days = 30) => {
  if (typeof window === 'undefined') return;
  
  const maxAge = days * 24 * 60 * 60; // Convert days to seconds
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  
  return null;
};

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 */
export const deleteCookie = (name) => {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${name}=; path=/; max-age=0`;
};

/**
 * Set authentication token in cookie
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  setCookie('token', token, 30); // 30 days expiration
};

/**
 * Get authentication token from cookie
 * @returns {string|null} Token or null if not found
 */
export const getAuthToken = () => {
  return getCookie('token');
};

/**
 * Clear authentication token from cookie
 */
export const clearAuthToken = () => {
  deleteCookie('token');
};
