import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import DeliveryAgency from '@/models/deliveryAgencyModel';
import { adminMiddleware } from '@/utils/auth';

/**
 * @desc    Get delivery agency by ID
 * @route   GET /api/admin/delivery-agencies/:id
 * @access  Private/Admin
 */
export async function GET(request, context) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();
    const { id } = await context.params;

    const deliveryAgency = await DeliveryAgency.findById(id);

    if (!deliveryAgency) {
      return NextResponse.json(
        { message: 'Delivery agency not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(deliveryAgency);
  } catch (error) {
    console.error('Error fetching delivery agency:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Update delivery agency
 * @route   PUT /api/admin/delivery-agencies/:id
 * @access  Private/Admin
 */
export async function PUT(request, context) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();
    const { id } = await context.params;
    const data = await request.json();

    const deliveryAgency = await DeliveryAgency.findById(id);

    if (!deliveryAgency) {
      return NextResponse.json(
        { message: 'Delivery agency not found' },
        { status: 404 }
      );
    }

    // Update delivery agency fields
    Object.keys(data).forEach(key => {
      deliveryAgency[key] = data[key];
    });

    // Save updated delivery agency
    const updatedDeliveryAgency = await deliveryAgency.save();

    return NextResponse.json(updatedDeliveryAgency);
  } catch (error) {
    console.error('Error updating delivery agency:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Delete delivery agency
 * @route   DELETE /api/admin/delivery-agencies/:id
 * @access  Private/Admin
 */
export async function DELETE(request, context) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();
    const { id } = await context.params;

    const deliveryAgency = await DeliveryAgency.findById(id);

    if (!deliveryAgency) {
      return NextResponse.json(
        { message: 'Delivery agency not found' },
        { status: 404 }
      );
    }

    await deliveryAgency.deleteOne();

    return NextResponse.json({ message: 'Delivery agency removed' });
  } catch (error) {
    console.error('Error deleting delivery agency:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
