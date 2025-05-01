import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import User from '@/models/userModel';
import { adminMiddleware } from '@/utils/auth';

/**
 * @desc    Add sample reviews to products
 * @route   POST /api/admin/products/sample-reviews
 * @access  Admin
 */
export async function POST(request) {
  try {
    // Check admin authentication
    const authResult = await adminMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();

    // Get request body
    const { productId, count = 5 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Find admin users to use as reviewers
    const users = await User.find({ isAdmin: true }).limit(5);
    if (users.length === 0) {
      return NextResponse.json(
        { message: 'No admin users found to create sample reviews' },
        { status: 404 }
      );
    }

    // Sample review comments
    const sampleComments = [
      'Great product! Exactly as described.',
      'Very satisfied with my purchase. Will buy again.',
      'Good quality for the price.',
      'Arrived quickly and in perfect condition.',
      'Beautiful item, even better than in the pictures.',
      'Excellent craftsmanship and attention to detail.',
      'This exceeded my expectations. Highly recommend!',
      'Perfect gift for religious occasions.',
      'The spiritual energy of this item is amazing.',
      'Very happy with this purchase. It looks beautiful in my prayer room.'
    ];

    // Sample review titles
    const sampleTitles = [
      'Excellent purchase',
      'Highly recommended',
      'Beautiful craftsmanship',
      'Perfect for my needs',
      'Great value',
      'Exceeded expectations',
      'Wonderful addition to my collection',
      'Spiritual and beautiful',
      'Perfect gift',
      'Amazing quality'
    ];

    // Clear existing reviews if any
    product.reviews = [];
    product.numReviews = 0;
    product.ratings = 0;

    // Generate random reviews
    const reviewsToAdd = Math.min(count, 20); // Limit to 20 reviews max
    for (let i = 0; i < reviewsToAdd; i++) {
      const user = users[i % users.length];
      const rating = Math.floor(Math.random() * 3) + 3; // Random rating between 3-5
      const commentIndex = Math.floor(Math.random() * sampleComments.length);
      const titleIndex = Math.floor(Math.random() * sampleTitles.length);

      const review = {
        user: user._id,
        name: user.name,
        rating,
        comment: sampleComments[commentIndex],
        title: sampleTitles[titleIndex],
        verifiedPurchase: true,
        status: 'approved',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date within last 30 days
      };

      product.reviews.push(review);
    }

    // Update product review stats
    product.numReviews = product.reviews.length;
    if (product.numReviews > 0) {
      product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    }

    // Save the product
    await product.save();

    return NextResponse.json({
      message: `Added ${product.reviews.length} sample reviews to product`,
      numReviews: product.numReviews,
      ratings: product.ratings
    });
  } catch (error) {
    console.error('Error adding sample reviews:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
