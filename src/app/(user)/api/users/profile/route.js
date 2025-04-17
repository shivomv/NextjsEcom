import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/userModel';
import { authMiddleware } from '@/utils/auth';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export async function GET(request) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();
    const user = authResult.user;

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export async function PUT(request) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult.status) {
      return authResult;
    }

    await dbConnect();
    const user = authResult.user;
    const { name, email, phone, password } = await request.json();

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = password;

    // Save updated user
    const updatedUser = await user.save();

    return NextResponse.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      addresses: updatedUser.addresses,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
