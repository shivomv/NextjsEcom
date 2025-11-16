'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '@/services/api';
import { setAuthToken, clearAuthToken } from '@/utils/cookies';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render and verify token
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo'))
          : null;

        if (userInfo && userInfo.token) {
          // Set user from localStorage initially
          setUser(userInfo);
          
          // Set token in cookie for server-side access
          setAuthToken(userInfo.token);

          try {
            // Verify token validity by fetching user profile
            const userData = await userAPI.getProfile();
            // Update user data with fresh data from server
            setUser(prevUser => ({ ...prevUser, ...userData }));
          } catch (error) {
            // If token is invalid, clear user data
            console.error('Token validation failed:', error);
            userAPI.logout();
            setUser(null);
          }
        } else {
          // Clear cookie if no user info
          clearAuthToken();
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('userInfo');
        clearAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (name, email, password, phone) => {
    try {
      setLoading(true);
      setError(null);

      // Validate input
      if (!name || !email || !password) {
        const error = new Error('Name, email and password are required');
        setError(error);
        throw error;
      }

      // Call API to register user
      const data = await userAPI.register({ name, email, password, phone });

      // Update user state with returned data
      setUser(data);
      return data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Validate input
      if (!email || !password) {
        const error = new Error('Email and password are required');
        setError(error);
        throw error;
      }

      // Call API to login user
      const data = await userAPI.login(email, password);

      // Update user state with returned data
      setUser(data);
      return data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await userAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.updateProfile(userData);
      setUser({ ...user, ...data });
      return data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
