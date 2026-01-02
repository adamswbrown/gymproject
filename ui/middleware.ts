import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Note: We can't access localStorage in middleware, so we only check cookies/headers
  // Client-side auth checks happen in the components
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Protected routes that require authentication
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isScheduleRoute = pathname.startsWith('/schedule');

  // If accessing dashboard or schedule without token, redirect to login
  if ((isDashboardRoute || isScheduleRoute) && !token) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Don't redirect from login/register in middleware - let client-side handle it
  // This prevents redirect loops since token is in localStorage, not cookies

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/schedule/:path*',
    '/login',
    '/register',
  ],
};


