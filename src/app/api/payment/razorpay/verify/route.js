import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import { authMiddleware } from '@/utils/auth';

// Get Razorpay key secret from environment variables
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'qor92M8x9BMwtHZgpGcfoUgT';

/**
 * Verify Razorpay payment
 * POST /api/payment/razorpay/verify
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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json(
        { success: false, message: 'Missing required payment information' },
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

    // Verify Razorpay signature as per official documentation
    // https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/#step-3-verify-signature

    console.log('Verifying payment signature for order:', orderId);
    console.log('Payment ID:', razorpay_payment_id);
    console.log('Order ID:', razorpay_order_id);

    // Create the signature verification string
    const signaturePayload = razorpay_order_id + "|" + razorpay_payment_id;

    // Generate the expected signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(signaturePayload)
      .digest('hex');

    // Verify the signature
    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error('Payment verification failed: Invalid signature');
      console.error('Expected:', expectedSignature);
      console.error('Received:', razorpay_signature);

      return NextResponse.json(
        { success: false, message: 'Payment verification failed: Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Payment signature verified successfully');

    // Update order payment status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'completed',
      update_time: Date.now(),
      email_address: authResult.user.email,
    };

    // Save the updated order
    await order.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: {
        _id: order._id,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
      },
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
