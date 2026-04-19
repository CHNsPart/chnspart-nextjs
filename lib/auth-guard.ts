import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

/**
 * Verifies the admin session cookie. Returns `null` if the caller is authenticated,
 * or a 401 `NextResponse` that the route handler should return.
 *
 * Usage:
 *   const unauthorized = await requireAdmin();
 *   if (unauthorized) return unauthorized;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const token = cookies().get('admin-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const valid = await verifyToken(token);
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
