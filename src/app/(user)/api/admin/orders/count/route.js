import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
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
    const count = await Order.countDocuments();
    const pendingCount = await Order.countDocuments({ status: 'Pending' });
    const processingCount = await Order.countDocuments({ status: 'Processing' });
    const shippedCount = await Order.countDocuments({ status: 'Shipped' });
    const deliveredCount = await Order.countDocuments({ status: 'Delivered' });

    return NextResponse.json({
      count,
      pendingCount,
      processingCount,
      shippedCount,
      deliveredCount
    });
  } catch (error) {
    console.error('Error fetching order count:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
