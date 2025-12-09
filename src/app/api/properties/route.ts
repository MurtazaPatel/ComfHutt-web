import { NextResponse } from 'next/server';
import { generateProperties } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '15', 10);
  const regionsParam = searchParams.get('regions');

  // Generate a large pool to filter from
  let properties = generateProperties(50); 

  if (regionsParam) {
    const regions = regionsParam.toLowerCase().split(',');
    properties = properties.filter(p => 
      regions.some(r => p.state.toLowerCase().includes(r) || p.city.toLowerCase().includes(r))
    );
  }

  // Apply limit
  const result = properties.slice(0, limit);

  return NextResponse.json(result);
}