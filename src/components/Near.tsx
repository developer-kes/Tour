'use client';

/* REACT */
import { useEffect, useState } from 'react';

/* 컴포넌트 */
import Card from '@/components/Card';

/* CSS */
import styles from './Near.module.css';

/* 타입 */
import { TourItem } from '@/lib/types';

/* 받아온 위도 경도의 타입 */
interface NearbySectionProps {
  mapX: string;
  mapY: string;
}

/* 선택된 시설의 근처 맛집, 숙소, 명소 */
export default function NearbySection({ mapX, mapY }: NearbySectionProps) {
  const [activeTab, setActiveTab] = useState('39');
  const [items, setItems] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* 숫자코드에 따른 타이틀 매핑 */
  const tabs = [
    { id: '39', label: '🍕 근처 맛집', name: '맛집' },
    { id: '32', label: '🏨 근처 숙소', name: '숙소' },
    { id: '12', label: '📸 주변 명소', name: '명소' },
  ];

  /* 탭과 현재 보는 상세시설의 위치에 따라 달라지므로 useEffect 활용 */
  useEffect(() => {
    const fetchNearby = async () => {
      setLoading(true);
      /* 위도와 경도 그리고 숫자코드를 보내 api 데이터 호출 */
      const res = await fetch(
        `/api/tours/nearby?mapX=${mapX}&mapY=${mapY}&contentTypeId=${activeTab}`,
      );
      const data: TourItem[] = await res.json();

      setItems(data);
      setLoading(false);
    };
    fetchNearby();
  }, [activeTab, mapX, mapY]);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>주변에 이런 곳은 어때요?</h2>

      {/* 탭 */}
      <div className={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 리스트 */}
      <div className={styles.listWrapper}>
        {loading ? (
          <div className={styles.loading}>정보를 불러오는 중...</div>
        ) : items.length > 0 ? (
          <div className={styles.scrollContainer}>
            {items.map((item: any) => (
              <div key={item.contentid} className={styles.cardItem}>
                <Card
                  id={item.contentid}
                  title={item.title}
                  image={item.firstimage}
                  address={item.addr1}
                  contentTypeId={item.contenttypeid}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>주변에 관련 시설이 없습니다.</div>
        )}
      </div>
    </section>
  );
}
