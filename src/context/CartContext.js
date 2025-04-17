'use client';

import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

// Initial state
const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: '',
  isInitialized: false, // Add flag to track initialization
};

// Create context
const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const item = action.payload;

      // Validate item has required fields
      if (!item) {
        console.error('Invalid cart item: item is null or undefined');
        return state;
      }

      // Check if item is an array (which would be incorrect)
      if (Array.isArray(item)) {
        console.error('Invalid cart item: received an array instead of an object', item);
        return state;
      }

      // Validate product ID exists
      if (!item.product) {
        console.error('Invalid cart item: missing product ID', item);
        return state;
      }

      const existItem = state.cartItems.find(
        (x) => x.product === item.product
      );

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? {
              ...item,
              // Ensure price is a number
              price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
              // Ensure qty is a number
              qty: typeof item.qty === 'number' ? item.qty : parseInt(item.qty) || 1,
            } : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, {
            ...item,
            // Ensure price is a number
            price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
            // Ensure qty is a number
            qty: typeof item.qty === 'number' ? item.qty : parseInt(item.qty) || 1,
          }],
        };
      }
    }
    case 'CART_REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
    case 'CART_CLEAR_ITEMS':
      return {
        ...state,
        cartItems: [],
      };
    case 'CART_SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case 'CART_SAVE_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case 'INITIALIZE_CART':
      return {
        ...state,
        isInitialized: true,
      };
    default:
      return state;
  }
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Load cart from API or localStorage - client-side only
  useEffect(() => {
    // This effect should only run on the client side
    if (typeof window === 'undefined') {
      return;
    }

    const fetchCart = async () => {
      try {
        // Mark as initialized to prevent hydration issues
        dispatch({ type: 'INITIALIZE_CART' });

        // If authenticated, fetch cart from API
        if (isAuthenticated && user) {
          setLoading(true);
          try {
            // Use the appropriate endpoint based on authentication
            const response = await api.cart.getCart();
            const data = response.data;

            if (data && data.cartItems && Array.isArray(data.cartItems)) {
              // Replace the entire cart with the server data
              dispatch({
                type: 'CART_CLEAR_ITEMS',
              });

              // Add each item individually to ensure proper format
              data.cartItems.forEach(item => {
                dispatch({
                  type: 'CART_ADD_ITEM',
                  payload: {
                    product: item.product,
                    name: item.name,
                    hindiName: item.hindiName || item.name,
                    image: item.image,
                    price: item.price,
                    stock: item.qty > 0 ? item.qty * 2 : 10, // Fallback stock value
                    qty: item.qty,
                  },
                });
              });
            }
          } catch (error) {
            console.error('Error fetching cart from API:', error);
            // Continue with empty cart or localStorage fallback
          } finally {
            setLoading(false);
          }
        }
        // Otherwise, load from localStorage
        else {
          try {
            const cartItemsFromStorage = localStorage.getItem('cartItems')
              ? JSON.parse(localStorage.getItem('cartItems'))
              : [];
            const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
              ? JSON.parse(localStorage.getItem('shippingAddress'))
              : {};
            const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
              ? JSON.parse(localStorage.getItem('paymentMethod'))
              : '';

            if (cartItemsFromStorage.length > 0) {
              // Clear cart first to avoid duplicates
              dispatch({
                type: 'CART_CLEAR_ITEMS',
              });

              // Add each item individually to ensure proper format
              cartItemsFromStorage.forEach(item => {
                if (item && item.product) {
                  dispatch({
                    type: 'CART_ADD_ITEM',
                    payload: item,
                  });
                }
              });
            }

            if (Object.keys(shippingAddressFromStorage).length > 0) {
              dispatch({
                type: 'CART_SAVE_SHIPPING_ADDRESS',
                payload: shippingAddressFromStorage,
              });
            }

            if (paymentMethodFromStorage) {
              dispatch({
                type: 'CART_SAVE_PAYMENT_METHOD',
                payload: paymentMethodFromStorage,
              });
            }
          } catch (storageError) {
            console.error('Error loading from localStorage:', storageError);
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, user]);

  // Save cart to API or localStorage whenever it changes - client-side only
  useEffect(() => {
    // This effect should only run on the client side
    if (typeof window === 'undefined') {
      return;
    }

    // Skip initial render or if not initialized yet
    if (!state.isInitialized ||
        (state.cartItems.length === 0 &&
         !Object.keys(state.shippingAddress).length &&
         !state.paymentMethod)) {
      return;
    }

    // If authenticated, we don't need to save to localStorage as the cart is stored in the backend
    // But we'll keep it for fallback and offline support
    try {
      // Validate cart items before saving to localStorage
      const validCartItems = state.cartItems.filter(item => item && item.product);
      localStorage.setItem('cartItems', JSON.stringify(validCartItems));
      localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
      localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.cartItems, state.shippingAddress, state.paymentMethod, state.isInitialized]);

  // Add item to cart
  const addToCart = async (product, qty) => {
    try {
      // If authenticated, add to cart via API
      if (isAuthenticated) {
        setLoading(true);
        await api.cart.addToCart(product._id, qty);
      }

      // Update local state
      dispatch({
        type: 'CART_ADD_ITEM',
        payload: {
          product: product._id,
          name: product.name,
          hindiName: product.hindiName || product.name,
          image: product.images[0],
          price: product.price,
          stock: product.stock,
          qty,
        },
      });

      setLoading(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    try {
      // If authenticated, remove from cart via API
      if (isAuthenticated) {
        setLoading(true);
        await api.cart.removeFromCart(id);
      }

      // Update local state
      dispatch({
        type: 'CART_REMOVE_ITEM',
        payload: id,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setLoading(false);
    }
  };

  // Save shipping address
  const saveShippingAddress = (data) => {
    dispatch({
      type: 'CART_SAVE_SHIPPING_ADDRESS',
      payload: data,
    });
  };

  // Save payment method
  const savePaymentMethod = (data) => {
    dispatch({
      type: 'CART_SAVE_PAYMENT_METHOD',
      payload: data,
    });
  };

  // Clear cart
  const clearCart = async () => {
    try {
      // If authenticated, clear cart via API
      if (isAuthenticated) {
        setLoading(true);
        await api.cart.clearCart();
      }

      // Update local state
      dispatch({ type: 'CART_CLEAR_ITEMS' });

      setLoading(false);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setLoading(false);
    }
  };

  // Refresh cart data from server
  const refreshCart = async () => {
    try {
      // Only refresh if authenticated
      if (isAuthenticated && user) {
        setLoading(true);
        try {
          const response = await api.cart.getCart();
          const data = response.data;

          if (data && data.cartItems && Array.isArray(data.cartItems)) {
            // Replace the entire cart with the server data
            dispatch({
              type: 'CART_CLEAR_ITEMS',
            });

            // Add each item individually to ensure proper format
            data.cartItems.forEach(item => {
              dispatch({
                type: 'CART_ADD_ITEM',
                payload: {
                  product: item.product,
                  name: item.name,
                  hindiName: item.hindiName || item.name,
                  image: item.image,
                  price: item.price,
                  stock: item.qty > 0 ? item.qty * 2 : 10, // Fallback stock value
                  qty: item.qty,
                },
              });
            });
          }
        } catch (error) {
          console.error('Error refreshing cart from API:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // For non-authenticated users, reload from localStorage
        try {
          const cartItemsFromStorage = localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [];

          if (cartItemsFromStorage.length > 0) {
            // Clear cart first to avoid duplicates
            dispatch({
              type: 'CART_CLEAR_ITEMS',
            });

            // Add each item individually to ensure proper format
            cartItemsFromStorage.forEach(item => {
              if (item && item.product) {
                dispatch({
                  type: 'CART_ADD_ITEM',
                  payload: item,
                });
              }
            });
          }
        } catch (storageError) {
          console.error('Error loading from localStorage:', storageError);
        }
      }
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
        loading,
        isInitialized: state.isInitialized,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
