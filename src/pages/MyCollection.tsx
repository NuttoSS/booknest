import { Library, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import BookCard from '../components/BookCard';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import { EmptyState } from '../components/QueryStates';
import { COLLECTION_PAGE_SIZE, STATUSES, STATUS_META } from '../lib/constants';
import { useCollection, useCollectionStats } from '../store/collectionStore';
import type { ReadingStatus } from '../types/book';

type Tab = 'all' | ReadingStatus;
type Sort = 'recent' | 'updated' | 'title' | 'author';

export default function MyCollection() {
  const items = useCollection((s) => s.items);
  const { total, counts } = useCollectionStats();

  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Sort>('recent');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = Object.values(items).filter(
      (it) =>
        (tab === 'all' || it.status === tab) &&
        (!q ||
          it.book.title.toLowerCase().includes(q) ||
          it.book.authors.some((a) => a.toLowerCase().includes(q))),
    );
    list.sort((a, b) => {
      switch (sort) {
        case 'title':
          return a.book.title.localeCompare(b.book.title);
        case 'author':
          return (a.book.authors[0] ?? '').localeCompare(b.book.authors[0] ?? '');
        case 'updated':
          return b.updatedAt - a.updatedAt;
        default:
          return b.addedAt - a.addedAt;
      }
    });
    return list;
  }, [items, tab, search, sort]);

  const totalPages = Math.ceil(filtered.length / COLLECTION_PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const pageItems = filtered.slice((currentPage - 1) * COLLECTION_PAGE_SIZE, currentPage * COLLECTION_PAGE_SIZE);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All Books', count: total },
    ...STATUSES.map((s) => ({ key: s as Tab, label: STATUS_META[s].label, count: counts[s] })),
  ];

  return (
    <>
      <PageHeader
        eyebrow="Your personal reading space"
        title="My Collection"
        description="เก็บเล่มถัดไปไว้ใกล้ตัว อัปเดตความคืบหน้า และดูเล่มที่คุณอ่านจบแล้ว — ข้อมูลบันทึกไว้ในเบราว์เซอร์ของคุณ"
        action={
          <Link to="/" className="btn btn-primary btn-sm self-start sm:self-auto">
            <Plus className="size-4" /> Add Books
          </Link>
        }
      />

      {total === 0 ? (
        <EmptyState
          icon={<Library className="size-10" />}
          title="Your shelf is empty"
          description="ยังไม่มีหนังสือในคอลเลกชัน ไปค้นหาเล่มที่สนใจแล้วกดปุ่มบุ๊กมาร์กเพื่อเริ่มต้นได้เลย"
          action={
            <Link to="/" className="btn btn-primary btn-sm">
              Discover books
            </Link>
          }
        />
      ) : (
        <>
          {/* 3 Status Tabs (+ All) */}
          <div role="tablist" className="tabs tabs-box mb-4 w-fit max-w-full flex-nowrap overflow-x-auto bg-base-200">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className={`tab whitespace-nowrap ${tab === t.key ? 'tab-active' : ''}`}
                onClick={() => {
                  setTab(t.key);
                  setPage(1);
                }}
              >
                {t.label}
                <span className="ml-2 text-xs opacity-60">{t.count}</span>
              </button>
            ))}
          </div>

          <div className="panel mb-6 flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
            <label className="input input-sm w-full sm:max-w-sm">
              <Search className="size-4 opacity-60" />
              <input
                type="search"
                placeholder="Search by title or author…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                aria-label="ค้นหาในคอลเลกชัน"
              />
            </label>
            <div className="flex items-center gap-3 sm:ml-auto">
              <select
                className="select select-sm w-44"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                aria-label="เรียงลำดับ"
              >
                <option value="recent">Recently Added</option>
                <option value="updated">Recently Updated</option>
                <option value="title">Title A–Z</option>
                <option value="author">Author A–Z</option>
              </select>
              <span className="whitespace-nowrap text-xs text-base-content/55">
                Showing {pageItems.length} of {filtered.length} books
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="size-10" />}
              title="Nothing here yet"
              description="ไม่มีหนังสือในสถานะนี้ หรือไม่ตรงกับคำค้น"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pageItems.map((it) => (
                <BookCard key={it.book.id} book={it.book} variant="collection" />
              ))}
            </div>
          )}

          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
