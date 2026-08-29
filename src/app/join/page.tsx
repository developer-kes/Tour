'use client';

/* NEXT */
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* REACT */
import { useState } from 'react';

/* CSS */
import styles from './page.module.css';

/* FIREBASE */
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

export default function SignupPage() {
  /* 이메일, 비밀번호, 이름의 상태 */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  /* 에러 메세지 상태 */
  const [error, setError] = useState('');

  /* 라우터 */
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    /* 새로고침 방지 */
    e.preventDefault();

    /* 이전의 에러 메세지 초기화 */
    setError('');

    try {
      /* 파이어베이스에 새로운 계정 생성 */
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      /* 프로필 정보에 이름 저장 */
      await updateProfile(user, { displayName: nickname });

      /* 파이어스토어 DB에 정보 저장 */
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        nickname: nickname,
        createdAt: new Date().toISOString(),
      });

      alert('회원가입이 완료되었습니다.');
      router.push('/login');
    } catch (err) {
      /* Firebase 에러가 아닌 경우까지 대비해서 타입을 좁혀서 확인 */
      if (err instanceof FirebaseError) {
        /* 이메일 에러 */
        if (err.code === 'auth/email-already-in-use')
          setError('이미 사용 중인 이메일입니다.');
        /* 비밀번호 갯수 에러 */ else if (err.code === 'auth/weak-password')
          setError('비밀번호를 6자리 이상 입력해주세요.');
        /* 오류 */ else setError('회원가입 중 오류가 발생했습니다.');
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginBox}>
        <h1 className={styles.logo}>Tourch</h1>
        <p className={styles.title}>새로운 여행을 시작해보세요!</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="닉네임"
            required
            className={styles.input}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            type="email"
            placeholder="이메일 주소"
            required
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            required
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.loginBtn}>
            회원가입 완료
          </button>
        </form>

        <div className={styles.links}>
          <span>이미 계정이 있으신가요?</span>
          <Link href="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}
