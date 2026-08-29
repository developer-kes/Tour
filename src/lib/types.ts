/* 목록 API 공통 응답 (검색, 카테고리별 목록, 위치기반, 주변시설 등) */
export interface TourItem {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  firstimage: string;
  mapx: string;
  mapy: string;
  dist?: string;
}

/* 상세 페이지 공통 정보 (detailCommon2) */
export interface TourDetail {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  firstimage: string;
  overview: string;
  tel: string;
  homepage: string;
  mapx: string;
  mapy: string;
}

/* 상세 페이지 소개 정보 (detailIntro2) - 숫자코드마다 필드가 달라서 인덱스 시그니처로 처리 */
export interface TourIntro {
  [key: string]: string;
}

/* 찜 목록에 저장되는 데이터 (Like.tsx에서 setDoc하는 모양) */
export interface WishlistItem {
  id: string;
  title: string;
  image: string;
  address: string;
  createdAt: string;
}
