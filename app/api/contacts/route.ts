import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendContactFormEmails } from '@/lib/email';
import { createOrUpdateClient } from '@/lib/client-service';

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

    // Auto-create or update client and project
    // This runs async but we await it to ensure client is created
    try {
      const clientResult = await createOrUpdateClient({
        fullname: data.fullname,
        email: data.email,
        projectType: data.projectType,
        timeline: data.timeline,
        budget: data.budget,
        message: data.message,
        requirements: data.requirements,
      }, contact.id);
      console.log('✅ Client created/updated successfully:', clientResult.client.email);
    } catch (clientError) {
      // Log but don't fail the contact creation
      console.error('❌ Failed to create/update client:', clientError);
      console.error('Error details:', JSON.stringify(clientError, null, 2));
    }

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