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
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Not present');

    const token = authHeader?.split(' ')[1];
    console.log('Token from header:', token ? 'Present' : 'Not present');

    // If token in header, use it
    if (token) {
      console.log('Using token from header');
      return verifyAndGetUser(token);
    }

    // If no token in header, check cookies
    console.log('No token in header, checking cookies');
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('token');
    const cookieToken = tokenCookie?.value;
    console.log('Token from cookie:', cookieToken ? 'Present' : 'Not present');

    if (cookieToken) {
      console.log('Using token from cookie');
      return verifyAndGetUser(cookieToken);
    }

    console.log('No token found in header or cookies');
    return { success: false, message: 'Not authorized, no token' };

  } catch (error) {
    console.error('Auth error:', error);
    return { success: false, message: 'Authentication error' };
  }
};

/**
 * Verify token and get user
 */
const verifyAndGetUser = async (token) => {
  try {
    console.log('Verifying token...');
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Token verification failed');
      return { success: false, message: 'Not authorized, token failed' };
    }
    console.log('Token verified successfully, user ID:', decoded.id);

    // Connect to database
    await dbConnect();

    // Get user from database
    console.log('Finding user in database...');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('User not found in database');
      return { success: false, message: 'User not found' };
    }
    console.log('User found in database, role:', user.role);

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
    return {
      success: false,
      status: NextResponse.json(
        { message: authResult.message },
        { status: 401 }
      )
    };
  }

  return { success: true, user: authResult.user };
};

/**
 * Admin middleware for API routes
 */
export const adminMiddleware = async (request) => {
  const authResult = await isAuthenticated(request);

  if (!authResult.success) {
    return {
      success: false,
      status: NextResponse.json(
        { message: authResult.message },
        { status: 401 }
      )
    };
  }

  const adminResult = await isAdmin(authResult.user);

  if (!adminResult.success) {
    return {
      success: false,
      status: NextResponse.json(
        { message: adminResult.message },
        { status: 403 }
      )
    };
  }

  return { success: true, user: authResult.user };
};
