import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import { isValidObjectId } from '@/utils/validation';

/**
 * @desc    Get product by slug or ID
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
export async function GET(request, context) {
  try {
    await dbConnect();
    const { slug } = context.params;

    let product;

    // Check if the slug is actually a valid MongoDB ObjectId
    if (isValidObjectId(slug)) {
      // If it's an ID, find by ID
      product = await Product.findById(slug).populate('category', 'name slug');
    } else {
      // Otherwise, find by slug
      product = await Product.findOne({ slug }).populate('category', 'name slug');
    }

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product by slug or ID:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
