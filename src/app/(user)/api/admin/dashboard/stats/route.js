import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import Product from '@/models/productModel';
import User from '@/models/userModel';
import { adminMiddleware } from '@/utils/auth';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard/stats
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
    
    // Get total orders
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      {
        $match: {
          isPaid: true
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Get total customers (users with role 'user')
    const totalCustomers = await User.countDocuments({ role: 'user' });
    
    // Get total products
    const totalProducts = await Product.countDocuments();
    
    // Get monthly growth rates
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);
    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(now.getMonth() - 2);
    
    // Orders growth
    const ordersLastMonth = await Order.countDocuments({
      createdAt: { $gte: lastMonth, $lt: now }
    });
    const ordersTwoMonthsAgo = await Order.countDocuments({
      createdAt: { $gte: twoMonthsAgo, $lt: lastMonth }
    });
    const ordersGrowth = ordersTwoMonthsAgo > 0 
      ? ((ordersLastMonth - ordersTwoMonthsAgo) / ordersTwoMonthsAgo) * 100 
      : 0;
    
    // Revenue growth
    const revenueLastMonthResult = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: lastMonth, $lt: now }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);
    const revenueTwoMonthsAgoResult = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: twoMonthsAgo, $lt: lastMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);
    
    const revenueLastMonth = revenueLastMonthResult.length > 0 ? revenueLastMonthResult[0].total : 0;
    const revenueTwoMonthsAgo = revenueTwoMonthsAgoResult.length > 0 ? revenueTwoMonthsAgoResult[0].total : 0;
    const revenueGrowth = revenueTwoMonthsAgo > 0 
      ? ((revenueLastMonth - revenueTwoMonthsAgo) / revenueTwoMonthsAgo) * 100 
      : 0;
    
    // Customers growth
    const customersLastMonth = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: lastMonth, $lt: now }
    });
    const customersTwoMonthsAgo = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: twoMonthsAgo, $lt: lastMonth }
    });
    const customersGrowth = customersTwoMonthsAgo > 0 
      ? ((customersLastMonth - customersTwoMonthsAgo) / customersTwoMonthsAgo) * 100 
      : 0;
    
    // Products growth
    const productsLastMonth = await Product.countDocuments({
      createdAt: { $gte: lastMonth, $lt: now }
    });
    const productsTwoMonthsAgo = await Product.countDocuments({
      createdAt: { $gte: twoMonthsAgo, $lt: lastMonth }
    });
    const productsGrowth = productsTwoMonthsAgo > 0 
      ? ((productsLastMonth - productsTwoMonthsAgo) / productsTwoMonthsAgo) * 100 
      : 0;
    
    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      growth: {
        orders: ordersGrowth.toFixed(1),
        revenue: revenueGrowth.toFixed(1),
        customers: customersGrowth.toFixed(1),
        products: productsGrowth.toFixed(1)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

