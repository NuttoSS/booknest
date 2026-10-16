import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function pageWindow(page: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-8 flex justify-center" aria-label="เลือกหน้า">
      <div className="join">
        <button
          type="button"
          className="join-item btn btn-sm"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="หน้าก่อนหน้า"
        >
          <ChevronLeft className="size-4" />
        </button>
        {pageWindow(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="join-item btn btn-sm btn-disabled">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`join-item btn btn-sm ${p === page ? 'btn-primary' : ''}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          className="join-item btn btn-sm"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="หน้าถัดไป"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}
