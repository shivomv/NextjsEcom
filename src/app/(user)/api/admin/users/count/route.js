import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/userModel';
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

    // Get total counts
    const count = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const customerCount = await User.countDocuments({ role: 'user' });

    // Get new users count (for the selected period)
    const newCount = period !== 'all' ? await User.countDocuments({
      ...query,
      role: 'user'
    }) : 0;

    // Get returning users (users who have placed more than one order)
    // This would require integration with the Order model
    // For now, we'll just provide a placeholder
    const returningCount = customerCount - newCount;

    // Get users by location (using address.city as location)
    const byLocation = [];

    // Only attempt to get location data if we have a 'city' field in the user model
    try {
      const locationData = await User.aggregate([
        {
          $match: { role: 'user' }
        },
        {
          $group: {
            _id: '$address.city',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);

      byLocation.push(...locationData.map(location => ({
        name: location._id || 'Unknown',
        count: location.count
      })));
    } catch (error) {
      console.error('Error fetching location data:', error);
      // Continue execution even if this part fails
    }

    return NextResponse.json({
      count,
      adminCount,
      customerCount,
      newCount,
      returningCount,
      byLocation,
      period
    });
  } catch (error) {
    console.error('Error fetching user count:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
