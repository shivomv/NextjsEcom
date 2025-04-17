import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/userModel';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create response
    const response = NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: user.getSignedJwtToken(),
    });

    // Set cookie for token (optional, can be used as a backup auth method)
    response.cookies.set({
      name: 'token',
      value: user.getSignedJwtToken(),
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
