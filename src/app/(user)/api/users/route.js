import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/userModel';
import { adminMiddleware } from '@/utils/auth';
import { rateLimitMiddleware } from '@/utils/rateLimit';
import { validateData, userRegistrationSchema } from '@/utils/validation';
import { sanitizeInput } from '@/utils/sanitize';
import { handleApiError, ApiError } from '@/utils/errorHandler';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export async function POST(request) {
  try {
    // Check rate limit
    const rateLimit = rateLimitMiddleware('register')(request);
    if (rateLimit.limited) {
      return rateLimit.response;
    }

    await dbConnect();
    const body = await request.json();
    
    // Sanitize input
    const sanitizedData = sanitizeInput(body);
    const { name, email, password, phone } = sanitizedData;
    
    // Validate input
    const validation = validateData(userRegistrationSchema, { name, email, password, phone });
    if (!validation.success) {
      throw new ApiError('Validation failed', 400, validation.errors);
    }

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
    return handleApiError(error, 'Error registering user');
  }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
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
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const keyword = searchParams.get('keyword') || '';

    // Sanitize and build query
    const sanitizedKeyword = keyword ? sanitizeInput(keyword) : '';
    const query = sanitizedKeyword
      ? {
          $or: [
            { name: { $regex: sanitizedKeyword, $options: 'i' } },
            { email: { $regex: sanitizedKeyword, $options: 'i' } },
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
    return handleApiError(error, 'Error fetching users');
  }
}

