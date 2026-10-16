import { Check, LayoutDashboard, Plus, RotateCw, Sparkles } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import BookCover from '../components/BookCover';
import PageHeader from '../components/PageHeader';
import { EmptyState } from '../components/QueryStates';
import { STATUSES, STATUS_META } from '../lib/constants';
import { formatAuthors } from '../lib/format';
import { useCollectionStats } from '../store/collectionStore';
import type { ReadingStatus } from '../types/book';

const ICONS: Record<ReadingStatus, typeof Plus> = { want: Plus, reading: RotateCw, read: Check };

function timeAgo(ts: number): string {
  const diff = Math.round((Date.now() - ts) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (diff < 60) return rtf.format(-diff, 'second');
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), 'minute');
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), 'hour');
  return rtf.format(-Math.round(diff / 86400), 'day');
}

export default function Dashboard() {
  const stats = useCollectionStats();
  const { total, counts, percents, completionRate } = stats;

  // Donut: สร้าง conic-gradient จากสัดส่วนแต่ละสถานะ
  let acc = 0;
  const segments = STATUSES.map((s) => {
    const start = acc;
    acc += total ? (counts[s] / total) * 100 : 0;
    return `${STATUS_META[s].cssVar} ${start}% ${acc}%`;
  }).join(', ');

  return (
    <>
      <PageHeader
        eyebrow="Your reading life, at a glance"
        title="Reading Dashboard"
        description="ภาพรวมคอลเลกชันของคุณ คำนวณใหม่ทันทีทุกครั้งที่เปลี่ยนสถานะการอ่าน"
      />

      {total === 0 ? (
        <EmptyState
          icon={<LayoutDashboard className="size-10" />}
          title="No stats yet"
          description="เพิ่มหนังสือเข้าคอลเลกชันก่อน แล้วสถิติการอ่านจะปรากฏที่นี่"
          action={
            <Link to="/" className="btn btn-primary btn-sm">
              Find your first book
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* 3 Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {STATUSES.map((s) => {
              const Icon = ICONS[s];
              return (
                <Link
                  key={s}
                  to="/collection"
                  className="panel p-5 transition hover:border-[var(--c)]"
                  style={{ '--c': STATUS_META[s].cssVar } as CSSProperties}
                >
                  <p className="flex items-center gap-2 text-sm text-base-content/75">
                    <Icon className="size-4" style={{ color: STATUS_META[s].cssVar }} />
                    {STATUS_META[s].label}
                  </p>
                  <p className="mt-3 flex items-baseline gap-3">
                    <span className="font-serif text-5xl font-semibold" style={{ color: STATUS_META[s].cssVar }}>
                      {counts[s]}
                    </span>
                    <span className="text-xs text-base-content/55">{STATUS_META[s].caption}</span>
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Progress bars + donut */}
          <section className="panel p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-base-300 pb-4">
              <h2 className="font-serif text-2xl font-semibold">Books by reading status</h2>
              <span className="text-xs text-primary">{total} books tracked</span>
            </div>

            <div className="grid items-center gap-8 md:grid-cols-[1fr_220px]">
              <ul className="space-y-5">
                {STATUSES.map((s) => (
                  <li key={s}>
                    <div className="mb-1.5 flex items-end justify-between text-sm">
                      <div>
                        <p>{STATUS_META[s].label}</p>
                        <p className="text-xs text-base-content/50">
                          {counts[s]} {counts[s] === 1 ? 'book' : 'books'} · {STATUS_META[s].thai}
                        </p>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: STATUS_META[s].cssVar }}>
                        {percents[s]}%
                      </span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-base-300"
                      role="progressbar"
                      aria-label={STATUS_META[s].label}
                      aria-valuenow={percents[s]}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${percents[s]}%`, background: STATUS_META[s].cssVar }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mx-auto flex flex-col items-center gap-2 md:border-l md:border-base-300 md:pl-8">
                <div
                  className="relative grid size-40 place-items-center rounded-full"
                  style={{ background: `conic-gradient(${segments})` }}
                  aria-hidden
                >
                  <div className="grid size-28 place-items-center rounded-full bg-base-200 text-center">
                    <div>
                      <p className="font-serif text-4xl font-semibold text-accent">{completionRate}%</p>
                      <p className="text-[10px] uppercase tracking-widest text-base-content/50">completed</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-base-content/55">อัตราความสำเร็จ (อ่านจบ / ทั้งหมด)</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent activity */}
            <section className="panel p-5">
              <h2 className="mb-4 font-serif text-xl font-semibold">Recent activity</h2>
              <ul className="space-y-3">
                {stats.recent.map((it) => (
                  <li key={it.book.id}>
                    <Link to={`/book/${it.book.id}`} className="flex items-center gap-3 rounded-lg p-1 hover:bg-base-300/50">
                      <div className="w-10 shrink-0 overflow-hidden rounded">
                        <BookCover src={it.book.thumbnail} title={it.book.title} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{it.book.title}</p>
                        <p className="truncate text-xs text-base-content/55">{formatAuthors(it.book.authors)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`badge badge-xs ${STATUS_META[it.status].badge}`}>{STATUS_META[it.status].label}</span>
                        <p className="mt-1 text-[10px] text-base-content/45">{timeAgo(it.updatedAt)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Top categories + pages */}
            <section className="panel p-5">
              <h2 className="mb-4 font-serif text-xl font-semibold">Favourite genres</h2>
              {stats.topCategories.length === 0 ? (
                <p className="text-sm text-base-content/55">ยังไม่มีข้อมูลหมวดหมู่</p>
              ) : (
                <ul className="space-y-2">
                  {stats.topCategories.map((c) => (
                    <li key={c.name} className="flex items-center gap-3 text-sm">
                      <span className="w-36 truncate">{c.name}</span>
                      <div className="h-1.5 flex-1 rounded-full bg-base-300">
                        <div
                          className="h-full rounded-full bg-primary/80"
                          style={{ width: `${(c.count / stats.topCategories[0].count) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-xs text-base-content/55">{c.count}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 rounded-lg bg-base-300/50 p-4 text-sm">
                <span className="font-serif text-3xl font-semibold text-primary">
                  {stats.totalPagesRead.toLocaleString()}
                </span>{' '}
                <span className="text-base-content/60">pages read from finished books</span>
              </div>
            </section>
          </div>

          {/* Motivation banner */}
          <div className="flex items-start gap-3 rounded-box border border-primary/25 bg-primary/5 p-4">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="text-sm">
              <p>
                You have finished <strong>{counts.read}</strong> of <strong>{total}</strong> books in your collection.
              </p>
              <p className="text-xs text-base-content/55">
                {counts.reading > 0
                  ? `กำลังอ่านอยู่ ${counts.reading} เล่ม — อีกนิดเดียว สู้ ๆ!`
                  : counts.want > 0
                    ? `มี ${counts.want} เล่มรออยู่ เลือกเล่มถัดไปแล้วเริ่มอ่านกันเลย`
                    : 'ยอดเยี่ยม! ไปหาเรื่องใหม่ ๆ มาเติมชั้นหนังสือกัน'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
