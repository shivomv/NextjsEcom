import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import { authMiddleware } from '@/utils/auth';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export async function POST(request) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();
    const data = await request.json();
    const user = authResult.user;

    // Validate order data
    if (!data.orderItems || data.orderItems.length === 0) {
      return NextResponse.json(
        { message: 'No order items' },
        { status: 400 }
      );
    }

    if (!data.shippingAddress) {
      return NextResponse.json(
        { message: 'Shipping address is required' },
        { status: 400 }
      );
    }

    if (!data.paymentMethod) {
      return NextResponse.json(
        { message: 'Payment method is required' },
        { status: 400 }
      );
    }

    // Ensure all order items have valid product IDs (strings, not objects)
    data.orderItems = data.orderItems.map(item => ({
      ...item,
      product: typeof item.product === 'object' ? item.product._id : item.product,
    }));

    // Ensure paymentMethod is a string
    if (typeof data.paymentMethod === 'object') {
      data.paymentMethod = data.paymentMethod.paymentMethod || 'COD';
    }

    // Create order
    const order = await Order.create({
      user: user._id,
      orderItems: data.orderItems,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      itemsPrice: data.itemsPrice,
      taxPrice: data.taxPrice,
      shippingPrice: data.shippingPrice,
      totalPrice: data.totalPrice,
      notes: data.notes,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return NextResponse.json(
      {
        message: error.message || 'Server error',
        details: 'An unexpected error occurred while processing your order. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin for all orders, Private for user orders
export async function GET(request) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();
    const user = authResult.user;
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    let query = {};

    // If not admin, only show user's orders
    if (user.role !== 'admin') {
      query.user = user._id;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Count total orders matching the query
    const count = await Order.countDocuments(query);

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('user', 'id name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    return NextResponse.json({
      orders,
      page,
      pages: Math.ceil(count / limit),
      count,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
