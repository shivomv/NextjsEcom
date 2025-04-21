import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import { authMiddleware, adminMiddleware } from '@/utils/auth';

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export async function GET(request, context) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();
    const { id } = await context.params;
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
export async function PUT(request, context) {
  try {
    // Check authentication and admin status
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();
    const { id } = await context.params;
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
      if (data.status) {
        // Validate status transitions
        const validTransitions = {
          'Pending': ['Pending', 'Processing', 'Cancelled'],
          'Processing': ['Processing', 'Shipped', 'Cancelled'],
          'Shipped': ['Shipped', 'Delivered', 'Cancelled'],
          'Delivered': ['Delivered', 'Cancelled'], // Can only cancel after delivery in special cases
          'Cancelled': ['Cancelled'] // Cannot transition from cancelled
        };

        if (!validTransitions[order.status].includes(data.status)) {
          return NextResponse.json(
            { message: `Cannot change order status from ${order.status} to ${data.status}` },
            { status: 400 }
          );
        }

        // Only update status if it's actually changing
        if (order.status !== data.status) {
          // Add status change to history
          if (!order.statusHistory) {
            order.statusHistory = [];
          }

          const currentTime = new Date();

          order.statusHistory.push({
            status: data.status,
            timestamp: currentTime,
            note: data.notes || `Status changed from ${order.status} to ${data.status}`
          });

          // Update statusTimeline
          if (!order.statusTimeline) {
            // Initialize statusTimeline if it doesn't exist
            order.statusTimeline = {
              Pending: { timestamp: null, completed: false },
              Processing: { timestamp: null, completed: false },
              Shipped: { timestamp: null, completed: false },
              Delivered: { timestamp: null, completed: false },
              Cancelled: { timestamp: null, completed: false }
            };
          }

          // Update the current status in the timeline
          order.statusTimeline[data.status] = {
            timestamp: currentTime,
            completed: true
          };

          // Handle special case for Cancelled status
          if (data.status === 'Cancelled') {
            // Mark all other statuses as not completed if order is cancelled
            ['Processing', 'Shipped', 'Delivered'].forEach(status => {
              if (!order.statusTimeline[status].completed) {
                order.statusTimeline[status].completed = false;
                order.statusTimeline[status].timestamp = null;
              }
            });
          } else {
            // For normal flow, mark previous statuses as completed
            const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered'];
            const currentIndex = statusOrder.indexOf(data.status);

            // Mark all previous statuses as completed
            for (let i = 0; i < currentIndex; i++) {
              const prevStatus = statusOrder[i];
              if (!order.statusTimeline[prevStatus].completed) {
                order.statusTimeline[prevStatus] = {
                  timestamp: currentTime, // Use current time if not previously set
                  completed: true
                };
              }
            }
          }

          // Set status and update related timestamps
          order.status = data.status;

          // If status is Delivered, validate payment and set deliveredAt
          if (data.status === 'Delivered') {
            // All delivered orders must be marked as paid
            // This ensures consistency in the database
            order.isPaid = true;

            // Only set paidAt if it wasn't already set
            if (!order.paidAt) {
              order.paidAt = Date.now();

              // Add a payment received entry to the status history
              order.statusHistory.push({
                status: 'Payment Received',
                timestamp: new Date(),
                note: order.paymentMethod === 'COD' ? 'Payment received on delivery (COD)' : 'Payment marked as received on delivery'
              });
            }

            // Set delivered status
            if (!order.deliveredAt) {
              order.deliveredAt = Date.now();
              order.isDelivered = true;
            }
          }
        }

        // If status is changed from Shipped to something else (except Delivered),
        // clear tracking information
        if (order.status !== 'Shipped' && order.status !== 'Delivered' &&
            data.status !== 'Shipped' && data.status !== 'Delivered') {
          // Only clear if explicitly not provided in the update
          if (!data.courier && !data.trackingNumber) {
            order.courier = undefined;
            order.trackingNumber = undefined;
          }
        }
      }

      // Update payment status
      if (data.isPaid !== undefined && order.isPaid !== data.isPaid) {
        order.isPaid = data.isPaid;
        if (data.isPaid && !order.paidAt) {
          order.paidAt = Date.now();

          // Add a payment received entry to the status history
          order.statusHistory.push({
            status: 'Payment Received',
            timestamp: new Date(),
            note: data.notes || 'Payment marked as received by admin'
          });
        }
      }

      // Update delivery status
      if (data.isDelivered !== undefined) {
        order.isDelivered = data.isDelivered;
        if (data.isDelivered && !order.deliveredAt) {
          order.deliveredAt = Date.now();
        }
      }

      // Update tracking information
      if (data.courier) {
        order.courier = data.courier;
      }

      // Only allow tracking number update if courier is set
      if (data.trackingNumber) {
        if (!order.courier && !data.courier) {
          return NextResponse.json(
            { message: 'Please select a courier before adding tracking number' },
            { status: 400 }
          );
        }
        order.trackingNumber = data.trackingNumber;
      }

      // Update notes
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
