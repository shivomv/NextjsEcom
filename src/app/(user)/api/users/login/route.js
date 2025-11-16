import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/userModel';
import { rateLimitMiddleware } from '@/utils/rateLimit';
import { validateData, userLoginSchema } from '@/utils/validation';
import { sanitizeInput } from '@/utils/sanitize';
import { handleApiError, ApiError } from '@/utils/errorHandler';
import logger from '@/utils/logger';

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export async function POST(request) {
  try {
    // Check rate limit
    const rateLimit = rateLimitMiddleware('login')(request);
    if (rateLimit.limited) {
      return rateLimit.response;
    }

    logger.log('Login request received');
    await dbConnect();
    logger.log('Database connected, parsing request body...');

    const body = await request.json();
    const sanitizedData = sanitizeInput(body);
    const { email, password } = sanitizedData;
    
    // Validate input
    const validation = validateData(userLoginSchema, { email, password });
    if (!validation.success) {
      throw new ApiError('Validation failed', 400, validation.errors);
    }
    
    logger.log(`Login attempt for email: ${email}`);

    // Check if user exists
    logger.log('Finding user in database...');
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      logger.log('User not found');
      throw new ApiError('Invalid credentials', 401);
    }
    logger.log('User found, checking password...');

    // Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      logger.log('Password does not match');
      throw new ApiError('Invalid credentials', 401);
    }
    logger.log('Password matches, generating token...');

    // Generate token
    const token = user.getSignedJwtToken();
    logger.log('Token generated successfully');

    // Return user data and token
    logger.log('Sending response...');
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    });
  } catch (error) {
    return handleApiError(error, 'Login error');
  }
}

