/** หนังสือหนึ่งเล่มหลังแปลงจาก Google Books volume */
export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  categories: string[];
  pageCount?: number;
  language?: string;
  thumbnail?: string;
  coverLarge?: string;
  averageRating?: number;
  ratingsCount?: number;
  previewLink?: string;
  infoLink?: string;
}

/** ข้อมูลย่อที่บันทึกลง LocalStorage (ไม่ต้องดึง API ซ้ำในหน้าคอลเลกชัน) */
export type BookSummary = Pick<
  Book,
  'id' | 'title' | 'authors' | 'publishedDate' | 'thumbnail' | 'categories' | 'pageCount'
>;

export interface BookSearchResult {
  totalItems: number;
  items: Book[];
}

export type ReadingStatus = 'want' | 'reading' | 'read';

export type SortOrder = 'relevance' | 'newest';

export interface SearchParams {
  query: string;
  category: string;
  orderBy: SortOrder;
  page: number;
}
