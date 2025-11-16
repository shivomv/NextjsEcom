import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import Order from '@/models/orderModel';
import { authMiddleware } from '@/utils/auth';
import mongoose from 'mongoose';

/**
 * @desc    Get product reviews
 * @route   GET /api/products/:id/reviews
 * @access  Public
 */
export async function GET(request, context) {
  try {
    await dbConnect();
    const { id } =await context.params;

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
    if (!authResult || !authResult.success) {
      // authMiddleware returns an object with a `status` NextResponse on failure
      return authResult?.status || NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await context.params;
    const user = authResult.user;
    const { rating, comment, title, images = [] } = await request.json();

    // Validate input
    if (!rating || !comment) {
      return NextResponse.json(
        { message: 'Please provide rating and comment' },
        { status: 400 }
      );
    }

    // Validate images (if provided)
    if (images && !Array.isArray(images)) {
      return NextResponse.json(
        { message: 'Images must be an array' },
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

    // Get the most recent order for this product
    const latestOrder = orders.sort((a, b) =>
      new Date(b.deliveredAt) - new Date(a.deliveredAt)
    )[0];

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check for any existing reviews missing the required `user` field
    const invalidReviewIndices = product.reviews
      .map((r, idx) => ({ r, idx }))
      .filter(({ r }) => {
        if (!r) return true;
        // missing, null, empty string, or not a valid ObjectId
        if (r.user === undefined || r.user === null) return true;
        try {
          return !mongoose.isValidObjectId(r.user);
        } catch (e) {
          return true;
        }
      })
      .map(({ idx }) => idx);

    if (invalidReviewIndices.length > 0) {
      console.error(`Product ${id} has invalid reviews at indices: ${invalidReviewIndices.join(', ')}`);
      // Log a summary of review user values for easier debugging
      console.error(
        'Review users summary:',
        product.reviews.map((r, i) => ({ i, user: r?.user }))
      );
      return NextResponse.json(
        {
          message:
            'Product contains invalid reviews missing or having invalid user field. Please clean up these reviews before adding new ones.',
          invalidReviewIndices,
        },
        { status: 500 }
      );
    }

    // Check if user already reviewed this product
    const existingReviewIndex = product.reviews.findIndex(
      (r) => r.user.toString() === user._id.toString()
    );

    if (existingReviewIndex !== -1) {
      // Update existing review instead of creating a new one
      product.reviews[existingReviewIndex].rating = Number(rating);
      product.reviews[existingReviewIndex].title = title || '';
      product.reviews[existingReviewIndex].comment = comment;
      product.reviews[existingReviewIndex].images = images || [];
      product.reviews[existingReviewIndex].updatedAt = Date.now();

      // Recalculate average rating
      product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      // Save product with updated review
      try {
        await product.save();
      } catch (saveError) {
        console.error('Product save failed when updating review:', saveError);
        console.error('Validation errors:', saveError.errors);
        console.error('Product reviews at save time:', JSON.stringify(product.reviews, null, 2));
        product.reviews.forEach((r, i) => {
          console.error(`review[${i}] user type:`, typeof r.user, 'value:', r.user);
        });
        console.error('Product.user type:', typeof product.user, 'value:', product.user);
        throw saveError;
      }

      return NextResponse.json(
        { message: 'Review updated successfully', review: product.reviews[existingReviewIndex] },
        { status: 200 }
      );
    }

    // Create new review
    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      title: title || '',
      images: images || [],
      user: new mongoose.Types.ObjectId(user._id),
      verifiedPurchase: true,
      orderId: latestOrder._id,
      status: 'approved', // Default to approved, can be changed to 'pending' if moderation is needed
    };

    // Add review to product
    product.reviews.push(review);
    // Debug log before save: show whether all reviews have valid user ids
    console.debug('About to save product reviews summary:', product.reviews.map((r, i) => ({ i, hasUser: !!r.user, validObjectId: mongoose.isValidObjectId(r.user) })));
    product.numReviews = product.reviews.length;

    // Calculate average rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    // Save product with new review
    try {
      await product.save();
    } catch (saveError) {
      console.error('Product save failed when adding new review:', saveError);
      console.error('Validation errors:', saveError.errors);
      console.error('Product reviews at save time:', JSON.stringify(product.reviews, null, 2));
      product.reviews.forEach((r, i) => {
        console.error(`review[${i}] user type:`, typeof r.user, 'value:', r.user);
      });
      console.error('Product.user type:', typeof product.user, 'value:', product.user);
      throw saveError;
    }

    // Get the newly created review
    const newReview = product.reviews.find(
      (r) => r.user.toString() === user._id.toString()
    );

    return NextResponse.json(
      { message: 'Review added successfully', review: newReview },
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

/**
 * @desc    Update product review
 * @route   PUT /api/products/:id/reviews
 * @access  Private
 */
export async function PUT(request, context) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (!authResult || !authResult.success) {
      return authResult?.status || NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await context.params;
    const user = authResult.user;
    const { reviewId, rating, comment, title, images = [] } = await request.json();

    // Validate input
    if (!reviewId || !rating || !comment) {
      return NextResponse.json(
        { message: 'Please provide reviewId, rating and comment' },
        { status: 400 }
      );
    }

    // Validate images (if provided)
    if (images && !Array.isArray(images)) {
      return NextResponse.json(
        { message: 'Images must be an array' },
        { status: 400 }
      );
    }

    // Check if user has purchased the product (still required for updating)
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

    // Check for any existing reviews missing the required `user` field
    const invalidReviewIndices = product.reviews
      .map((r, idx) => ({ r, idx }))
      .filter(({ r }) => {
        if (!r) return true;
        if (r.user === undefined || r.user === null) return true;
        try {
          return !mongoose.isValidObjectId(r.user);
        } catch (e) {
          return true;
        }
      })
      .map(({ idx }) => idx);

    if (invalidReviewIndices.length > 0) {
      console.error(`Product ${id} has invalid reviews at indices: ${invalidReviewIndices.join(', ')}`);
      console.error('Review users summary:', product.reviews.map((r, i) => ({ i, user: r?.user })));
      return NextResponse.json(
        {
          message:
            'Product contains invalid reviews missing or having invalid user field. Please clean up these reviews before updating.',
          invalidReviewIndices,
        },
        { status: 500 }
      );
    }

    // Find the review to update
    const reviewIndex = product.reviews.findIndex(
      (r) => r._id.toString() === reviewId && r.user.toString() === user._id.toString()
    );

    if (reviewIndex === -1) {
      return NextResponse.json(
        { message: 'Review not found or you are not authorized to update this review' },
        { status: 404 }
      );
    }

    // Update the review
    product.reviews[reviewIndex].rating = Number(rating);
    product.reviews[reviewIndex].title = title || '';
    product.reviews[reviewIndex].comment = comment;
    product.reviews[reviewIndex].images = images || [];
    product.reviews[reviewIndex].updatedAt = Date.now();

    // Recalculate average rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    // Save product with updated review
    await product.save();

    return NextResponse.json(
      { message: 'Review updated successfully', review: product.reviews[reviewIndex] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
