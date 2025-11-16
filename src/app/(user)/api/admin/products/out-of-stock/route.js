import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import { adminMiddleware } from '@/utils/auth';

/**
 * @desc    Get out of stock products
 * @route   GET /api/admin/products/out-of-stock
 * @access  Private/Admin
 */
export async function GET(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (!adminResult.success) {
      return adminResult.status;
    }

    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 5;

    // Get out of stock products (exactly 0)
    const outOfStockProducts = await Product.find({
      stock: 0,
      isActive: true
    })
      .populate('category', 'name slug')
      .sort({ updatedAt: -1 })
      .limit(limit);

    // Get total count of out of stock products
    const totalOutOfStock = await Product.countDocuments({
      stock: 0,
      isActive: true
    });

    return NextResponse.json({
      products: outOfStockProducts,
      total: totalOutOfStock
    });
  } catch (error) {
    console.error('Error fetching out of stock products:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

