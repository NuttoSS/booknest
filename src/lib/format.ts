import { LANGUAGE_NAMES } from './constants';

export function formatAuthors(authors: string[], fallback = 'Unknown author'): string {
  if (authors.length === 0) return fallback;
  if (authors.length <= 2) return authors.join(' & ');
  return `${authors[0]} et al.`;
}

export function publishedYear(date?: string): string | undefined {
  const match = date?.match(/\d{4}/);
  return match?.[0];
}

export function languageName(code?: string): string | undefined {
  if (!code) return undefined;
  return LANGUAGE_NAMES[code] ?? code.toUpperCase();
}

/**
 * Google Books ส่ง description มาเป็น HTML
 * แปลงเป็นข้อความธรรมดาแบบแยกย่อหน้า เพื่อไม่ต้องใช้ dangerouslySetInnerHTML
 */
export function htmlToParagraphs(html?: string): string[] {
  if (!html) return [];
  const withBreaks = html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|li|h\d)\s*>/gi, '\n\n');
  const text =
    typeof DOMParser !== 'undefined'
      ? (new DOMParser().parseFromString(withBreaks, 'text/html').body.textContent ?? '')
      : withBreaks.replace(/<[^>]+>/g, '');
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

export function percent(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}
