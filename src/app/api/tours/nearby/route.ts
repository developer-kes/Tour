import { NextRequest, NextResponse } from 'next/server';
import { getNearbyToursByCategory } from '@/lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mapX = searchParams.get('mapX') || '';
  const mapY = searchParams.get('mapY') || '';
  const contentTypeId = searchParams.get('contentTypeId') || '';

  const tours = await getNearbyToursByCategory(mapX, mapY, contentTypeId);
  return NextResponse.json(tours);
}
