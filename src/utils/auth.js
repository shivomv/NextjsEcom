import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import User from '@/models/userModel';
import dbConnect from '@/utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

/**
 * Generate JWT token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Check if request is authenticated
 */
export const isAuthenticated = async (request) => {
  try {
    // Get token from authorization header
    const token = request.headers.get('authorization')?.split(' ')[1];

    // If no token in header, check cookies
    const cookieStore = cookies();
    const cookieToken = !token ? cookieStore.get('token')?.value : null;

    if (!token && !cookieToken) {
      return { success: false, message: 'Not authorized, no token' };
    }

    // Verify token
    const decoded = verifyToken(token || cookieToken);
    if (!decoded) {
      return { success: false, message: 'Not authorized, token failed' };
    }

    // Connect to database
    await dbConnect();

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Auth error:', error);
    return { success: false, message: 'Authentication error' };
  }
};

/**
 * Check if user is admin
 */
export const isAdmin = async (user) => {
  if (!user) {
    return { success: false, message: 'User not provided' };
  }

  if (user.role !== 'admin') {
    return { success: false, message: 'Not authorized as admin' };
  }

  return { success: true };
};

/**
 * Authentication middleware for API routes
 */
export const authMiddleware = async (request) => {
  const authResult = await isAuthenticated(request);

  if (!authResult.success) {
    return NextResponse.json(
      { message: authResult.message },
      { status: 401 }
    );
  }

  return { user: authResult.user };
};

/**
 * Admin middleware for API routes
 */
export const adminMiddleware = async (request) => {
  const authResult = await isAuthenticated(request);

  if (!authResult.success) {
    return NextResponse.json(
      { message: authResult.message },
      { status: 401 }
    );
  }

  const adminResult = await isAdmin(authResult.user);

  if (!adminResult.success) {
    return NextResponse.json(
      { message: adminResult.message },
      { status: 403 }
    );
  }

  return { user: authResult.user };
};
