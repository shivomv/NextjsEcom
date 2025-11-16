import { NextResponse } from 'next/server';
import logger from './logger';

/**
 * Standard error response format
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error, defaultMessage = 'Server error') {
  logger.error('API Error:', error);
  
  // Handle known error types
  if (error instanceof ApiError) {
    return NextResponse.json(
      { 
        success: false,
        message: error.message,
        ...(error.errors && { errors: error.errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: error.statusCode }
    );
  }
  
  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Validation failed',
        errors
      },
      { status: 400 }
    );
  }
  
  // Handle Mongoose duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return NextResponse.json(
      { 
        success: false,
        message: `${field} already exists`
      },
      { status: 400 }
    );
  }
  
  // Handle Mongoose cast errors
  if (error.name === 'CastError') {
    return NextResponse.json(
      { 
        success: false,
        message: 'Invalid ID format'
      },
      { status: 400 }
    );
  }
  
  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || defaultMessage;
  
  return NextResponse.json(
    { 
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    },
    { status: statusCode }
  );
}

/**
 * Async handler wrapper to catch errors
 */
export function asyncHandler(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
