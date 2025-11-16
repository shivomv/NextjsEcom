import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/utils/db';
import User from '@/models/userModel';
import { rateLimitMiddleware } from '@/utils/rateLimit';
import { validateData } from '@/utils/validation';
import { sanitizeInput } from '@/utils/sanitize';
import { handleApiError, ApiError } from '@/utils/errorHandler';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request) {
  try {
    const rateLimit = rateLimitMiddleware('login')(request);
    if (rateLimit.limited) {
      return rateLimit.response;
    }

    await dbConnect();

    const body = await request.json();
    const sanitizedData = sanitizeInput(body);
    const { email } = sanitizedData;

    const validation = validateData(forgotPasswordSchema, { email });
    if (!validation.success) {
      throw new ApiError('Validation failed', 400, validation.errors);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive password reset instructions.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Password Reset Request',
    //   text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
    // });

    console.log('Password reset token:', resetToken);
    console.log('Reset URL would be:', `http://localhost:3000/reset-password/${resetToken}`);

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive password reset instructions.',
    });
  } catch (error) {
    return handleApiError(error, 'Failed to process password reset request');
  }
}

