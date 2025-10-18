import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendContactFormEmails } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.fullname || !data.email || !data.message || !data.projectType || !data.timeline || !data.budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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

    // Send emails (don't await to avoid blocking response)
    // Emails are sent asynchronously and failures won't block the submission
    sendContactFormEmails({
      fullname: data.fullname,
      email: data.email,
      projectType: data.projectType,
      timeline: data.timeline,
      budget: data.budget,
      message: data.message,
      requirements: data.requirements || undefined,
    }).catch((error) => {
      // Log email errors but don't fail the request
      console.error('Failed to send emails:', error);
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