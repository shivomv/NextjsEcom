import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Category from '@/models/categoryModel';

/**
 * @desc    Get parent categories (top-level categories)
 * @route   GET /api/categories/parents
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    // Build query
    const query = { parent: null };
    if (active === 'true') {
      query.isActive = true;
    }

    const parentCategories = await Category.find(query).sort({ order: 1, name: 1 });

    return NextResponse.json(parentCategories);
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

