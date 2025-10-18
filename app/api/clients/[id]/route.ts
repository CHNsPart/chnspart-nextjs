import { NextResponse } from 'next/server';
import { getClientById, updateClient } from '@/lib/client-service';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await getClientById(params.id);

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Error fetching client' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const client = await updateClient(params.id, data);
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Error updating client' },
      { status: 500 }
    );
  }
}
