'use client';

/* REACT */
import { useState, useEffect } from 'react';

/* FIREBASE */
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

/* CSS */
import styles from './Like.module.css';

/* DB에 저장 혹은 삭제될 데이터 타입 */
interface LikeButtonProps {
  id: string;
  title: string;
  image: string;
  address: string;
}

export default function LikeButton({
  id,
  title,
  image,
  address,
}: LikeButtonProps) {
  /* 찜하기의 상태 */
  const [isLiked, setIsLiked] = useState(false);

  /* 로그인 상태 (비동기 복원을 반영하기 위해 onAuthStateChanged로 구독) */
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  /* id와 user 여부에 따라 실행 (찜하기 사전 확인) */
  useEffect(() => {
    /* 로그인 안했을 경우 종료 */
    if (!user) return;

    /* 비동기로 실제 데이터 확인 */
    const checkLiked = async () => {
      const docRef = doc(db, 'users', user.uid, 'wishlist', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setIsLiked(true);
    };
    checkLiked();
  }, [id, user]);

  const toggleLike = async (e: React.MouseEvent) => {
    /* 카드 클릭 시 페이지 이동 방지 */
    e.preventDefault();

    /* 로그인 유무 확인 */
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    const docRef = doc(db, 'users', user.uid, 'wishlist', id);

    /* 찜하기 혹은 해제 */
    if (isLiked) {
      await deleteDoc(docRef);
      setIsLiked(false);
    } else {
      await setDoc(docRef, {
        id,
        title,
        image,
        address,
        createdAt: new Date().toISOString(),
      });
      setIsLiked(true);
    }
  };

  return (
    <button
      className={`${styles.likeBtn} ${isLiked ? styles.active : ''}`}
      onClick={toggleLike}
    >
      {/* 상태에 따라 다른 아이콘 표시 */}
      {isLiked ? '❤️' : '🤍'}
    </button>
  );
}
