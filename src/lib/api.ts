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

/* 검색 */
export async function searchTours(keyword: string) {
  const params = new URLSearchParams({
    ...getCommonParams(),
    numOfRows: '20',
    pageNo: '1',
    /* 조회순으로 인기있는 데이터만 가져옴 */
    arrange: 'Q',
    keyword: keyword,
  });

  try {
    const res = await fetch(`${BASE_URL}/searchKeyword2?${params.toString()}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.response?.body?.items?.item || [];
  } catch (error) {
    console.error('검색 호출 에러:', error);
    return [];
  }
}

/* 인기 관광지 */
export async function getPopularTours() {
  const params = new URLSearchParams({
    ...getCommonParams(),
    numOfRows: '6',
    pageNo: '1',
    arrange: 'Q',
    contentTypeId: '12',
  });

  try {
    const res = await fetch(`${BASE_URL}/areaBasedList2?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.response?.body?.items?.item || [];
  } catch (error) {
    console.error('인기 데이터 호출 에러:', error);
    return [];
  }
}

/* 축제와 맛집 */
export async function getToursByCategory(
  contentTypeId: string,
  limit: number = 6,
) {
  const params = new URLSearchParams({
    ...getCommonParams(),
    pageNo: '1',
    arrange: 'P',
    contentTypeId: contentTypeId,
    numOfRows: limit.toString(),
  });

  try {
    const res = await fetch(`${BASE_URL}/areaBasedList2?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.response?.body?.items?.item || [];
  } catch (error) {
    console.error('축제와 맛집 데이터 호출 에러:', error);
    return [];
  }
}

/* 목록 */
export async function getCategoryTours(
  contentTypeId: string,
  pageNo: number = 1,
) {
  const params = new URLSearchParams({
    ...getCommonParams(),
    numOfRows: '12',
    pageNo: pageNo.toString(),
    arrange: 'Q',
  });

  if (contentTypeId) params.append('contentTypeId', contentTypeId);

  try {
    const res = await fetch(`${BASE_URL}/areaBasedList2?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.response?.body?.items?.item || [];
  } catch (error) {
    console.error('목록 호출 에러:', error);
    return [];
  }
}

/* 상세 페이지 */
export async function getTourDetail(contentId: string) {
  const params = new URLSearchParams({
    ...getCommonParams(),
    contentId: contentId,
  });

  try {
    const res = await fetch(`${BASE_URL}/detailCommon2?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.response?.body?.items?.item?.[0] || null;
  } catch (error) {
    console.error('상세 정보 호출 에러:', error);
    return null;
  }
}

/* 상세 페이지의 기타 정보 */
export async function getTourIntro(contentId: string, contentTypeId: string) {
  const params = new URLSearchParams({
    ...getCommonParams(),
    contentId: contentId,
    contentTypeId: contentTypeId,
  });

  try {
    const res = await fetch(`${BASE_URL}/detailIntro2?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.response?.body?.items?.item?.[0] || null;
  } catch (error) {
    console.error('상세 소개 호출 에러:', error);
    return null;
  }
}

/* 상세 페이지 주변 시설 추천 */
export async function getNearbyToursByCategory(
  mapX: string,
  mapY: string,
  contentTypeId: string,
) {
  const params = new URLSearchParams({
    ...getCommonParams(),
    numOfRows: '5',
    pageNo: '1',
    arrange: 'Q',
    mapX: mapX,
    mapY: mapY,
    radius: '3000',
    contentTypeId: contentTypeId,
  });

  try {
    const res = await fetch(
      `${BASE_URL}/locationBasedList2?${params.toString()}`,
      {
        next: { revalidate: 3600 },
      },
    );
    const data = await res.json();
    return data.response?.body?.items?.item || [];
  } catch (error) {
    console.error('주변 시설 호출 에러:', error);
    return [];
  }
}

/* 위치 */
export async function getLocationBasedTours(lat: number, lng: number) {
  const params = new URLSearchParams({
    ...getCommonParams(),
    numOfRows: '20',
    pageNo: '1',
    arrange: 'A',
    mapX: lng.toString(),
    mapY: lat.toString(),
    radius: '5000',
  });

  try {
    const res = await fetch(
      `${BASE_URL}/locationBasedList2?${params.toString()}`,
      {
        cache: 'no-store',
      },
    );
    const data = await res.json();
    return data.response?.body?.items?.item || [];
  } catch (error) {
    console.error('위치 기반 호출 에러:', error);
    return [];
  }
}
