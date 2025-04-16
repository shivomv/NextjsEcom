'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

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
      const existItem = state.cartItems.find(
        (x) => x.product === item.product
      );

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
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

  // Load cart from localStorage on initial render
  useEffect(() => {
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
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
  }, [state.cartItems, state.shippingAddress, state.paymentMethod]);

  // Add item to cart
  const addToCart = (product, qty) => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        product: product._id,
        name: product.name,
        hindiName: product.hindiName,
        image: product.images[0],
        price: product.price,
        stock: product.stock,
        qty,
      },
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    dispatch({
      type: 'CART_REMOVE_ITEM',
      payload: id,
    });
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
  const clearCart = () => {
    dispatch({ type: 'CART_CLEAR_ITEMS' });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
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
