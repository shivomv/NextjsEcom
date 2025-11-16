import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';

/**
 * @desc    Get recent products
 * @route   GET /api/products/recent
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 6;

    // Get recent products
    const recentProducts = await Product.find({
      isActive: true
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json(recentProducts);
  } catch (error) {
    console.error('Error fetching recent products:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

