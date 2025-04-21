import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Category from '@/models/categoryModel';

/**
 * @desc    Test categories API
 * @route   GET /api/test-categories
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Create a test category if none exist
    const count = await Category.countDocuments();
    
    if (count === 0) {
      await Category.create({
        name: 'Test Category',
        description: 'This is a test category',
        isActive: true,
        order: 1,
      });
    }

    // Get all categories
    const categories = await Category.find().sort({ order: 1, name: 1 });

    return NextResponse.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error('Error testing categories:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Server error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
