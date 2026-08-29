/* API */
import { searchTours } from '@/lib/api';

/* 컴포넌트 */
import Card from '@/components/Card';
import SearchInput from '@/components/SearchInput';

/* CSS */
import styles from './page.module.css';

/* 타입 */
import { TourItem } from '@/lib/types';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  /* 파라미터로 받은 q값을 keyword로 수정 */
  const { q: keyword } = await searchParams;

  /* keyword 값이 있을 경우 api에 호출하여 데이터를 받아냄 (없을 경우 빈 배열로 반환) */
  const tours: TourItem[] = keyword ? await searchTours(keyword) : [];

  return (
    <div className={styles.container}>
      <section className={styles.searchSection}>
        <div className={styles.searchInner}>
          <h2 className={styles.searchTitle}>어디로 떠날까요?</h2>
          <SearchInput defaultValue={keyword} />
        </div>
      </section>

      <h2 className={styles.title}>
        {/* 검색어가 있을 경우에 따른 검색어와 데이터의 수 표시 */}
        {keyword ? (
          <>
            <span>&lsquo;{keyword}&rsquo;</span> 검색 결과 ({tours.length})
          </>
        ) : (
          <>검색어를 입력해주세요</>
        )}
      </h2>

      {/* 데이터가 있을 경우 카드 컴포넌트로 반복문으로 데이터 전송 없을 경우에 따른 메세지 노출 */}
      {tours.length > 0 ? (
        <div className={styles.cardGrid}>
          {tours.map((tour: any) => (
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
      ) : (
        <div className={styles.noCard}>
          <p>
            검색 결과가 없습니다.
            <br />
            다른 검색어를 입력해 보세요!
          </p>
        </div>
      )}
    </div>
  );
}
