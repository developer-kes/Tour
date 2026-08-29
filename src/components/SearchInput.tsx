'use client';

/* REACT */
import { useState } from 'react';

/* NEXT */
import { useRouter } from 'next/navigation';

/* CSS */
import styles from './SearchInput.module.css';

/* 받아온 초기 검색어의 타입 지정 */
interface SearchInputProps {
  /* 없을수도 있기 때문에 ? 표시 */
  defaultValue?: string;
}

/* defaultValue가 없을 경우 빈 문자열 취급 */
export default function SearchInput({ defaultValue = '' }: SearchInputProps) {
  /* 검색어 상태 */
  const [keyword, setKeyword] = useState(defaultValue);
  const router = useRouter();

  /* 검색어 전송 */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    /* 검색어가 없을 경우 종료 */
    if (!keyword.trim()) return;

    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchBox}>
      <input
        type="text"
        placeholder="어디로 떠나고 싶으신가요?"
        aria-label="여행지 검색"
        value={keyword}
        /* 제어 컴포넌트 */
        onChange={(e) => setKeyword(e.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        검색
      </button>
    </form>
  );
}
