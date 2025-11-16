import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Category from '@/models/categoryModel';
import { adminMiddleware } from '@/utils/auth';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public/Admin
 */
export async function GET(request) {
  try {
    // Connect to database

    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    // Build query
    const query = {};
    if (active === 'true') {
      query.isActive = true;
    }

    const categories = await Category.find(query).sort({ order: 1, name: 1 });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export async function POST(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (!adminResult.success) {
      return adminResult.status;
    }

    await dbConnect();
    const data = await request.json();

    // Log the data received from the client
    console.log('Received category data from client:', {
      ...data,
      image: data.image ? 'Present' : 'Not present',
      imageData: data.imageData ? 'Present' : 'Not present'
    });

    // Create category with image data
    const categoryData = {
      ...data,
      user: adminResult.user._id,
    };

    // Log the image data being saved
    if (categoryData.image) {
      console.log('Saving category with image URL:', categoryData.image);
      console.log('Image data:', categoryData.imageData || 'No image data provided');
    }

    const category = await Category.create(categoryData);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'A category with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

