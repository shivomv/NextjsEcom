import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { authMiddleware } from '@/utils/auth';

// Initialize Razorpay instance with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mZovKJGWt2aMBd',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'qor92M8x9BMwtHZgpGcfoUgT',
});

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
    if (!body.amount) {
      return NextResponse.json(
        { success: false, message: 'Amount is required' },
        { status: 400 }
      );
    }

    // Create Razorpay order options
    const options = {
      amount: Math.round(body.amount * 100), // Convert to paise
      currency: body.currency || 'INR',
      receipt: body.receipt || `receipt_${Date.now()}`,
      notes: body.notes || {},
    };

    console.log('Creating Razorpay payment with options:', {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);
    console.log('Razorpay order created:', razorpayOrder.id);

    // Return data needed for the frontend checkout
    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      key: razorpay.key_id,
      amount: options.amount,
      currency: options.currency,
      name: 'Prashasak Samiti',
      description: 'Purchase from Prashasak Samiti',
      image: '/images/logo.png',
      prefill: {
        name: authResult.user.name || '',
        email: authResult.user.email || '',
        contact: body.contact || '',
      },
      notes: options.notes,
      theme: {
        color: '#6602C2',
      },
    });
  } catch (error) {
    console.error('Error creating Razorpay payment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}
