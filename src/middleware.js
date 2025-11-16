import { NextResponse } from 'next/server';
import { isValidObjectId } from './utils/validation';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Block test/debug routes in production
  if (process.env.NODE_ENV === 'production') {
    const testRoutes = [
      '/test-categories',
      '/razorpay-test',
      '/cloudinary-test',
      '/cloudinary-status',
      '/db-test',
      '/test-upload',
      '/upload-test'
    ];
    
    if (testRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/404', request.url));
    }
  }

  // Check if this is a product detail page using slug format
  if (pathname.startsWith('/products/') && !pathname.includes('/reviews')) {
    const slug = pathname.split('/')[2];
    
    // If the slug is not a valid MongoDB ObjectId, we need to redirect
    if (slug && !isValidObjectId(slug)) {
      try {
        // Try to fetch the product by slug to get its ID
        const response = await fetch(`${request.nextUrl.origin}/api/products/slug/${slug}`);
        
        if (response.ok) {
          const product = await response.json();
          // Redirect to the ID-based URL
          return NextResponse.redirect(new URL(`/products/${product._id}`, request.url));
        }
      } catch (error) {
        console.error('Error in middleware:', error);
      }
    }
  }

  return NextResponse.next();
}

// Run middleware on all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
