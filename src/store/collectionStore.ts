import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Book, BookSummary, ReadingStatus } from '../types/book';
import { STATUSES } from '../lib/constants';
import { percent } from '../lib/format';

export interface CollectionItem {
  book: BookSummary;
  status: ReadingStatus;
  addedAt: number;
  updatedAt: number;
}

interface CollectionState {
  items: Record<string, CollectionItem>;
  addBook: (book: Book | BookSummary, status: ReadingStatus) => void;
  setStatus: (id: string, status: ReadingStatus) => void;
  removeBook: (id: string) => void;
  clear: () => void;
}

export function toSummary(b: Book | BookSummary): BookSummary {
  return {
    id: b.id,
    title: b.title,
    authors: b.authors,
    publishedDate: b.publishedDate,
    thumbnail: b.thumbnail,
    categories: b.categories,
    pageCount: b.pageCount,
  };
}

export const useCollection = create<CollectionState>()(
  persist(
    (set) => ({
      items: {},

      addBook: (book, status) =>
        set((state) => {
          const now = Date.now();
          const existing = state.items[book.id];
          return {
            items: {
              ...state.items,
              [book.id]: {
                book: toSummary(book),
                status,
                addedAt: existing?.addedAt ?? now,
                updatedAt: now,
              },
            },
          };
        }),

      setStatus: (id, status) =>
        set((state) => {
          const item = state.items[id];
          if (!item || item.status === status) return state;
          return { items: { ...state.items, [id]: { ...item, status, updatedAt: Date.now() } } };
        }),

      removeBook: (id) =>
        set((state) => {
          if (!state.items[id]) return state;
          const next = { ...state.items };
          delete next[id];
          return { items: next };
        }),

      clear: () => set({ items: {} }),
    }),
    {
      name: 'booknest-collection',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function useBookStatus(id: string | undefined): ReadingStatus | undefined {
  return useCollection((s) => (id ? s.items[id]?.status : undefined));
}

export interface CollectionStats {
  total: number;
  counts: Record<ReadingStatus, number>;
  percents: Record<ReadingStatus, number>;
  completionRate: number;
  totalPagesRead: number;
  topCategories: { name: string; count: number }[];
  recent: CollectionItem[];
}
export function useCollectionStats(): CollectionStats {
  const items = useCollection((s) => s.items);

  return useMemo(() => {
    const list = Object.values(items);
    const counts: Record<ReadingStatus, number> = { want: 0, reading: 0, read: 0 };
    const categoryCount = new Map<string, number>();
    let totalPagesRead = 0;

    for (const item of list) {
      counts[item.status] += 1;
      if (item.status === 'read') totalPagesRead += item.book.pageCount ?? 0;
      for (const c of item.book.categories) categoryCount.set(c, (categoryCount.get(c) ?? 0) + 1);
    }

    const total = list.length;
    const percents = Object.fromEntries(STATUSES.map((s) => [s, percent(counts[s], total)])) as Record<
      ReadingStatus,
      number
    >;

    return {
      total,
      counts,
      percents,
      completionRate: percents.read,
      totalPagesRead,
      topCategories: [...categoryCount.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      recent: [...list].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5),
    };
  }, [items]);
}
