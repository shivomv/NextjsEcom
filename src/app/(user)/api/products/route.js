import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import Category from '@/models/categoryModel';
import { authMiddleware } from '@/utils/auth';

/**
 * @desc    Get all products or filter by category
 * @route   GET /api/products
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const keyword = searchParams.get('keyword');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;

    // Build query
    let query = { isActive: true };

    // Filter by category if provided
    if (category) {
      try {
        // Check if category is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(category)) {
          query.category = category;
        } else {
          // If not a valid ObjectId, assume it's a slug and find the category first
          const categoryDoc = await Category.findOne({ slug: category });
          if (categoryDoc) {
            query.category = categoryDoc._id;
          }
        }
      } catch (error) {
        console.error('Error processing category filter:', error);
      }
    }

    // Filter by keyword if provided
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by featured if provided
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Build sort options
    let sortOptions = {};
    if (sort === 'price-asc') {
      sortOptions.price = 1;
    } else if (sort === 'price-desc') {
      sortOptions.price = -1;
    } else if (sort === 'newest') {
      sortOptions.createdAt = -1;
    } else if (sort === 'rating') {
      sortOptions.ratings = -1;
    } else {
      // Default sort by createdAt
      sortOptions.createdAt = -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      page,
      pages: totalPages,
      total,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export async function POST(request) {
  try {
    // Check if admin
    const adminResult = await authMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();
    const data = await request.json();

    // Create product
    const product = await Product.create(data);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
