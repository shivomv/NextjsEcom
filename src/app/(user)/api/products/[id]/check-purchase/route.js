import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import { authMiddleware } from '@/utils/auth';

/**
 * @desc    Check if user has purchased a product
 * @route   GET /api/products/:id/check-purchase
 * @access  Private
 */
export async function GET(request, context) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();
    const { id } =await context.params;
    const user = authResult.user;

    // Find orders where the user has purchased this product and the order is delivered
    const orders = await Order.find({
      user: user._id,
      'orderItems.product': id,
      isDelivered: true,
    });

    // If there are any orders, the user has purchased the product
    const hasPurchased = orders.length > 0;

    return NextResponse.json({
      hasPurchased,
      orderCount: orders.length,
    });
  } catch (error) {
    console.error('Error checking purchase:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
