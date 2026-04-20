import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { status } = await request.json();
    const contact = await prisma.contact.update({
      where: {
        id: params.id
      },
      data: {
        status
      },
    });
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Error updating contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const contact = await prisma.contact.delete({
      where: {
        id: params.id
      },
    });
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      {
        error: 'Error deleting contact',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}