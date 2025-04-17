import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/userModel';
import { adminMiddleware } from '@/utils/auth';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password, phone } = await request.json();

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    if (user) {
      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: user.getSignedJwtToken(),
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { message: 'Invalid user data' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
export async function GET(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const keyword = searchParams.get('keyword') || '';

    // Build query
    const query = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } },
          ],
        }
      : {};

    // Count total users
    const count = await User.countDocuments(query);

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 });

    return NextResponse.json({
      users,
      page,
      pages: Math.ceil(count / limit),
      count,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
