import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import { adminMiddleware } from '@/utils/auth';
import { sanitizeInput, escapeRegex } from '@/utils/sanitize';
import { handleApiError } from '@/utils/errorHandler';
import logger from '@/utils/logger';

/**
 * @desc    Get all products with admin filters
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
export async function GET(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || 10));
    const keyword = sanitizeInput(searchParams.get('keyword'));
    const stock = sanitizeInput(searchParams.get('stock'));
    const active = sanitizeInput(searchParams.get('active'));

    let query = {};

    if (keyword) {
      const escapedKeyword = escapeRegex(keyword);
      query.$or = [
        { name: { $regex: escapedKeyword, $options: 'i' } },
        { description: { $regex: escapedKeyword, $options: 'i' } },
      ];
    }

    // Filter by stock if provided
    if (stock === 'low') {
      query.countInStock = { $gt: 0, $lt: 10 };
    } else if (stock === 'out') {
      query.countInStock = { $lte: 0 };
    }

    // Filter by active status if provided
    if (active === 'true') {
      query.isActive = true;
    } else if (active === 'false') {
      query.isActive = false;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
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
    return handleApiError(error, 'Error fetching products');
  }
}

/**
 * @desc    Create a new product
 * @route   POST /api/admin/products
 * @access  Private/Admin
 */
export async function POST(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();
    const body = await request.json();
    const data = sanitizeInput(body);

    const productData = {
      ...data,
      user: adminResult.user._id,
    };

    const product = await Product.create(productData);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Error creating product');
  }
}
