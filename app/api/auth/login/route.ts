import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { rateLimit, resetRateLimit } from '@/lib/rate-limit';

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const key = `login:${ip}`;

  // Gate first — block further attempts if over limit, no DB/compare work.
  const limit = rateLimit(key, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfter) },
      }
    );
  }

  const { username, password } = await request.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = await createToken();
    cookies().set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Successful login — clear the counter so a valid user isn't penalized later.
    resetRateLimit(key);

    return NextResponse.json({ success: true });
  }

  // Failed attempt — counter stays incremented (from the rateLimit call above).
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
