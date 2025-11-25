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

    // Mark as initialized to prevent hydration issues
    dispatch({ type: 'INITIALIZE_CART' });

    // Skip if already loaded
    if (state.cartItems.length > 0) {
      return;
    }

    const fetchCart = async () => {
      try {
        // If authenticated, fetch cart from API
        if (isAuthenticated && user) {
          setLoading(true);
          try {
            // Use the appropriate endpoint based on authentication
            const response = await api.cart.getCart();
            const data = response.data;

            if (data && data.cartItems && Array.isArray(data.cartItems) && data.cartItems.length > 0) {
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
                    stock: item.stock || 0, // Use actual stock value, default to 0 if not available
                    qty: item.qty,
                  },
                });
              });
            }
          } catch (error) {
            console.error('Error fetching cart from API:', error);
            // Fall back to localStorage on error
            loadFromLocalStorage();
          } finally {
            setLoading(false);
          }
        }
        // Otherwise, load from localStorage
        else {
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
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
    };

    fetchCart();
  }, [isAuthenticated, user, dispatch, state.cartItems.length]);

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
      // Check if product is out of stock (stock is undefined, null, 0, or negative)
      if (product.stock === undefined || product.stock === null || product.stock <= 0) {
        console.error('Cannot add out-of-stock product to cart:', product.name);

        // Show toast notification if available
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error('This product is out of stock and cannot be added to your cart.');
        } else {
          // Fallback to alert in development
          if (process.env.NODE_ENV === 'development') {
            alert('This product is out of stock and cannot be added to your cart.');
          }
        }

        return false;
      }

      // Check if requested quantity is available
      if (qty > product.stock) {
        console.error(`Cannot add ${qty} units of ${product.name} to cart. Only ${product.stock} available.`);

        // Show toast notification if available
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error(`Cannot add ${qty} units to cart. Only ${product.stock} available.`);
        } else {
          // Fallback to alert in development
          if (process.env.NODE_ENV === 'development') {
            alert(`Cannot add ${qty} units to cart. Only ${product.stock} available.`);
          }
        }

        return false;
      }

      setLoading(true);

      // Update local state first for immediate UI feedback
      dispatch({
        type: 'CART_ADD_ITEM',
        payload: {
          product: product._id,
          name: product.name,
          hindiName: product.hindiName || product.name,
          image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image,
          price: product.price,
          stock: product.stock,
          qty,
        },
      });

      // If authenticated, sync with server
      if (isAuthenticated) {
        await api.cart.addToCart(product._id, qty);
      }

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    try {
      setLoading(true);

      // Update local state first for immediate UI feedback
      dispatch({
        type: 'CART_REMOVE_ITEM',
        payload: id,
      });

      // If authenticated, sync with server
      if (isAuthenticated) {
        await api.cart.removeFromCart(id);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
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
      // Prevent multiple rapid calls using a module-level variable
      const now = Date.now();
      const lastClearTime = window._lastCartClearTime || 0;

      // Limit clearing to once every 3 seconds
      if (now - lastClearTime < 3000) {
        console.log('Skipping cart clear - too soon since last clear');
        return;
      }

      // Update the last clear time
      window._lastCartClearTime = now;

      // If authenticated, clear cart via API
      if (isAuthenticated) {
        setLoading(true);
        await api.cart.clearCart();
      }

      // Update local state
      dispatch({ type: 'CART_CLEAR_ITEMS' });

      setLoading(false);

      // Store a flag in sessionStorage to indicate the cart has been cleared
      sessionStorage.setItem('cartCleared', 'true');
    } catch (error) {
      console.error('Error clearing cart:', error);
      setLoading(false);
    }
  };

  // Refresh cart data from server
  const refreshCart = async () => {
    try {
      // Prevent multiple rapid refreshes using a module-level variable
      const now = Date.now();
      const lastRefreshTime = window._lastCartRefreshTime || 0;

      // Limit refreshes to once every 2 seconds
      if (now - lastRefreshTime < 2000) {
        console.log('Skipping cart refresh - too soon since last refresh');
        return;
      }

      // Update the last refresh time
      window._lastCartRefreshTime = now;

      // Only refresh if authenticated
      if (isAuthenticated && user) {
        setLoading(true);
        try {
          const response = await api.cart.getCart();
          const data = response.data;

          if (data && data.cartItems && Array.isArray(data.cartItems)) {
            // Check if cart has actually changed to avoid unnecessary updates
            const serverCartItemIds = data.cartItems.map(item => item.product.toString());
            const localCartItemIds = state.cartItems.map(item =>
              typeof item.product === 'object' ? item.product._id.toString() : item.product.toString()
            );

            // Check if items or quantities have changed
            const hasCartChanged =
              serverCartItemIds.length !== localCartItemIds.length ||
              !serverCartItemIds.every(id => localCartItemIds.includes(id)) ||
              data.cartItems.some(serverItem => {
                const localItem = state.cartItems.find(item => {
                  const localId = typeof item.product === 'object' ? item.product._id.toString() : item.product.toString();
                  return localId === serverItem.product.toString();
                });
                return !localItem || localItem.qty !== serverItem.qty;
              });

            if (hasCartChanged) {
              console.log('Cart has changed, updating from server');
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
                    stock: item.stock || 0, // Use actual stock value, default to 0 if not available
                    qty: item.qty,
                  },
                });
              });
            } else {
              console.log('Cart has not changed, skipping update');
            }
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

          // Only update if the localStorage cart is different from the current state
          const storageIds = cartItemsFromStorage.map(item => item.product);
          const stateIds = state.cartItems.map(item =>
            typeof item.product === 'object' ? item.product._id : item.product
          );

          const hasChanged =
            storageIds.length !== stateIds.length ||
            !storageIds.every(id => stateIds.includes(id));

          if (hasChanged && cartItemsFromStorage.length > 0) {
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

  // Calculate prices
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + (item.price * item.qty),
    0
  );

  // Calculate shipping price (free shipping for orders over ₹500)
  const shippingPrice = itemsPrice > 500 ? 0 : 50;

  // Calculate tax price (5% GST)
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));

  // Calculate total price
  const totalPrice = Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
        loading,
        isInitialized: state.isInitialized,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
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
