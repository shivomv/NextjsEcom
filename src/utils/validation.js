import { z } from 'zod';

/**
 * Check if a string is a valid MongoDB ObjectId
 * @param {string} id - The string to check
 * @returns {boolean} - True if the string is a valid ObjectId
 */
export function isValidObjectId(id) {
  return id && id.match(/^[0-9a-fA-F]{24}$/);
}

/**
 * Validation schemas using Zod
 */

// User validation schemas
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),
  phone: z.string().optional().or(z.literal(''))
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/).optional(),
  password: z.string()
    .min(12)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[@$!%*?&#]/)
    .optional()
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  price: z.number().positive().max(10000000),
  mrp: z.number().positive().max(10000000),
  stock: z.number().int().min(0).max(100000),
  brand: z.string().min(1).max(100),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  image: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  specifications: z.array(z.object({
    name: z.string(),
    value: z.string()
  })).optional(),
  tags: z.array(z.string()).optional()
});

// Review validation schema
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000),
  title: z.string().max(200).optional(),
  images: z.array(z.string().url()).max(5).optional()
});

// Order validation schema
export const orderSchema = z.object({
  orderItems: z.array(z.object({
    product: z.string().regex(/^[0-9a-fA-F]{24}$/),
    name: z.string(),
    qty: z.number().int().positive().max(100),
    price: z.number().positive(),
    image: z.string()
  })).min(1),
  shippingAddress: z.object({
    name: z.string().min(2).max(100),
    addressLine1: z.string().min(5).max(200),
    addressLine2: z.string().max(200).optional(),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    postalCode: z.string().regex(/^[0-9]{6}$/, 'Invalid postal code'),
    country: z.string().min(2).max(100),
    phone: z.string().regex(/^\+?[1-9]\d{9,14}$/)
  }),
  paymentMethod: z.enum(['COD', 'PayPal', 'Stripe', 'RazorPay']),
  itemsPrice: z.number().positive(),
  taxPrice: z.number().min(0),
  shippingPrice: z.number().min(0),
  totalPrice: z.number().positive()
});

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  image: z.string().url().optional(),
  parent: z.string().regex(/^[0-9a-fA-F]{24}$/).optional().nullable(),
  isActive: z.boolean().optional()
});

/**
 * Validate data against a schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {any} data - Data to validate
 * @returns {Object} - { success: boolean, data?: any, errors?: any }
 */
export function validateData(schema, data) {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error && error.errors && Array.isArray(error.errors)) {
      return { 
        success: false, 
        errors: error.errors.map(e => ({
          field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || 'unknown'),
          message: e.message || 'Validation error'
        }))
      };
    }
    return { success: false, errors: [{ field: 'unknown', message: error?.message || 'Validation failed' }] };
  }
}
