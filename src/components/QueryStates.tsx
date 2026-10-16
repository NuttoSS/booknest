import { RotateCw, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

export function BookGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="panel overflow-hidden">
          <div className="skeleton aspect-[2/3] w-full rounded-none" />
          <div className="space-y-2 p-3">
            <div className="skeleton h-3.5 w-4/5" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-6 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  retrying,
}: {
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <div role="alert" className="panel flex flex-col items-center gap-3 px-6 py-12 text-center">
      <TriangleAlert className="size-9 text-error" />
      <div>
        <p className="font-semibold">โหลดข้อมูลไม่สำเร็จ</p>
        <p className="mt-1 text-sm text-base-content/60">{message}</p>
      </div>
      {onRetry && (
        <button type="button" className="btn btn-primary btn-sm" onClick={onRetry} disabled={retrying}>
          {retrying ? <span className="loading loading-spinner loading-xs" /> : <RotateCw className="size-4" />}
          ลองใหม่ (Retry)
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="text-primary">{icon}</div>
      <p className="font-serif text-2xl font-semibold">{title}</p>
      {description && <p className="max-w-md text-sm text-base-content/60">{description}</p>}
      {action}
    </div>
  );
}
