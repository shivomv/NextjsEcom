import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Category from '@/models/categoryModel';

/**
 * @desc    Get festival categories
 * @route   GET /api/categories/festivals
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    // Build query
    const query = { isFestival: true };
    if (active === 'true') {
      query.isActive = true;
    }

    const festivalCategories = await Category.find(query).sort({ order: 1, name: 1 });

    return NextResponse.json(festivalCategories);
  } catch (error) {
    console.error('Error fetching festival categories:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

