import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/userModel';
import { adminMiddleware } from '@/utils/auth';

export async function GET(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();

    // Get counts
    const count = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const customerCount = await User.countDocuments({ role: 'user' });

    return NextResponse.json({
      count,
      adminCount,
      customerCount
    });
  } catch (error) {
    console.error('Error fetching user count:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
