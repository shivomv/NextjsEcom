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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, week, month, year

    // Calculate date range based on period
    const now = new Date();
    let startDate;
    let query = {};

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        query.createdAt = { $gte: startDate };
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        query.createdAt = { $gte: startDate };
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        query.createdAt = { $gte: startDate };
        break;
      default:
        // All time, no date filter
        break;
    }

    // Get counts
    const count = await Order.countDocuments(query);

    // Status counts
    const pendingQuery = { ...query, status: 'Pending' };
    const processingQuery = { ...query, status: 'Processing' };
    const shippedQuery = { ...query, status: 'Shipped' };
    const deliveredQuery = { ...query, status: 'Delivered' };
    const cancelledQuery = { ...query, status: 'Cancelled' };

    const pendingCount = await Order.countDocuments(pendingQuery);
    const processingCount = await Order.countDocuments(processingQuery);
    const shippedCount = await Order.countDocuments(shippedQuery);
    const deliveredCount = await Order.countDocuments(deliveredQuery);
    const cancelledCount = await Order.countDocuments(cancelledQuery);

    // Get orders by date for the period
    let byDate = [];

    if (period !== 'all') {
      const ordersByDateResult = await Order.aggregate([
        {
          $match: query
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);

      byDate = ordersByDateResult.map(item => ({
        date: item._id,
        count: item.count
      }));
    }

    return NextResponse.json({
      count,
      pendingCount,
      processingCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      byDate,
      period
    });
  } catch (error) {
    console.error('Error fetching order count:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
