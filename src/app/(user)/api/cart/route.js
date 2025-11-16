import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Cart from '@/models/cartModel';
import Product from '@/models/productModel';
import { authMiddleware } from '@/utils/auth';
import mongoose from 'mongoose';

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
export async function GET(request) {
  try {
    // Check if authenticated
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return authResult.status;
    }

    await dbConnect();

    // Find user's cart
    let cart = await Cart.findOne({ user: authResult.user._id });

    // If no cart exists, create an empty one
    if (!cart) {
      cart = await Cart.create({
        user: authResult.user._id,
        cartItems: []
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
export async function POST(request) {
  try {
    // Check if authenticated
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return authResult.status;
    }

    await dbConnect();
    const data = await request.json();
    const { productId, qty = 1 } = data;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: authResult.user._id });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({
        user: authResult.user._id,
        cartItems: []
      });
    }

    // Check if item already exists in cart
    const existItem = cart.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existItem) {
      // Update quantity if item exists
      existItem.qty = qty;
    } else {
      // Add new item to cart
      cart.cartItems.push({
        product: productId,
        name: product.name,
        image: product.image || (product.images && product.images.length > 0 ? product.images[0] : ''),
        price: product.price,
        qty
      });
    }

    // Save cart
    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Update cart
 * @route   PUT /api/cart
 * @access  Private
 */
export async function PUT(request) {
  try {
    // Check if authenticated
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return authResult.status;
    }

    await dbConnect();
    const data = await request.json();
    const { cartItems } = data;

    // Find user's cart
    let cart = await Cart.findOne({ user: authResult.user._id });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({
        user: authResult.user._id,
        cartItems: []
      });
    }

    // Replace cart items
    cart.cartItems = cartItems;

    // Save cart
    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
export async function DELETE(request) {
  try {
    console.log('DELETE /api/cart - Starting cart clear operation');

    // Check if authenticated
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      console.log('DELETE /api/cart - Authentication failed');
      return authResult.status;
    }

    await dbConnect();
    const userId = authResult.user._id;
    console.log(`DELETE /api/cart - Clearing cart for user: ${userId}`);

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });

    // If cart exists, clear it
    if (cart) {
      // Check if cart is already empty
      if (cart.cartItems.length === 0) {
        console.log(`DELETE /api/cart - Cart already empty for user: ${userId}`);
        return NextResponse.json({ success: true, message: 'Cart already empty' });
      }

      // Clear the cart
      cart.cartItems = [];
      await cart.save();
      console.log(`DELETE /api/cart - Cart cleared successfully for user: ${userId}`);
    } else {
      console.log(`DELETE /api/cart - No cart found for user: ${userId}`);
    }

    return NextResponse.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

