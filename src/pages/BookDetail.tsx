import { ArrowLeft, BookmarkPlus, Check, ExternalLink, Plus, RotateCw, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import BookCover from '../components/BookCover';
import { ErrorState } from '../components/QueryStates';
import { useBook } from '../hooks/useBooks';
import { STATUSES, STATUS_META } from '../lib/constants';
import { formatAuthors, htmlToParagraphs, languageName, publishedYear } from '../lib/format';
import { useBookStatus, useCollection } from '../store/collectionStore';
import type { ReadingStatus } from '../types/book';

const STATUS_ICON: Record<ReadingStatus, typeof Plus> = {
  want: Plus,
  reading: RotateCw,
  read: Check,
};

function DetailSkeleton() {
  return (
    <div className="panel grid gap-8 p-6 md:grid-cols-[280px_1fr] md:p-10" aria-busy="true">
      <div className="skeleton aspect-[2/3] w-full" />
      <div className="space-y-4">
        <div className="skeleton h-3 w-40" />
        <div className="skeleton h-10 w-3/4" />
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-16 w-full" />
        <div className="skeleton h-32 w-full" />
      </div>
    </div>
  );
}

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: book, isPending, isError, error, refetch, isFetching } = useBook(id);

  const status = useBookStatus(id);
  const addBook = useCollection((s) => s.addBook);
  const setStatus = useCollection((s) => s.setStatus);
  const removeBook = useCollection((s) => s.removeBook);
  const [selected, setSelected] = useState<ReadingStatus>('want');

  const activeStatus = status ?? selected;

  const back = () => (window.history.length > 1 ? navigate(-1) : navigate('/'));

  return (
    <>
      <nav className="breadcrumbs mb-4 text-xs text-base-content/60" aria-label="breadcrumb">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/">Books</Link>
          </li>
          <li className="text-primary">{book?.title ?? '…'}</li>
        </ul>
      </nav>

      {isPending ? (
        <DetailSkeleton />
      ) : isError ? (
        <ErrorState message={error.message} onRetry={() => refetch()} retrying={isFetching} />
      ) : (
        <article className="panel grid gap-8 p-6 md:grid-cols-[280px_1fr] md:gap-12 md:p-10">
          {/* Cover column */}
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-box shadow-2xl shadow-black/50">
              <BookCover
                src={book.coverLarge ?? book.thumbnail}
                title={book.title}
                author={formatAuthors(book.authors)}
                size="large"
              />
            </div>
            {book.averageRating !== undefined && (
              <p className="flex items-center justify-center gap-1 text-sm text-base-content/70">
                <Star className="size-4 fill-primary text-primary" />
                {book.averageRating.toFixed(1)}
                <span className="text-base-content/45">({book.ratingsCount ?? 0} ratings)</span>
              </p>
            )}
            <button type="button" onClick={back} className="btn btn-ghost btn-sm justify-start text-primary">
              <ArrowLeft className="size-4" /> Back to all books
            </button>
          </div>

          {/* Info column */}
          <div className="min-w-0">
            <p className="eyebrow">
              Book details{book.categories[0] ? ` · ${book.categories[0]}` : ''}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight sm:text-5xl">{book.title}</h1>
            {book.subtitle && <p className="mt-1 font-serif text-xl text-base-content/70">{book.subtitle}</p>}
            <p className="mt-2 text-sm">
              by <span className="text-primary">{formatAuthors(book.authors)}</span>
            </p>

            {book.categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {book.categories.map((c) => (
                  <span key={c} className="badge badge-outline badge-sm border-base-300">
                    {c}
                  </span>
                ))}
              </div>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-base-300 py-4 text-sm sm:grid-cols-4">
              <Meta label="First published" value={publishedYear(book.publishedDate)} />
              <Meta label="Language" value={languageName(book.language)} />
              <Meta label="Pages" value={book.pageCount ? book.pageCount.toLocaleString() : undefined} />
              <Meta label="Your collection" value={status ? STATUS_META[status].label : 'Not added yet'} />
              {book.publisher && <Meta label="Publisher" value={book.publisher} className="col-span-2 sm:col-span-4" />}
            </dl>

            <section className="mt-6">
              <h2 className="font-serif text-2xl font-semibold">About this book</h2>
              <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-base-content/75">
                {htmlToParagraphs(book.description).length > 0 ? (
                  htmlToParagraphs(book.description).map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p className="italic text-base-content/50">ยังไม่มีเรื่องย่อสำหรับหนังสือเล่มนี้</p>
                )}
              </div>
            </section>

            {/* Quick Add Action */}
            <section className="mt-8 rounded-box border border-base-300 bg-base-100/60 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">Make it part of your story</h3>
                <p className="text-xs text-base-content/55">
                  {status ? 'สถานะจะบันทึกทันทีที่กด' : 'เลือกสถานะ แล้วกดเพิ่มเข้าคอลเลกชัน'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {STATUSES.map((s) => {
                  const Icon = STATUS_ICON[s];
                  const active = activeStatus === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={active}
                      onClick={() => (status ? setStatus(book.id, s) : setSelected(s))}
                      className={`btn btn-sm ${active ? '' : 'btn-outline border-base-300'}`}
                      style={
                        active
                          ? { background: STATUS_META[s].cssVar, borderColor: STATUS_META[s].cssVar, color: '#111' }
                          : undefined
                      }
                    >
                      <Icon className="size-3.5" /> {STATUS_META[s].label}
                    </button>
                  );
                })}

                <div className="ml-auto flex gap-2">
                  {status ? (
                    <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => removeBook(book.id)}>
                      <Trash2 className="size-4" /> Remove
                    </button>
                  ) : (
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => addBook(book, selected)}>
                      <BookmarkPlus className="size-4" /> Add to My Collection
                    </button>
                  )}
                </div>
              </div>
              {status && (
                <p className="mt-3 text-xs text-success">
                  ✓ อยู่ในคอลเลกชันแล้ว —{' '}
                  <Link to="/collection" className="link">
                    ไปที่ My Collection
                  </Link>
                </p>
              )}
            </section>

            {(book.previewLink || book.infoLink) && (
              <a
                href={book.previewLink ?? book.infoLink}
                target="_blank"
                rel="noreferrer"
                className="link link-hover mt-6 inline-flex items-center gap-1 text-sm text-base-content/60"
              >
                ดูบน Google Books <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
        </article>
      )}
    </>
  );
}

function Meta({ label, value, className = '' }: { label: string; value?: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[10px] uppercase tracking-widest text-base-content/45">{label}</dt>
      <dd className="mt-1 font-medium">{value ?? '—'}</dd>
    </div>
  );
}
