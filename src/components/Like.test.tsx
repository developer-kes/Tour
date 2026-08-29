import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LikeButton from './Like';

/* Like.tsx가 import하는 auth, db는 실제 값이 필요 없어서 빈 객체로 mock */
vi.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
}));

const mockOnAuthStateChanged = vi.fn();
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
}));

const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockDeleteDoc = vi.fn();
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
}));

const defaultProps = {
  id: '1',
  title: '경복궁',
  image: '/img.jpg',
  address: '서울 종로구',
};

describe('LikeButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetDoc.mockResolvedValue({ exists: () => false });
  });

  test('로그인 안 했을 때 클릭하면 alert가 뜨고 Firestore는 호출되지 않는다', () => {
    /* onAuthStateChanged 콜백에 null(비로그인)을 즉시 전달 */
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null);
      return () => {};
    });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<LikeButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    expect(alertSpy).toHaveBeenCalledWith('로그인이 필요한 기능입니다.');
    expect(mockSetDoc).not.toHaveBeenCalled();
  });

  test('로그인 했을 때 클릭하면 찜하기 상태가 토글되고 Firestore에 저장된다', async () => {
    /* onAuthStateChanged 콜백에 로그인된 유저 정보를 전달 */
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({ uid: 'user-1' });
      return () => {};
    });

    render(<LikeButton {...defaultProps} />);

    /* 마운트 시 찜 여부 확인(getDoc)이 끝날 때까지 대기 */
    await waitFor(() => expect(mockGetDoc).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button'));

    /* 클릭 후 Firestore에 저장되는지 확인 */
    await waitFor(() => expect(mockSetDoc).toHaveBeenCalled());
  });
});
