import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const contact = await prisma.contact.create({
      data: {
        fullname: data.fullname,
        email: data.email,
        message: data.message,
      },
    });
    return NextResponse.json(contact);
  } catch {
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