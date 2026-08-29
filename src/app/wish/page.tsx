'use client';

/* REACT */
import { useEffect, useState } from 'react';

/* 컴포넌트 */
import Card from '@/components/Card';

/* CSS */
import styles from './page.module.css';

/* NEXT */
import Link from 'next/link';

/* FIREBASE */
import { auth, db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function WishlistPage() {
  /* 불러온 찜 목록 데이터 */
  const [wishlist, setWishlist] = useState<any[]>([]);

  /* 불러오는 로딩 */
  const [loading, setLoading] = useState(true);

  /* 로그인 상태 */
  const [isLogin, setIsLogin] = useState(false);

  /* 처음 페이지 한 번만 실행 */
  useEffect(() => {
    /* 위시리스트 구독 해제 함수를 담아둘 변수 (콜백이 여러 번 실행돼도 이전 구독을 추적하기 위함) */
    let unsubscribeWishlist: (() => void) | undefined;

    /* 실시간 로그인 확인 */
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      /* 콜백이 다시 실행되면 이전 위시리스트 구독부터 정리 */
      if (unsubscribeWishlist) {
        unsubscribeWishlist();
        unsubscribeWishlist = undefined;
      }

      if (user) {
        setIsLogin(true);
        const q = query(
          collection(db, 'users', user.uid, 'wishlist'),
          orderBy('createdAt', 'desc'),
        );

        /* onSnapshot으로 실시간 데이터 감지 (즉시 갱신) */
        unsubscribeWishlist = onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            ...doc.data(),
          }));
          setWishlist(items);
          setLoading(false);
        });
      } else {
        setIsLogin(false);
        setLoading(false);
      }
    });

    /* 컴포넌트가 사라질 때 두 구독 모두 정리 */
    return () => {
      unsubscribeAuth();
      if (unsubscribeWishlist) unsubscribeWishlist();
    };
  }, []);

  /* 대기 창 */
  if (loading) return <div className={styles.loading}>불러오는 중...</div>;

  /* 로그인이 되어있지 않은 경우 */
  if (!isLogin) {
    return (
      <div className={styles.noUser}>
        <p>로그인이 필요한 서비스입니다.</p>
        <Link href="/login" className={styles.goLogin}>
          로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>내 찜 목록 ({wishlist.length})</h2>

      {/* 반복문으로 카드 컴포넌트에 데이터 props 전송 */}
      {wishlist.length > 0 ? (
        <div className={styles.cardGrid}>
          {wishlist.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image}
              address={item.address}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>아직 찜한 장소가 없습니다. 😥</p>
          <Link href="/" className={styles.goHome}>
            장소 둘러보기
          </Link>
        </div>
      )}
    </div>
  );
}
