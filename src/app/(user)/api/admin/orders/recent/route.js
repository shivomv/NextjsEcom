import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import { adminMiddleware } from '@/utils/auth';

/**
 * @desc    Get recent orders
 * @route   GET /api/admin/orders/recent
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
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return NextResponse.json({
      orders: recentOrders
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

