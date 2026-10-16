import type { Book, BookSearchResult, SearchParams } from '../types/book';
import { PAGE_SIZE } from '../lib/constants';
import type { FeaturedBook } from '../lib/featured';

const BASE_URL = 'https://www.googleapis.com/books/v1';
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

/** คำค้นเริ่มต้นเมื่อผู้ใช้ยังไม่พิมพ์อะไรและไม่ได้เลือกหมวด */
export const DEFAULT_QUERY = 'subject:fiction';

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/* ---------- รูปแบบข้อมูลดิบจาก Google Books ---------- */

interface GoogleImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
}

interface GoogleVolumeInfo {
  title?: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  categories?: string[];
  pageCount?: number;
  language?: string;
  imageLinks?: GoogleImageLinks;
  averageRating?: number;
  ratingsCount?: number;
  previewLink?: string;
  infoLink?: string;
}

interface GoogleVolume {
  id: string;
  volumeInfo?: GoogleVolumeInfo;
}

interface GoogleVolumesResponse {
  totalItems?: number;
  items?: GoogleVolume[];
}

/* ---------- helpers ---------- */

/** บังคับ https และเอาเอฟเฟกต์ "ขอบกระดาษม้วน" ของ Google ออก */
function secureImage(url?: string): string | undefined {
  if (!url) return undefined;
  return url.replace(/^http:\/\//i, 'https://').replace(/&edge=curl/g, '');
}

/** หมวดของ Google เป็นแบบ "Fiction / Science Fiction / General" → แตกเป็นคำเดี่ยว */
function normalizeCategories(categories?: string[]): string[] {
  if (!categories) return [];
  const set = new Set<string>();
  for (const c of categories) {
    for (const part of c.split('/')) {
      const p = part.trim();
      if (p && p.toLowerCase() !== 'general') set.add(p);
    }
  }
  return [...set].slice(0, 4);
}

export function mapVolume(v: GoogleVolume): Book {
  const info = v.volumeInfo ?? {};
  const links = info.imageLinks ?? {};
  const thumbnail = secureImage(links.thumbnail ?? links.smallThumbnail);
  const large = secureImage(links.large ?? links.medium ?? links.small ?? links.extraLarge);

  return {
    id: v.id,
    title: info.title ?? 'Untitled',
    subtitle: info.subtitle,
    authors: info.authors ?? [],
    publisher: info.publisher,
    publishedDate: info.publishedDate,
    description: info.description,
    categories: normalizeCategories(info.categories),
    pageCount: info.pageCount,
    language: info.language,
    thumbnail,
    // ถ้าไม่มีภาพขนาดใหญ่ ใช้ thumbnail แบบ zoom=2 แทน (คมขึ้นบนหน้า Detail)
    coverLarge: large ?? thumbnail?.replace(/zoom=\d/, 'zoom=2'),
    averageRating: info.averageRating,
    ratingsCount: info.ratingsCount,
    previewLink: secureImage(info.previewLink),
    infoLink: secureImage(info.infoLink),
  };
}

async function request<T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const search = new URLSearchParams(params);
  if (API_KEY) search.set('key', API_KEY);

  const res = await fetch(`${BASE_URL}${path}?${search.toString()}`, { signal });
  if (!res.ok) {
    const message =
      res.status === 429
        ? 'เรียก API บ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'
        : res.status === 404
          ? 'ไม่พบหนังสือที่ต้องการ'
          : `ดึงข้อมูลไม่สำเร็จ (HTTP ${res.status})`;
    throw new ApiError(message, res.status);
  }
  return (await res.json()) as T;
}

export function buildQuery(query: string, category: string): string {
  const parts: string[] = [];
  const q = query.trim();
  if (q) parts.push(q);
  if (category) parts.push(category.includes(' ') ? `subject:"${category}"` : `subject:${category}`);
  return parts.length ? parts.join(' ') : DEFAULT_QUERY;
}

/* ---------- endpoints ---------- */

function searchVolumes(q: string, params: SearchParams, signal?: AbortSignal) {
  return request<GoogleVolumesResponse>(
    '/volumes',
    {
      q,
      maxResults: String(PAGE_SIZE),
      startIndex: String((params.page - 1) * PAGE_SIZE),
      orderBy: params.orderBy,
      printType: 'books',
    },
    signal,
  );
}

/** GET /volumes?q={query}&maxResults=20 */
export async function searchBooks(params: SearchParams, signal?: AbortSignal): Promise<BookSearchResult> {
  let data = await searchVolumes(buildQuery(params.query, params.category), params, signal);

  // subject: บางหมวดได้ผลว่าง → ลองค้นแบบคำธรรมดาแทน
  if (!data.items?.length && params.category) {
    data = await searchVolumes(`${params.query.trim()} ${params.category}`.trim(), params, signal);
  }

  // Google Books บางครั้งส่งเล่มซ้ำมา → กรองด้วย id
  const seen = new Set<string>();
  const items: Book[] = [];
  for (const v of data.items ?? []) {
    if (seen.has(v.id)) continue;
    seen.add(v.id);
    items.push(mapVolume(v));
  }
  return { totalItems: data.totalItems ?? 0, items };
}

/* ---------- หนังสือแนะนำ ---------- */

const FEATURED_CACHE_KEY = 'booknest-featured-v1';
const FEATURED_CACHE_TTL = 24 * 60 * 60 * 1000;
const FEATURED_CONCURRENCY = 4;

function readFeaturedCache(): BookSearchResult | null {
  try {
    const raw = localStorage.getItem(FEATURED_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { savedAt: number; data: BookSearchResult };
    if (Date.now() - cached.savedAt > FEATURED_CACHE_TTL || !cached.data?.items?.length) return null;
    return cached.data;
  } catch {
    return null;
  }
}

function writeFeaturedCache(data: BookSearchResult) {
  try {
    localStorage.setItem(FEATURED_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // LocalStorage เต็มหรือถูกปิด → ข้ามไป
  }
}

async function findFeaturedBook(book: FeaturedBook, signal?: AbortSignal): Promise<Book | null> {
  const queries = [`intitle:${book.title} inauthor:${book.author}`, `${book.title} ${book.author}`];
  for (const q of queries) {
    const data = await request<GoogleVolumesResponse>(
      '/volumes',
      { q, maxResults: '5', printType: 'books' },
      signal,
    );
    const found = (data.items ?? []).map(mapVolume).find((b) => b.thumbnail);
    if (found) return found;
  }
  return null;
}

/** ค้นหนังสือแนะนำทีละเล่ม (ยิงพร้อมกันไม่เกิน 4 request) แล้ว cache ไว้ 1 วัน */
export async function getFeaturedBooks(list: FeaturedBook[], signal?: AbortSignal): Promise<BookSearchResult> {
  const cached = readFeaturedCache();
  if (cached) return cached;

  const results: (Book | null)[] = new Array(list.length).fill(null);
  let firstError: unknown = null;
  let next = 0;

  const worker = async () => {
    while (next < list.length) {
      const i = next++;
      try {
        results[i] = await findFeaturedBook(list[i], signal);
      } catch (err) {
        if (signal?.aborted) throw err;
        firstError ??= err;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(FEATURED_CONCURRENCY, list.length) }, worker));

  const seen = new Set<string>();
  const items: Book[] = [];
  for (const b of results) {
    if (!b || seen.has(b.id)) continue;
    seen.add(b.id);
    items.push(b);
  }

  if (items.length === 0 && firstError) throw firstError;

  const data = { totalItems: items.length, items };
  // cache เฉพาะตอนดึงได้ครบไม่มี error เพื่อไม่ให้ผลไม่สมบูรณ์ค้างไว้ทั้งวัน
  if (items.length > 0 && !firstError) writeFeaturedCache(data);
  return data;
}

/** GET /volumes/{volumeId} */
export async function getBook(volumeId: string, signal?: AbortSignal): Promise<Book> {
  const data = await request<GoogleVolume>(`/volumes/${encodeURIComponent(volumeId)}`, {}, signal);
  return mapVolume(data);
}
