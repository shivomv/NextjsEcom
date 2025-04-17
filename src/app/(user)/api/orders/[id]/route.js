import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import { authMiddleware, adminMiddleware } from '@/utils/auth';

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export async function GET(request, { params }) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();
    const { id } = params;
    const user = authResult.user;

    const order = await Order.findById(id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if the order belongs to the logged-in user or if the user is an admin
    if (order.user._id.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized to access this order' },
        { status: 401 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin
export async function PUT(request, { params }) {
  try {
    // Check authentication and admin status
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();
    const { id } = params;
    const user = authResult.user;
    const data = await request.json();

    // Find the order
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check permissions - only admin can update any order
    // Regular users can only update their own orders and only certain fields
    if (user.role !== 'admin' && order.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: 'Not authorized to update this order' },
        { status: 401 }
      );
    }

    // If user is not admin, restrict what they can update
    if (user.role !== 'admin') {
      // Regular users can only cancel their orders if they're not already processed
      if (data.status === 'Cancelled' && order.status === 'Pending') {
        order.status = 'Cancelled';
      } else {
        return NextResponse.json(
          { message: 'You can only cancel pending orders' },
          { status: 400 }
        );
      }
    } else {
      // Admin can update all fields
      if (data.status) order.status = data.status;
      if (data.isPaid !== undefined) {
        order.isPaid = data.isPaid;
        if (data.isPaid && !order.paidAt) {
          order.paidAt = Date.now();
        }
      }
      if (data.isDelivered !== undefined) {
        order.isDelivered = data.isDelivered;
        if (data.isDelivered && !order.deliveredAt) {
          order.deliveredAt = Date.now();
        }
      }
      if (data.trackingNumber) order.trackingNumber = data.trackingNumber;
      if (data.notes) order.notes = data.notes;
    }

    // Save the updated order
    const updatedOrder = await order.save();

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
