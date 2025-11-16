import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Category from '@/models/categoryModel';
import Product from '@/models/productModel';

/**
 * @desc    Get all categories with product counts
 * @route   GET /api/categories/with-counts
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    // Build query
    const query = {};
    if (active === 'true') {
      query.isActive = true;
    }

    // Get all categories
    const categories = await Category.find(query).sort({ order: 1, name: 1 });

    // Add product counts to each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({
          category: category._id,
          isActive: true
        });

        return {
          _id: category._id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          parent: category.parent,
          isFestival: category.isFestival,
          isActive: category.isActive,
          order: category.order,
          count: count,
          productCount: count // Add productCount for compatibility with the UI
        };
      })
    );

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error('Error fetching categories with counts:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

