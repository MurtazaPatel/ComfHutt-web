import { NextResponse } from 'next/server';
import { generateProperties } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
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

  // Calculate pagination
  const total = properties.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  // Apply slice
  const data = properties.slice(start, end);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
}