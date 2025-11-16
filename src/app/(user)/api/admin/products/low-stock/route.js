import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import { adminMiddleware } from '@/utils/auth';

/**
 * @desc    Get low stock products
 * @route   GET /api/admin/products/low-stock
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
    const threshold = parseInt(searchParams.get('threshold')) || 5; // Default to 5

    // Get low stock products (greater than 0 but less than or equal to threshold)
    const lowStockProducts = await Product.find({
      stock: { $gt: 0, $lte: threshold },
      isActive: true
    })
      .populate('category', 'name slug')
      .sort({ stock: 1 })
      .limit(limit);

    // Get total count of low stock products
    const totalLowStock = await Product.countDocuments({
      stock: { $gt: 0, $lte: threshold },
      isActive: true
    });

    return NextResponse.json({
      products: lowStockProducts,
      total: totalLowStock
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

