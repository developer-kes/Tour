import { NextRequest, NextResponse } from 'next/server';
import { getCategoryTours } from '@/lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contentTypeId = searchParams.get('contentTypeId') || '';
  const pageNo = Number(searchParams.get('pageNo')) || 1;

  const tours = await getCategoryTours(contentTypeId, pageNo);
  return NextResponse.json(tours);
}
