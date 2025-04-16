'use client';

import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

// Initial state
const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: '',
};

// Create context
const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const item = action.payload;

      // Validate item has required fields
      if (!item || !item.product) {
        console.error('Invalid cart item:', item);
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
    default:
      return state;
  }
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Load cart from API or localStorage
  useEffect(() => {
    const fetchCart = async () => {
      try {
        // If authenticated, fetch cart from API
        if (isAuthenticated && user) {
          setLoading(true);
          // Use the appropriate endpoint based on authentication
          const { data } = await api.cart.getCart();

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

          setLoading(false);
        }
        // Otherwise, load from localStorage (client-side only)
        else if (typeof window !== 'undefined') {
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
            dispatch({
              type: 'CART_ADD_ITEM',
              payload: cartItemsFromStorage,
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
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, user]);

  // Save cart to API or localStorage whenever it changes
  useEffect(() => {
    // Skip initial render
    if (state.cartItems.length === 0 && !Object.keys(state.shippingAddress).length && !state.paymentMethod) {
      return;
    }

    // Only run on the client side
    if (typeof window !== 'undefined') {
      // If authenticated, we don't need to save to localStorage as the cart is stored in the backend
      // But we'll keep it for fallback and offline support
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
      localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
    }
  }, [state.cartItems, state.shippingAddress, state.paymentMethod]);

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

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
        loading,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
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
