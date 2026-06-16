import { formatDate, formatDateOnly, formatDateTime } from './format-date';

describe('formatDate', () => {
  it('日付を「yyyy/MM/dd」形式で返す', () => {
    expect(formatDate(new Date(2026, 3, 1))).toBe('2026/04/01');
  });

  it('日付が未指定の場合、空文字を返す', () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('formatDateTime', () => {
  it('日時を「yyyy/MM/dd HH:mm」形式で返す', () => {
    expect(formatDateTime(new Date(2026, 3, 1, 9, 5))).toBe('2026/04/01 09:05');
  });

  it('日時が未指定の場合、空文字を返す', () => {
    expect(formatDateTime(null)).toBe('');
  });
});

describe('formatDateOnly', () => {
  it('日付を「yyyy-MM-dd」形式で返す', () => {
    expect(formatDateOnly(new Date(2026, 3, 1))).toBe('2026-04-01');
  });

  it('日付が未指定の場合、空文字を返す', () => {
    expect(formatDateOnly(null)).toBe('');
  });
});
