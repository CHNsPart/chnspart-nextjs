import { NextResponse } from 'next/server';
import { addClientTag, removeClientTag } from '@/lib/client-service';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { tag } = await request.json();

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag is required' },
        { status: 400 }
      );
    }

    const result = await addClientTag(params.id, tag);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding tag:', error);
    return NextResponse.json(
      { error: 'Error adding tag' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { tag } = await request.json();

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag is required' },
        { status: 400 }
      );
    }

    await removeClientTag(params.id, tag);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing tag:', error);
    return NextResponse.json(
      { error: 'Error removing tag' },
      { status: 500 }
    );
  }
}
