import { Bookmark, BookmarkCheck, Calendar, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import type { Book, BookSummary } from '../types/book';
import { STATUS_META } from '../lib/constants';
import { formatAuthors, publishedYear } from '../lib/format';
import { useBookStatus, useCollection } from '../store/collectionStore';
import BookCover from './BookCover';
import StatusSelect from './StatusSelect';

interface Props {
  book: Book | BookSummary;
  /** "browse" = หน้า Home, "collection" = หน้า My Collection */
  variant?: 'browse' | 'collection';
}

export default function BookCard({ book, variant = 'browse' }: Props) {
  const status = useBookStatus(book.id);
  const addBook = useCollection((s) => s.addBook);
  const removeBook = useCollection((s) => s.removeBook);
  const setStatus = useCollection((s) => s.setStatus);

  const author = formatAuthors(book.authors);
  const year = publishedYear(book.publishedDate);

  const toggleSaved = () => {
    if (status) removeBook(book.id);
    else addBook(book, 'want');
  };

  return (
    <article className="group panel flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-primary/40">
      <Link to={`/book/${book.id}`} className="relative block overflow-hidden" tabIndex={-1}>
        <BookCover
          src={book.thumbnail}
          title={book.title}
          author={author}
          className="transition duration-300 group-hover:scale-[1.03]"
        />
        {status && variant === 'browse' && (
          <span className={`badge badge-sm ${STATUS_META[status].badge} absolute left-2 top-2 shadow`}>
            {STATUS_META[status].label}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link to={`/book/${book.id}`} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary">
          {book.title}
        </Link>
        <p className="truncate text-xs text-base-content/60">{author}</p>
        {year && (
          <p className="flex items-center gap-1 text-[11px] text-primary/80">
            <Calendar className="size-3" /> {year}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2">
          {variant === 'collection' && status ? (
            <>
              <StatusSelect value={status} onChange={(s) => setStatus(book.id, s)} />
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-square text-error/80 hover:text-error"
                onClick={() => removeBook(book.id)}
                aria-label={`ลบ ${book.title} ออกจากคอลเลกชัน`}
                title="Remove"
              >
                <Trash2 className="size-3.5" />
              </button>
            </>
          ) : (
            <>
              <Link to={`/book/${book.id}`} className="btn btn-outline btn-xs flex-1 border-base-300">
                View Details
              </Link>
              <button
                type="button"
                onClick={toggleSaved}
                className={`btn btn-xs btn-square ${status ? 'btn-primary' : 'btn-outline border-base-300'}`}
                aria-pressed={Boolean(status)}
                aria-label={status ? 'นำออกจากคอลเลกชัน' : 'บันทึกเป็น Want to Read'}
                title={status ? 'Saved — click to remove' : 'Save to Want to Read'}
              >
                {status ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
