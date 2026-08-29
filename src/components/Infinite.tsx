'use client';

/* REACT */
import { useState } from 'react';

/* 컴포넌트 */
import Card from './Card';

/* CSS */
import styles from './Infinite.module.css';

/* 타입 */
import { TourItem } from '@/lib/types';

export default function InfiniteList({
  initialTours,
  contentTypeId,
}: {
  initialTours: TourItem[];
  contentTypeId: string;
}) {
  /* 관광지 데이터 상태 */
  const [tours, setTours] = useState(initialTours);

  /* 페이지 상태 (1번부터) */
  const [page, setPage] = useState(1);

  /* 데이터가 더 있는지에 대한 상태 */
  const [hasMore, setHasMore] = useState(true);

  /* 데이터를 더 가져오고 있다는 상태 */
  const [loading, setLoading] = useState(false);

  const loadMoreTours = async () => {
    setLoading(true);

    /* 페이지 번호를 늘려서 추가 요청 */
    const nextPage = page + 1;
    const res = await fetch(
      `/api/tours/category?contentTypeId=${contentTypeId}&pageNo=${nextPage}`,
    );
    const newTours: TourItem[] = await res.json();

    /* 데이터가 없을경우에 대한 로직 */
    if (newTours.length === 0) {
      setHasMore(false);
    } else {
      /* 있을 경우 기존 배열에 추가 */
      setTours((prev) => [...prev, ...newTours]);
      setPage(nextPage);
    }
    setLoading(false);
  };

  return (
    <>
      <div className={styles.cardGrid}>
        {/* 반복문을 통한 데이터 props 전송 */}
        {tours.map((tour: TourItem) => (
          <Card
            key={tour.contentid}
            id={tour.contentid}
            title={tour.title}
            image={tour.firstimage}
            address={tour.addr1}
            contentTypeId={tour.contenttypeid}
          />
        ))}
      </div>

      <div className={styles.actionArea}>
        {/* 상태에 따른 메세지 표시 */}
        {hasMore ? (
          <button
            onClick={loadMoreTours}
            className={styles.loadMoreBtn}
            disabled={loading}
          >
            {loading ? '정보를 가져오는 중...' : '더보기'}
          </button>
        ) : (
          <p className={styles.noMore}>모든 정보를 불러왔습니다. 😊</p>
        )}
      </div>
    </>
  );
}
