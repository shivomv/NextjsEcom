import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Category from '@/models/categoryModel';
import { authMiddleware, adminMiddleware } from '@/utils/auth';

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
export async function GET(request, context) {
  try {
    await dbConnect();
    const { id } = await context.params;

    // Populate the parent field to get parent category details
    const category = await Category.findById(id).populate('parent', 'name slug');

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export async function PUT(request, context) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();
    const { id } = await context.params;
    const data = await request.json();

    // Log the image data being updated
    if (data.image) {
      console.log('Updating category with image URL:', data.image);
      console.log('Image data:', data.imageData || 'No image data provided');
    }

    // Find and update category
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);

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

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export async function DELETE(request, context) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();
    const { id } = await context.params;

    // Check if category has subcategories
    const subcategories = await Category.find({ parent: id });
    if (subcategories.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category with subcategories' },
        { status: 400 }
      );
    }

    // Find and delete category
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
