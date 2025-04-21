import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/db';
import Category from '@/models/categoryModel';

/**
 * @desc    Test categories API
 * @route   GET /api/categories-test
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Get all categories
    const categories = await Category.find().sort({ order: 1, name: 1 });

    // Get database connection status
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };

    return NextResponse.json({
      success: true,
      count: categories.length,
      categories,
      dbStatus,
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
