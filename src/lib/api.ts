import { TourDetail, TourIntro, TourItem } from './types';

/* 공통 키와 URL */
const API_KEY = process.env.TOUR_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2';

/* 공통 파라미터 */
const getCommonParams = () => ({
  serviceKey: API_KEY as string,
  MobileOS: 'ETC',
  MobileApp: 'Tourch',
  _type: 'json',
});

/* 엔드포인트 호출 + 파라미터 조합 + 에러 처리를 한 곳에서 담당하는 공통 함수 */
async function fetchTourAPI<T>(
  endpoint: string,
  params: Record<string, string>,
  options: RequestInit = {},
): Promise<T | undefined> {
  const searchParams = new URLSearchParams({
    ...getCommonParams(),
    ...params,
  });

  try {
    const res = await fetch(
      `${BASE_URL}/${endpoint}?${searchParams.toString()}`,
      options,
    );
    const data = await res.json();
    return data.response?.body?.items?.item as T;
  } catch (error) {
    console.error(`${endpoint} 호출 에러:`, error);
    return undefined;
  }
}

/* 검색 */
export async function searchTours(keyword: string): Promise<TourItem[]> {
  const items = await fetchTourAPI<TourItem[]>(
    'searchKeyword2',
    {
      numOfRows: '20',
      pageNo: '1',
      /* 조회순으로 인기있는 데이터만 가져옴 */
      arrange: 'Q',
      keyword: keyword,
    },
    { cache: 'no-store' },
  );

  return items || [];
}

/* 인기 관광지 */
export async function getPopularTours(): Promise<TourItem[]> {
  const items = await fetchTourAPI<TourItem[]>(
    'areaBasedList2',
    {
      numOfRows: '6',
      pageNo: '1',
      arrange: 'Q',
      contentTypeId: '12',
    },
    { next: { revalidate: 3600 } },
  );

  return items || [];
}

/* 축제와 맛집 */
export async function getToursByCategory(
  contentTypeId: string,
  limit: number = 6,
): Promise<TourItem[]> {
  const items = await fetchTourAPI<TourItem[]>(
    'areaBasedList2',
    {
      pageNo: '1',
      arrange: 'P',
      contentTypeId: contentTypeId,
      numOfRows: limit.toString(),
    },
    { next: { revalidate: 3600 } },
  );

  return items || [];
}

/* 목록 */
export async function getCategoryTours(
  contentTypeId: string,
  pageNo: number = 1,
): Promise<TourItem[]> {
  const items = await fetchTourAPI<TourItem[]>(
    'areaBasedList2',
    {
      numOfRows: '12',
      pageNo: pageNo.toString(),
      arrange: 'Q',
      /* 전체 카테고리일 땐 contentTypeId 자체를 보내지 않음 */
      ...(contentTypeId ? { contentTypeId } : {}),
    },
    { next: { revalidate: 3600 } },
  );

  return items || [];
}

/* 상세 페이지 */
export async function getTourDetail(
  contentId: string,
): Promise<TourDetail | null> {
  const items = await fetchTourAPI<TourDetail[]>(
    'detailCommon2',
    { contentId: contentId },
    { next: { revalidate: 3600 } },
  );

  return items?.[0] || null;
}

/* 상세 페이지의 기타 정보 */
export async function getTourIntro(
  contentId: string,
  contentTypeId: string,
): Promise<TourIntro | null> {
  const items = await fetchTourAPI<TourIntro[]>(
    'detailIntro2',
    { contentId: contentId, contentTypeId: contentTypeId },
    { next: { revalidate: 3600 } },
  );

  return items?.[0] || null;
}

/* 상세 페이지 주변 시설 추천 */
export async function getNearbyToursByCategory(
  mapX: string,
  mapY: string,
  contentTypeId: string,
): Promise<TourItem[]> {
  const items = await fetchTourAPI<TourItem[]>(
    'locationBasedList2',
    {
      numOfRows: '5',
      pageNo: '1',
      arrange: 'Q',
      mapX: mapX,
      mapY: mapY,
      radius: '3000',
      contentTypeId: contentTypeId,
    },
    { next: { revalidate: 3600 } },
  );

  return items || [];
}

/* 위치 */
export async function getLocationBasedTours(
  lat: number,
  lng: number,
): Promise<TourItem[]> {
  const items = await fetchTourAPI<TourItem[]>(
    'locationBasedList2',
    {
      numOfRows: '20',
      pageNo: '1',
      arrange: 'A',
      mapX: lng.toString(),
      mapY: lat.toString(),
      radius: '5000',
    },
    { cache: 'no-store' },
  );

  return items || [];
}
