import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import DeliveryAgency from '@/models/deliveryAgencyModel';
import { adminMiddleware } from '@/utils/auth';

/**
 * @desc    Get all delivery agencies
 * @route   GET /api/admin/delivery-agencies
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    // Build query
    const query = {};
    if (active === 'true') {
      query.isActive = true;
    } else if (active === 'false') {
      query.isActive = false;
    }

    // Get delivery agencies
    const deliveryAgencies = await DeliveryAgency.find(query).sort({ name: 1 });

    return NextResponse.json(deliveryAgencies);
  } catch (error) {
    console.error('Error fetching delivery agencies:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Create a new delivery agency
 * @route   POST /api/admin/delivery-agencies
 * @access  Private/Admin
 */
export async function POST(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (!adminResult.success) {
      return adminResult.status;
    }

    await dbConnect();
    const data = await request.json();

    // Create delivery agency
    const deliveryAgency = await DeliveryAgency.create(data);

    return NextResponse.json(deliveryAgency, { status: 201 });
  } catch (error) {
    console.error('Error creating delivery agency:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

