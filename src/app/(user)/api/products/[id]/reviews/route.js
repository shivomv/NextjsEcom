import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import Order from '@/models/orderModel';
import { authMiddleware } from '@/utils/auth';

/**
 * @desc    Get product reviews
 * @route   GET /api/products/:id/reviews
 * @access  Public
 */
export async function GET(request, context) {
  try {
    await dbConnect();
    const { id } = context.params;

    const product = await Product.findById(id).select('reviews');

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Create product review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
export async function POST(request, context) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();
    const { id } = context.params;
    const user = authResult.user;
    const { rating, comment } = await request.json();

    // Validate input
    if (!rating || !comment) {
      return NextResponse.json(
        { message: 'Please provide rating and comment' },
        { status: 400 }
      );
    }

    // Check if user has purchased the product
    const orders = await Order.find({
      user: user._id,
      'orderItems.product': id,
      isDelivered: true,
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { message: 'You can only review products you have purchased' },
        { status: 403 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      return NextResponse.json(
        { message: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review
    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      user: user._id,
    };

    // Add review to product
    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Calculate average rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    // Save product with new review
    await product.save();

    return NextResponse.json(
      { message: 'Review added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
