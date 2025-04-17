import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import { adminMiddleware } from '@/utils/auth';

export async function GET(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();

    // Get counts
    const count = await Product.countDocuments();
    const activeCount = await Product.countDocuments({ isActive: true });
    const inactiveCount = await Product.countDocuments({ isActive: false });
    const lowStockCount = await Product.countDocuments({ countInStock: { $lt: 10 } });
    const featuredCount = await Product.countDocuments({ isFeatured: true });

    return NextResponse.json({
      count,
      activeCount,
      inactiveCount,
      lowStockCount,
      featuredCount
    });
  } catch (error) {
    console.error('Error fetching product count:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
