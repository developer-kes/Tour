/* CSS */
import styles from './page.module.css';

/* API */
import { getTourDetail, getTourIntro } from '@/lib/api';

/* 타입 */
import { TourDetail, TourIntro } from '@/lib/types';

/* 컴포넌트 */
import DetailMap from '@/components/DetailMap';
import NearbySection from '@/components/Near';
import LikeButton from '@/components/Like';
import DetailImage from '@/components/DetailImage';

/* 숫자코드 별로 들어갈 데이터 타입 */
interface FieldDefinition {
  p: string;
  a: string;
  r: string;
}
interface FieldMap {
  [key: string]: FieldDefinition;
}

/* 퀵 메뉴에 들어갈 데이터 로직 */
const getQuickInfo = (intro: TourIntro | null, typeId: string) => {
  /* 초기 값 */
  const info = {
    parking: '정보 없음',
    pet: '정보 없음',
    rest: '연중무휴',
  };

  /* 값이 없으면 초기 값 표시 */
  if (!intro) return info;

  /* 숫자코드 별로 다른 데이터 가져오도록 매핑 */
  const fieldMap: FieldMap = {
    '12': { p: 'parkingtoolani', a: 'chkpet', r: 'restdate' },
    '14': { p: 'parkingculture', a: 'chkpetculture', r: 'restdateculture' },
    '15': { p: 'bookingplace', a: '', r: 'eventenddate' },
    '28': { p: 'parkingleports', a: 'chkpetleports', r: 'restdateleports' },
    '32': { p: 'parkinglodging', a: 'chkpetlodging', r: '' },
    '38': { p: 'parkingshopping', a: 'chkpetshopping', r: 'restdateshopping' },
    '39': { p: 'parkingfood', a: 'chkpetfood', r: 'restdatefood' },
    '25': { p: '', a: '', r: '' },
  };

  const fields = fieldMap[typeId];

  if (fields) {
    info.parking = intro[fields.p] || info.parking;
    info.pet = intro[fields.a] || info.pet;
    info.rest = intro[fields.r] || info.rest;
  }

  /* 삼항 연산자로 각 텍스트에 따라 깔끔한 단어로 변경 */
  return {
    parking:
      info.parking.includes('없음') || info.parking === '정보 없음'
        ? '주차 불가'
        : '주차 가능',
    pet:
      info.pet.includes('불가') || info.pet === '정보 없음'
        ? '동반 제한'
        : '반려동물 가능',
    rest: info.rest.length > 12 ? '상세정보 확인' : info.rest,
  };
};

/* 비동기 파라미터 */
export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  /* id 값을 api로 요청 후 받은 데이터를 저장 */
  const { id } = await params;

  /* 공통 상세 정보 */
  const data: TourDetail | null = await getTourDetail(id);

  /* 데이터가 없을 경우 메세지 */
  if (!data)
    return <div className={styles.error}>데이터를 찾을 수 없습니다.</div>;

  /* 기타 상세 정보 (id값과 공통정보에서 가져온 숫자코드로 호출) */
  const intro: TourIntro | null = await getTourIntro(id, data.contenttypeid);

  /* intro의 데이터와 숫자코드를 전달 */
  const quickInfo = getQuickInfo(intro, data.contenttypeid);

  return (
    <div className={styles.container}>
      {/* 배너 */}
      <div className={styles.hero}>
        <DetailImage src={data.firstimage} title={data.title} />
        <div className={styles.heroOverlay}>
          <div className={styles.titleBox}>
            <div className={styles.titleTop}>
              <h1>{data.title}</h1>
              <LikeButton
                id={id}
                title={data.title}
                image={data.firstimage}
                address={data.addr1}
              />
            </div>
            <p className={styles.addrText}>📍 {data.addr1}</p>
          </div>
        </div>
      </div>

      {/* 내용 */}
      <div className={styles.inner}>
        <section className={styles.quickInfoSection}>
          <div className={styles.quickInfoGrid}>
            <div className={styles.quickItem}>
              <span className={styles.qIcon}>🅿️</span>
              <span>{quickInfo.parking}</span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.qIcon}>🐶</span>
              <span>{quickInfo.pet}</span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.qIcon}>🚫</span>
              <span>{quickInfo.rest}</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>장소 소개</h2>

          {/* dangerouslySetInnerHTML를 사용하여 불러온 값의 <br>태그 인식 */}
          <p
            className={styles.overview}
            dangerouslySetInnerHTML={{ __html: data.overview }}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>이용 안내</h2>
          <div className={styles.infoTable}>
            <div className={styles.tableRow}>
              <div className={styles.tableLabel}>주소</div>
              <div className={styles.tableValue}>
                {data.addr1 || '정보 없음'}
              </div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableLabel}>연락처</div>
              <div className={styles.tableValue}>{data.tel || '정보 없음'}</div>
            </div>
            {data.homepage && (
              <div className={styles.tableRow}>
                <div className={styles.tableLabel}>홈페이지</div>
                <div
                  className={styles.tableValue}
                  dangerouslySetInnerHTML={{ __html: data.homepage }}
                />
              </div>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>위치 보기</h2>
          <div className={styles.mapContainer}>
            <DetailMap mapX={data.mapx} mapY={data.mapy} title={data.title} />
          </div>
        </section>

        <NearbySection mapX={data.mapx} mapY={data.mapy} />
      </div>
    </div>
  );
}
