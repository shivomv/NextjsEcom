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
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 5;
    const threshold = parseInt(searchParams.get('threshold')) || 10;
    
    // Get low stock products
    const lowStockProducts = await Product.find({
      countInStock: { $gt: 0, $lt: threshold }
    })
      .sort({ countInStock: 1 })
      .limit(limit);
    
    return NextResponse.json({
      products: lowStockProducts
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
