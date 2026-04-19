import { NextResponse } from 'next/server';
import { updateClientCategory } from '@/lib/client-service';
import { requireAdmin } from '@/lib/auth-guard';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const data = await request.json();

    const category = await updateClientCategory(params.id, data);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Error updating category' },
      { status: 500 }
    );
  }
}
