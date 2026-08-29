/* CSS */
import styles from './page.module.css';

/* 컴포넌트 */
import Card from '@/components/Card';
import SearchInput from '@/components/SearchInput';
import CurationTabs from '@/components/Curation';
import HomeSlider from '@/components/Slider';

/* NEXT */
import Link from 'next/link';
import Image from 'next/image';

/* API */
import { getPopularTours, getToursByCategory } from '@/lib/api';

/* 인기 데이터 타입 지정 */
interface TourItem {
  contentid: string;
  title: string;
  firstimage: string;
  addr1: string;
  contenttypeid?: string;
}

export default async function Home() {
  /* 인기 데이터 호출 및 타입 지정 */
  const [popularTours, festivals, restaurants] = await Promise.all([
    getPopularTours() as Promise<TourItem[]>,
    getToursByCategory('15', 10) as Promise<TourItem[]>,
    getToursByCategory('39', 6) as Promise<TourItem[]>,
  ]);

  return (
    <main>
      {/* 검색 */}
      <section className={styles.intro}>
        <Image
          src="/images/background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.introImage}
        />
        <div className={styles.introOverlay} />
        <div className={styles.search}>
          <h2>어디로 여행을 떠나시나요?</h2>
          <SearchInput />
        </div>
      </section>

      {/* 메뉴 */}
      <section className={styles.category}>
        <div className={styles.categoryContainer}>
          <Link href="/list?type=15" className={styles.menuItem}>
            <div className={styles.iconCircle}>🎡</div>
            <span>축제</span>
          </Link>
          <Link href="/list?type=14" className={styles.menuItem}>
            <div className={styles.iconCircle}>🏟️</div>
            <span>문화시설</span>
          </Link>
          <Link href="/list?type=12" className={styles.menuItem}>
            <div className={styles.iconCircle}>🏖️</div>
            <span>관광지</span>
          </Link>
          <Link href="/list?type=38" className={styles.menuItem}>
            <div className={styles.iconCircle}>🛍️</div>
            <span>쇼핑</span>
          </Link>
          <Link href="/list?type=25" className={styles.menuItem}>
            <div className={styles.iconCircle}>🗺️</div>
            <span>여행코스</span>
          </Link>
          <Link href="/list?type=28" className={styles.menuItem}>
            <div className={styles.iconCircle}>🏂</div>
            <span>레포츠</span>
          </Link>
          <Link href="/list?type=32" className={styles.menuItem}>
            <div className={styles.iconCircle}>🏨</div>
            <span>숙박</span>
          </Link>
          <Link href="/list?type=39" className={styles.menuItem}>
            <div className={styles.iconCircle}>🍚</div>
            <span>음식점</span>
          </Link>
        </div>
      </section>

      {/* 키워드 */}
      <CurationTabs />

      {/* 인기 관광지 */}
      <section className={styles.recommend}>
        <div className={styles.sectionHeader}>
          <h3>✈️ 지금 인기 있는 관광지</h3>
        </div>
        <div className={styles.cardGrid}>
          {popularTours.length > 0 ? (
            popularTours.map((item) => (
              <Card
                key={item.contentid}
                id={item.contentid}
                title={item.title}
                image={item.firstimage}
                address={item.addr1}
                contentTypeId="12"
              />
            ))
          ) : (
            <p>관광 정보를 불러오는 중입니다...</p>
          )}
        </div>
      </section>

      {/* 인기 축제 */}
      <section className={styles.festivalSection}>
        <div className={styles.sectionHeader}>
          <h3>🎊 지금 가야 할 축제</h3>
          <Link href="/list?type=15" className={styles.moreBtn}>
            더보기
          </Link>
        </div>
        <HomeSlider items={festivals} defaultType="15" />
      </section>

      {/* 맛집 */}
      <section className={styles.recommend}>
        <div className={styles.sectionHeader}>
          <h3>🍚 실패 없는 지역 맛집</h3>
          <Link href="/list?type=39" className={styles.moreBtn}>
            더보기
          </Link>
        </div>
        <HomeSlider items={restaurants} defaultType="39" />
      </section>
    </main>
  );
}
