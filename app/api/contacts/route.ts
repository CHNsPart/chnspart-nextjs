import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendContactFormEmails } from '@/lib/email';
import { createOrUpdateClient, getAutoTags } from '@/lib/client-service';

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

    // Send emails (don't await to avoid blocking response)
    sendContactFormEmails({
      ...contactPayload,
      clientId,
      tags: getAutoTags(contactPayload),
    }).catch((error) => {
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