/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis or a dedicated service
 */

const rateLimitMap = new Map();

/**
 * Rate limit configuration
 */
const RATE_LIMITS = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  register: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 requests per hour
  api: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  upload: { windowMs: 60 * 60 * 1000, maxRequests: 20 }, // 20 uploads per hour
  payment: { windowMs: 60 * 60 * 1000, maxRequests: 10 } // 10 payment attempts per hour
};

/**
 * Get client identifier from request
 */
function getClientId(request) {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  return forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
}

/**
 * Clean up old entries from rate limit map
 */
function cleanup() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanup, 5 * 60 * 1000);
}

/**
 * Check if request should be rate limited
 * @param {Request} request - Next.js request object
 * @param {string} limitType - Type of rate limit to apply
 * @returns {Object} - { limited: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(request, limitType = 'api') {
  const config = RATE_LIMITS[limitType] || RATE_LIMITS.api;
  const clientId = getClientId(request);
  const key = `${limitType}:${clientId}`;
  const now = Date.now();
  
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    // Create new record
    const resetTime = now + config.windowMs;
    rateLimitMap.set(key, {
      count: 1,
      resetTime
    });
    
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime
    };
  }
  
  // Increment count
  record.count++;
  
  if (record.count > config.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetTime: record.resetTime
    };
  }
  
  return {
    limited: false,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime
  };
}

/**
 * Rate limit middleware for API routes
 */
export function rateLimitMiddleware(limitType = 'api') {
  return (request) => {
    const result = checkRateLimit(request, limitType);
    
    if (result.limited) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      return {
        limited: true,
        response: new Response(
          JSON.stringify({ 
            message: 'Too many requests, please try again later',
            retryAfter 
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': RATE_LIMITS[limitType].maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': result.resetTime.toString()
            }
          }
        )
      };
    }
    
    return {
      limited: false,
      headers: {
        'X-RateLimit-Limit': RATE_LIMITS[limitType].maxRequests.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.resetTime.toString()
      }
    };
  };
}
