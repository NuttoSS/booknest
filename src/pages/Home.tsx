import { BookOpen, LayoutGrid, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import { BookGridSkeleton, EmptyState, ErrorState } from '../components/QueryStates';
import { useBookSearch, useFeaturedBooks } from '../hooks/useBooks';
import { useDebounce } from '../hooks/useDebounce';
import { CATEGORIES, MAX_PAGES, PAGE_SIZE } from '../lib/constants';
import { QUICK_GENRES } from '../lib/featured';
import type { SortOrder } from '../types/book';

export default function Home() {
  // เก็บสถานะการค้นหาไว้ใน URL → กด Back แล้วกลับมาหน้าเดิมได้ / แชร์ลิงก์ได้
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const category = params.get('cat') ?? '';
  const orderBy: SortOrder = params.get('sort') === 'newest' ? 'newest' : 'relevance';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const [input, setInput] = useState(query);
  const debounced = useDebounce(input.trim());

  const update = (patch: Record<string, string | null>) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [k, v] of Object.entries(patch)) {
          if (v) next.set(k, v);
          else next.delete(k);
        }
        return next;
      },
      { replace: true },
    );

  // ค้นหาแบบ Real-time: เมื่อหยุดพิมพ์ ~0.45 วินาที
  useEffect(() => {
    if (debounced !== query) update({ q: debounced || null, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const isSearching = Boolean(query || category);
  // ยังไม่ค้นหา → แสดงหนังสือแนะนำ (Google Books คืนผลว่างถ้า q มีแค่ subject:)
  const search = useBookSearch({ query, category, orderBy, page }, isSearching);
  const featured = useFeaturedBooks(!isSearching);
  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } = isSearching ? search : featured;

  const totalPages = Math.min(MAX_PAGES, Math.ceil((data?.totalItems ?? 0) / PAGE_SIZE));
  const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label;

  const goToPage = (p: number) => {
    update({ page: p > 1 ? String(p) : null });
    window.scrollTo({ top: document.getElementById('results')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero */}
      <section className="panel relative mb-6 overflow-hidden px-6 py-10 sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, var(--color-primary) 0 14px, transparent 14px 22px, var(--color-secondary) 22px 30px, transparent 30px 44px)',
            maskImage: 'linear-gradient(to left, black, transparent 70%)',
          }}
        />
        <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">A world of stories awaits</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold leading-[1.05] sm:text-6xl">
              Discover Your <span className="italic text-primary">Next Read</span>
            </h1>
            <p className="mt-4 max-w-xl text-base-content/70">
              ค้นหาหนังสือจากคลังระดับโลก บันทึกเล่มที่ชอบ และติดตามความคืบหน้าการอ่านของคุณได้ในที่เดียว
            </p>
          </div>
          <blockquote className="hidden max-w-xs border-l-2 border-primary/60 pl-4 text-sm italic text-base-content/70 lg:block">
            “A room without books is like a body without a soul.”
            <footer className="mt-2 not-italic text-xs text-base-content/50">— Marcus Tullius Cicero</footer>
          </blockquote>
        </div>
      </section>

      {/* Search & Filter */}
      <form
        role="search"
        className="panel mb-10 grid gap-3 p-3 sm:p-4 md:grid-cols-[1fr_220px_180px]"
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: input.trim() || null, page: null });
        }}
      >
        <label className="input w-full">
          <Search className="size-4 opacity-60" />
          <input
            type="search"
            placeholder="Search by title, author or keyword…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="ค้นหาหนังสือ"
          />
          {isFetching && <span className="loading loading-spinner loading-xs text-primary" />}
          {input && !isFetching && (
            <button type="button" onClick={() => setInput('')} aria-label="ล้างคำค้น" className="opacity-60 hover:opacity-100">
              <X className="size-4" />
            </button>
          )}
        </label>

        <label className="select w-full">
          <span className="label">
            <LayoutGrid className="size-4" />
          </span>
          <select
            value={category}
            onChange={(e) => update({ cat: e.target.value || null, page: null })}
            aria-label="หมวดหมู่"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="select w-full">
          <span className="label">
            <SlidersHorizontal className="size-4" />
          </span>
          <select
            value={orderBy}
            disabled={!isSearching}
            onChange={(e) => update({ sort: e.target.value === 'newest' ? 'newest' : null, page: null })}
            aria-label="เรียงลำดับ"
          >
            <option value="relevance">Most Relevant</option>
            <option value="newest">Newest</option>
          </select>
        </label>

        <div className="flex flex-wrap gap-2 md:col-span-3" role="group" aria-label="หมวดยอดนิยม">
          {QUICK_GENRES.map((genre) => {
            const active = category === genre;
            return (
              <button
                key={genre}
                type="button"
                aria-pressed={active}
                className={`badge cursor-pointer transition-colors ${active ? 'badge-primary' : 'badge-outline hover:badge-primary'}`}
                onClick={() => update({ cat: active ? null : genre, page: null })}
              >
                {CATEGORIES.find((c) => c.value === genre)?.label ?? genre}
              </button>
            );
          })}
        </div>
      </form>

      {/* Results */}
      <section id="results" className="scroll-mt-24">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-3xl font-semibold">
              {isSearching ? (query ? `Results for “${query}”` : categoryLabel) : 'Recommended Books'}
            </h2>
            <p className="text-sm text-base-content/60">
              {isSearching && query && categoryLabel && category ? `in ${categoryLabel} · ` : ''}
              {isSearching ? 'Showing books that match your search' : 'Hand-picked favourites from around the world'}
            </p>
          </div>
          {data && data.totalItems > 0 && (
            <p className="flex items-center gap-2 text-sm text-primary">
              <BookOpen className="size-4" />
              {data.totalItems.toLocaleString()} books {isSearching ? `found · page ${page}` : 'picked for you'}
            </p>
          )}
        </div>

        {isPending ? (
          <BookGridSkeleton count={PAGE_SIZE} />
        ) : isError ? (
          <ErrorState message={error.message} onRetry={() => refetch()} retrying={isFetching} />
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={<Search className="size-10" />}
            title="No books found"
            description="ไม่พบหนังสือที่ตรงกับคำค้น ลองใช้คำอื่น หรือเปลี่ยนหมวดหมู่ดูนะ"
            action={
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setInput('');
                  setParams({}, { replace: true });
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div
            className={`grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${
              isPlaceholderData ? 'opacity-50' : ''
            }`}
          >
            {data.items.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {isSearching && data && <Pagination page={page} totalPages={Math.max(totalPages, page)} onChange={goToPage} />}
      </section>
    </>
  );
}
