import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 4;

    // Get featured products
    const featuredProducts = await Product.find({ 
      isFeatured: true,
      isActive: true 
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

