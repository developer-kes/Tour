/* NEXT */
import Link from 'next/link';

/* CSS */
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <h2 className={styles.logo}>Tourch</h2>
            <p className={styles.desc}>
              대한민국 구석구석, 당신의 발길이 닿는 곳마다 새로운 이야기가
              시작됩니다.
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h3>Explore</h3>
              <Link href="/map">지도 탐색</Link>
              <Link href="/search">검색하기</Link>
              <Link href="/list">리스트</Link>
            </div>
            <div className={styles.linkGroup}>
              <h3>Tech Stack</h3>
              <span>Next.js</span>
              <span>Firebase</span>
              <span>Tour API 4.0</span>
            </div>
            <div className={styles.linkGroup}>
              <h3>Contact</h3>
              {/* 외부링크는 a태그 사용 */}
              <a href="https://github.com/EunsungGIT/Tour" target="_blank">
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* 저작권 */}
        <div className={styles.bottom}>
          <p>© EUN . All rights reserved.</p>
          <p className={styles.source}>
            Data by 한국관광공사 국문 관광정보 서비스
          </p>
        </div>
      </div>
    </footer>
  );
}
