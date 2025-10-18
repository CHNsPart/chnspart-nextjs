import { NextResponse } from 'next/server';
import { getClients } from '@/lib/client-service';

export async function GET(request: Request) {
  try {
    console.log('📥 GET /api/clients - Request received');
    const { searchParams } = new URL(request.url);

    const filters = {
      status: searchParams.get('status') || undefined,
      budgetTier: searchParams.get('budgetTier') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      search: searchParams.get('search') || undefined,
    };

    console.log('🔍 Filters:', filters);

    const clients = await getClients(filters);
    console.log(`✅ Successfully fetched ${clients.length} clients`);
    return NextResponse.json(clients);
  } catch (error) {
    console.error('❌ Error fetching clients in API route:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    return NextResponse.json(
      {
        error: 'Error fetching clients',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
