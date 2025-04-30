import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import Product from '@/models/productModel';
import { authMiddleware } from '@/utils/auth';

// Get Razorpay key secret from environment variables
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'qor92M8x9BMwtHZgpGcfoUgT';

// Function to generate a receipt number
const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RCP${year}${month}${day}${hours}${minutes}${random}`;
};

export async function POST(request) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.orderData || !body.paymentData) {
      return NextResponse.json(
        { success: false, message: 'Order data and payment data are required' },
        { status: 400 }
      );
    }

    const { orderData, paymentData } = body;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentData;

    // Verify Razorpay signature
    const signaturePayload = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(signaturePayload)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error('Payment verification failed: Invalid signature');
      return NextResponse.json(
        { success: false, message: 'Payment verification failed: Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Payment signature verified successfully');

    // Connect to database
    await dbConnect();

    // Generate receipt number
    const receiptNumber = generateReceiptNumber();

    // Create order with payment information
    const order = new Order({
      user: authResult.user._id,
      orderItems: orderData.orderItems,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      itemsPrice: orderData.itemsPrice,
      taxPrice: orderData.taxPrice,
      shippingPrice: orderData.shippingPrice,
      totalPrice: orderData.totalPrice,
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        id: razorpay_payment_id,
        status: 'completed',
        update_time: new Date().toISOString(),
        email_address: authResult.user.email || '',
        gateway: 'Razorpay',
        gateway_order_id: razorpay_order_id,
        gateway_signature: razorpay_signature,
        payment_method_details: {
          method: 'online',
          provider: 'Razorpay',
        },
        currency: 'INR',
        amount: orderData.totalPrice,
        receipt_number: receiptNumber,
      },
    });

    // Save the order
    const createdOrder = await order.save();
    console.log('Order created after payment:', createdOrder._id);

    // Update product stock quantities
    for (const item of orderData.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock = Math.max(0, product.countInStock - item.qty);
        await product.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      _id: createdOrder._id,
      receiptNumber: createdOrder.paymentResult.receipt_number,
      orderNumber: createdOrder.orderNumber,
    });
  } catch (error) {
    console.error('Error creating order after payment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
