import { NextResponse } from 'next/server';
import { isValidObjectId } from './utils/validation';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

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

// Only run middleware on product detail pages
export const config = {
  matcher: '/products/:path*',
};
