'use client';

/* REACT */
import { useState, useEffect, useCallback } from 'react';

/* 컴포넌트 */
import FullMap from '@/components/FullMap';

/* CSS */
import styles from './page.module.css';

/* NEXT */
import Link from 'next/link';

/* 숫자코드에 따른 한글 변환 타입 */
const CATEGORY_MAP: { [key: string]: string } = {
  '12': '관광지',
  '14': '문화시설',
  '15': '축제/행사',
  '25': '여행코스',
  '28': '레포츠',
  '32': '숙박',
  '38': '쇼핑',
  '39': '음식점',
};

export default function MapPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 데이터 가져오는 로직을 재사용 가능하게 분리 */
  const fetchNearbyTours = useCallback(async (lat: number, lng: number) => {
    /* 로딩 시작 */
    setLoading(true);
    try {
      /* API 호출 후 데이터 수집 */
      const res = await fetch(`/api/tours/location?lat=${lat}&lng=${lng}`);
      const data = await res.json();

      /* 수집한 데이터 상태에 저장 */
      setItems(data);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      /* 로딩 종료 */
      setLoading(false);
    }
  }, []);

  /* Geolocation으로 사용자의 현재 위치를 위도와 경도로 수집 */
  const handleRefreshLocation = () => {
    /* 위치 정보가 지원이 안되는 경우 */
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
      return;
    }

    /* 로딩 시작 */
    setLoading(true);

    /* 수집한 위도와 경도를 데이터 가져오는 로직으로 전송 */
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchNearbyTours(latitude, longitude);
      },
      (error) => {
        console.error('위치 정보 획득 실패:', error);
        setLoading(false);
        alert('위치 정보 권한을 확인해주세요.');
      },
    );
  };

  /* 초기의 사용자 위치정보 기반 데이터 표시 */
  useEffect(() => {
    handleRefreshLocation();
  }, [fetchNearbyTours]);

  return (
    <div className={styles.mapPageWrapper}>
      <aside className={styles.sideList}>
        <div className={styles.listHeader}>
          <h2>🗺️ 내 주변 탐색</h2>
          <p>총 {items.length}개의 장소가 발견되었어요.</p>
          <button
            onClick={handleRefreshLocation}
            className={styles.refreshBtn}
            disabled={loading}
          >
            {loading ? '갱신 중...' : '🔄 현재 위치에서 재검색'}
          </button>
        </div>

        <div className={styles.scrollArea}>
          {loading ? (
            <div className={styles.loadingBox}>
              <p>정보를 불러오는 중...</p>
            </div>
          ) : (
            <>
              {items.length > 0 ? (
                items.map((item: any) => (
                  <Link
                    href={`/detail/${item.contentid}`}
                    key={item.contentid}
                    className={styles.listItem}
                  >
                    <div className={styles.itemText}>
                      <span className={styles.category}>
                        {CATEGORY_MAP[item.contenttypeid] || '기타'}
                      </span>
                      <p className={styles.itemTitle}>{item.title}</p>
                      <p className={styles.itemAddr}>
                        {item.addr1 || '주소 정보 없음'}
                      </p>
                      {item.dist && (
                        <p className={styles.dist}>
                          {Math.round(item.dist / 100) / 10}km 떨어짐
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <p className={styles.noData}>주변에 검색된 장소가 없습니다.</p>
              )}
            </>
          )}
        </div>
      </aside>

      <main className={styles.mapContainer}>
        <FullMap items={items} />
      </main>
    </div>
  );
}
