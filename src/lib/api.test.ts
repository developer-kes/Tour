import { describe, test, expect, vi, beforeEach } from 'vitest';
import { searchTours } from './api';

describe('searchTours', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('정상 응답이면 관광지 배열을 반환한다', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        response: {
          body: { items: { item: [{ contentid: '1', title: '경복궁' }] } },
        },
      }),
    }) as unknown as typeof fetch;

    const result = await searchTours('경복궁');

    expect(result).toEqual([{ contentid: '1', title: '경복궁' }]);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('searchKeyword2'),
      expect.any(Object),
    );
  });

  test('데이터가 없으면 빈 배열을 반환한다', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ response: { body: { items: {} } } }),
    }) as unknown as typeof fetch;

    const result = await searchTours('존재하지않는키워드');

    expect(result).toEqual([]);
  });

  test('네트워크 에러가 나도 앱이 죽지 않고 빈 배열을 반환한다', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await searchTours('경복궁');

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
