import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';

export async function POST(request: Request) {
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
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}