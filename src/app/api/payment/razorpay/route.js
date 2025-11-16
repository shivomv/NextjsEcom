import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import { authMiddleware } from '@/utils/auth';
import razorpayConfig from '@/config/razorpay';

// Initialize Razorpay instance with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || razorpayConfig.key_id,
  key_secret: process.env.RAZORPAY_KEY_SECRET || razorpayConfig.key_secret,
});

// Log which key is being used (for debugging, without exposing the secret)
console.log('Using Razorpay Key ID:', razorpay.key_id);

/**
 * Create a new Razorpay order
 * POST /api/payment/razorpay
 */
export async function POST(request) {
  try {
    // Check if authenticated
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return authResult.status;
    }

    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Find the order in the database
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify the order belongs to the authenticated user
    if (order.user.toString() !== authResult.user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access to this order' },
        { status: 403 }
      );
    }

    // Check if order is already paid
    if (order.isPaid) {
      return NextResponse.json(
        { success: false, message: 'Order is already paid' },
        { status: 400 }
      );
    }

    // Create Razorpay order as per official documentation
    // https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/

    // Amount in smallest currency unit (paise for INR)
    const amount = Math.round(order.totalPrice * 100);
    const currency = 'INR';

    // Create order options as per Razorpay docs
    const options = {
      amount,
      currency,
      receipt: `receipt_order_${orderId}`,
      notes: {
        orderNumber: order._id.toString(),
        customerName: order.shippingAddress?.name || authResult.user.name || '',
        customerEmail: authResult.user.email || '',
        customerPhone: order.shippingAddress?.phone || '',
        shippingAddress: `${order.shippingAddress?.addressLine1}, ${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}`,
      }
    };

    console.log('Creating Razorpay order with options:', {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
    });

    // Create Razorpay order
    console.log('Sending order creation request to Razorpay API');
    const razorpayOrder = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', razorpayOrder.id);
    console.log('Razorpay order details:', {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      status: razorpayOrder.status
    });

    // Return data needed for the frontend checkout
    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      key: razorpay.key_id,
      amount: amount,
      currency: currency,
      name: 'Prashasak Samiti',
      description: `Order #${order._id.toString().slice(-6)}`,
      image: '/images/logo.png',
      prefill: {
        name: order.shippingAddress?.name || authResult.user.name || '',
        email: authResult.user.email || '',
        contact: order.shippingAddress?.phone || '',
      },
      notes: options.notes,
      theme: {
        color: '#6602C2',
      },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

