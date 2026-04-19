import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendContactFormEmails } from '@/lib/email';
import { createOrUpdateClient, getAutoTags } from '@/lib/client-service';
import { requireAdmin } from '@/lib/auth-guard';
import { rateLimit } from '@/lib/rate-limit';

// 5 submissions per IP per hour — spams Resend and DB otherwise.
const CONTACT_MAX_PER_HOUR = 5;
const CONTACT_WINDOW_MS = 60 * 60 * 1000;

// Payload size caps to keep hostile bodies from filling the DB.
const MAX_MESSAGE_LEN = 5_000;
const MAX_REQUIREMENTS_LEN = 10_000;
const MAX_FIELD_LEN = 500;

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '';
  if (ip) {
    const limit = rateLimit(`contact:${ip}`, CONTACT_MAX_PER_HOUR, CONTACT_WINDOW_MS);
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.fullname || !data.email || !data.message || !data.projectType || !data.timeline || !data.budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payload sizes — stop oversized garbage before it hits Prisma.
    if (
      typeof data.fullname !== 'string' || data.fullname.length > MAX_FIELD_LEN ||
      typeof data.email !== 'string' || data.email.length > MAX_FIELD_LEN ||
      typeof data.projectType !== 'string' || data.projectType.length > MAX_FIELD_LEN ||
      typeof data.timeline !== 'string' || data.timeline.length > MAX_FIELD_LEN ||
      typeof data.budget !== 'string' || data.budget.length > MAX_FIELD_LEN ||
      typeof data.message !== 'string' || data.message.length > MAX_MESSAGE_LEN ||
      (data.requirements != null && (typeof data.requirements !== 'string' || data.requirements.length > MAX_REQUIREMENTS_LEN))
    ) {
      return NextResponse.json(
        { error: 'Payload exceeds allowed size' },
        { status: 413 }
      );
    }

    // Save contact to database
    const contact = await prisma.contact.create({
      data: {
        fullname: data.fullname,
        email: data.email,
        projectType: data.projectType,
        timeline: data.timeline,
        budget: data.budget,
        message: data.message,
        requirements: data.requirements || null,
      },
    });

    const contactPayload = {
      fullname: data.fullname,
      email: data.email,
      projectType: data.projectType,
      timeline: data.timeline,
      budget: data.budget,
      message: data.message,
      requirements: data.requirements || undefined,
    };

    let clientId: string | undefined;
    try {
      const clientResult = await createOrUpdateClient(contactPayload, contact.id);
      clientId = clientResult.client.id;
      console.log('✅ Client created/updated successfully:', clientResult.client.email);
    } catch (clientError) {
      console.error('❌ Failed to create/update client:', clientError);
      console.error('Error details:', JSON.stringify(clientError, null, 2));
    }

    // Await emails so the serverless runtime stays alive long enough to send them.
    // sendContactFormEmails uses Promise.allSettled internally — it never throws,
    // so a slow/failing email never breaks the form submission.
    await sendContactFormEmails({
      ...contactPayload,
      clientId,
      tags: getAutoTags(contactPayload),
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Error creating contact' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json(
      { error: 'Error fetching contacts' },
      { status: 500 }
    );
  }
}