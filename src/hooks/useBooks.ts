import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getBook, getFeaturedBooks, searchBooks } from '../api/googleBooks';
import { FEATURED_BOOKS } from '../lib/featured';
import type { SearchParams } from '../types/book';

export const bookKeys = {
  all: ['books'] as const,
  search: (p: SearchParams) => [...bookKeys.all, 'search', p] as const,
  featured: () => [...bookKeys.all, 'featured'] as const,
  detail: (id: string) => [...bookKeys.all, 'detail', id] as const,
};

export function useBookSearch(params: SearchParams, enabled = true) {
  return useQuery({
    queryKey: bookKeys.search(params),
    queryFn: ({ signal }) => searchBooks(params, signal),
    enabled,
    // แสดงผลลัพธ์เดิมค้างไว้ระหว่างโหลดหน้าใหม่ ไม่ให้ grid กระพริบ
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedBooks(enabled = true) {
  return useQuery({
    queryKey: bookKeys.featured(),
    queryFn: ({ signal }) => getFeaturedBooks(FEATURED_BOOKS, signal),
    enabled,
    staleTime: Infinity,
  });
}

export function useBook(id: string | undefined) {
  return useQuery({
    queryKey: bookKeys.detail(id ?? ''),
    queryFn: ({ signal }) => getBook(id as string, signal),
    enabled: Boolean(id),
    staleTime: 30 * 60 * 1000,
  });
}
