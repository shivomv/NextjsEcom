import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/userModel';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export async function POST(request) {
  try {
    console.log('Login attempt - connecting to database...');
    await dbConnect();
    console.log('Database connected, parsing request body...');

    const { email, password } = await request.json();
    console.log(`Login attempt for email: ${email}`);

    if (!email || !password) {
      console.log('Login failed: Email or password missing');
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check for user
    console.log('Finding user in database...');
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('Login failed: User not found');
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('User found, checking password...');

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log('Login failed: Password does not match');
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('Password matched, generating token...');

    // Create response
    console.log('Creating response with user data...');
    const token = user.getSignedJwtToken();
    console.log('Token generated successfully');

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: token,
    };

    const response = NextResponse.json(userData);
    console.log('Response created, setting cookie...');

    // Set cookie for token (optional, can be used as a backup auth method)
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    console.log('Login successful, returning response');
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        message: error.message || 'Server error',
        details: 'An unexpected error occurred during login. Please try again later.'
      },
      { status: 500 }
    );
  }
}
