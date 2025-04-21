import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Cart from '@/models/cartModel';
import { authMiddleware } from '@/utils/auth';

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:id
 * @access  Private
 */
export async function DELETE(request, { params }) {
  try {
    // Check if authenticated
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return authResult.status;
    }

    await dbConnect();
    const productId = params.id;

    // Find user's cart
    const cart = await Cart.findOne({ user: authResult.user._id });

    if (!cart) {
      return NextResponse.json(
        { message: 'Cart not found' },
        { status: 404 }
      );
    }

    // Remove item from cart
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== productId
    );

    // Save cart
    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:id
 * @access  Private
 */
export async function PUT(request, { params }) {
  try {
    // Check if authenticated
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return authResult.status;
    }

    await dbConnect();
    const productId = params.id;
    const { qty } = await request.json();

    // Find user's cart
    const cart = await Cart.findOne({ user: authResult.user._id });

    if (!cart) {
      return NextResponse.json(
        { message: 'Cart not found' },
        { status: 404 }
      );
    }

    // Find item in cart
    const cartItem = cart.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Update quantity
    cartItem.qty = qty;

    // Save cart
    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
