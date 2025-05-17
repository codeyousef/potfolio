import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createDirectus, rest, staticToken } from '@directus/sdk';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip middleware for static files, API routes, and login page
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/static') ||
    path === '/admin/login'
  ) {
    return NextResponse.next();
  }

  // Check if the path starts with /admin
  if (path.startsWith('/admin')) {
    try {
      // Get the auth token from cookies
      const token = request.cookies.get('directus_refresh_token')?.value;
      
      if (!token) {
        // No token, redirect to login
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', path);
        return NextResponse.redirect(loginUrl);
      }
      
      // Verify the token with Directus
      const client = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
        .with(staticToken(token))
        .with(rest());
      
      // Try to get the current user
      await client.users.me.read();
      
      // User is authenticated, continue to the requested page
      return NextResponse.next();
    } catch (error) {
      console.error('Authentication error:', error);
      // Token is invalid or expired, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', path);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // For non-admin routes, continue as normal
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
