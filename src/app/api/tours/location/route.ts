import { NextRequest, NextResponse } from 'next/server';
import { getLocationBasedTours } from '@/lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));

  const tours = await getLocationBasedTours(lat, lng);
  return NextResponse.json(tours);
}
