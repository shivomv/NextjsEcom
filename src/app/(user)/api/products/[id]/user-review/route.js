import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import { authMiddleware } from '@/utils/auth';

/**
 * @desc    Get user's review for a product
 * @route   GET /api/products/:id/user-review
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

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Find the user's review
    const userReview = product.reviews.find(
      (r) => r.user.toString() === user._id.toString()
    );

    return NextResponse.json({
      hasReviewed: !!userReview,
      review: userReview || null
    });
  } catch (error) {
    console.error('Error fetching user review:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
