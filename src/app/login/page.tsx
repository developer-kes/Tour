'use client';

/* REACT */
import { useState } from 'react';

/* NEXT */
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* CSS */
import styles from './page.module.css';

/* FIREBASE */
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  /* 이메일, 비밀번호의 상태 */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* 에러 상태 */
  const [error, setError] = useState('');

  /* 라우터 */
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    /* 새로고침 방지 */
    e.preventDefault();

    /* 이전 에러 내용 초기화 */
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch {
      setError('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginBox}>
        <h1 className={styles.logo}>Tourch</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일 주소"
            aria-label="이메일 주소"
            required
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            aria-label="비밀번호"
            required
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className={styles.errorMsg}>{error}</p>}
          <button type="submit" className={styles.loginBtn}>
            로그인
          </button>
        </form>

        <div className={styles.links}>
          <span>계정이 없으신가요?</span>
          <Link href="/join">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
