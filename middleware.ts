import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/mmm')) {
    // Login page itself is always accessible
    if (request.nextUrl.pathname === '/mmm') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin-token')?.value;

    if (!token || !(await verifyToken(token))) {
      // Invalid or missing token — redirect to login
      return NextResponse.redirect(new URL('/mmm', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mmm/:path*'],
};
