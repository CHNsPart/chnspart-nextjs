import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith('/mmm')) {
    // Skip the login page itself
    if (request.nextUrl.pathname === '/mmm') {
      return NextResponse.next();
    }

    const authToken = request.cookies.get('admin-token');
    
    if (!authToken) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/mmm', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mmm/:path*']
};