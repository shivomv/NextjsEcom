import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import Product from '@/models/productModel';
import { authMiddleware } from '@/utils/auth';
import mongoose from 'mongoose';

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

    // Start a MongoDB session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check stock availability for all items
      for (const item of data.orderItems) {
        const product = await Product.findById(item.product).session(session);

        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }

        if (product.stock < item.qty) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}`);
        }
      }

      // Create order
      const order = await Order.create([{
        user: user._id,
        orderItems: data.orderItems,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        itemsPrice: data.itemsPrice,
        taxPrice: data.taxPrice,
        shippingPrice: data.shippingPrice,
        totalPrice: data.totalPrice,
        notes: data.notes,
      }], { session });

      // Reduce stock for each product
      for (const item of data.orderItems) {
        const product = await Product.findById(item.product).session(session);

        // Double-check stock availability (in case it changed during transaction)
        if (product.stock < item.qty) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}`);
        }

        // Update stock with validation to prevent negative values
        await Product.findByIdAndUpdate(
          item.product,
          {
            $set: {
              stock: Math.max(0, product.stock - item.qty)
            }
          },
          { session }
        );

        // Log stock reduction for monitoring
        console.log(`Stock reduced for product ${product.name}: ${product.stock} -> ${product.stock - item.qty}`);
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return NextResponse.json(order[0], { status: 201 });
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();

      console.error('Transaction failed:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to process order' },
        { status: 400 }
      );
    }
  } catch (error) {
    // This catch block handles errors outside the transaction
    console.error('Error creating order:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    // Check if it's a validation error (400) or server error (500)
    const statusCode = error.name === 'ValidationError' ? 400 : 500;

    return NextResponse.json(
      {
        message: error.message || 'Server error',
        details: 'An unexpected error occurred while processing your order. Please try again later.'
      },
      { status: statusCode }
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
