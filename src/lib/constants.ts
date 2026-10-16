import type { ReadingStatus } from '../types/book';

export const PAGE_SIZE = 20;
export const COLLECTION_PAGE_SIZE = 12;
/** Google Books ให้ผลลัพธ์ได้ลึกจำกัด จึงจำกัดจำนวนหน้าไว้ */
export const MAX_PAGES = 10;

export const STATUSES: ReadingStatus[] = ['want', 'reading', 'read'];

export const STATUS_META: Record<
  ReadingStatus,
  { label: string; thai: string; caption: string; cssVar: string; badge: string }
> = {
  want: {
    label: 'Want to Read',
    thai: 'อยากอ่าน',
    caption: 'books waiting for you',
    cssVar: 'var(--status-want)',
    badge: 'badge-primary',
  },
  reading: {
    label: 'Currently Reading',
    thai: 'กำลังอ่าน',
    caption: 'books in progress',
    cssVar: 'var(--status-reading)',
    badge: 'badge-secondary',
  },
  read: {
    label: 'Read',
    thai: 'อ่านจบแล้ว',
    caption: 'books finished',
    cssVar: 'var(--status-read)',
    badge: 'badge-accent',
  },
};

export const CATEGORIES: { value: string; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'science fiction', label: 'Science Fiction' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'mystery', label: 'Mystery & Thriller' },
  { value: 'romance', label: 'Romance' },
  { value: 'history', label: 'History' },
  { value: 'science', label: 'Science' },
  { value: 'biography', label: 'Biography' },
  { value: 'business', label: 'Business & Economics' },
  { value: 'self-help', label: 'Self-Help' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'philosophy', label: 'Philosophy' },
  { value: 'computers', label: 'Computers' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'art', label: 'Art' },
];

export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  th: 'ไทย',
  ja: '日本語',
  zh: '中文',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
};
