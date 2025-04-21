import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Category from '@/models/categoryModel';

/**
 * @desc    Get subcategories of a category
 * @route   GET /api/categories/:id/subcategories
 * @access  Public
 */
export async function GET(request, context) {
  try {
    await dbConnect();
    const { id } = await context.params;

    // Check if parent category exists
    const parentCategory = await Category.findById(id);
    if (!parentCategory) {
      return NextResponse.json(
        { message: 'Parent category not found' },
        { status: 404 }
      );
    }

    // Get subcategories
    const subcategories = await Category.find({ parent: id }).sort({ order: 1, name: 1 });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
