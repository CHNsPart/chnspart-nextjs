import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const contact = await prisma.contact.update({
      where: { 
        id: Number(params.id)
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
  try {
    const contact = await prisma.contact.delete({
      where: { 
        id: Number(params.id)
      },
    });
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Error deleting contact' },
      { status: 500 }
    );
  }
}