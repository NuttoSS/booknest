import { STATUSES, STATUS_META } from '../lib/constants';
import type { ReadingStatus } from '../types/book';

interface Props {
  value: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
  className?: string;
}

export default function StatusSelect({ value, onChange, className = '' }: Props) {
  return (
    <select
      aria-label="สถานะการอ่าน"
      className={`select select-xs w-full ${className}`}
      style={{ borderLeft: `3px solid ${STATUS_META[value].cssVar}` }}
      value={value}
      onChange={(e) => onChange(e.target.value as ReadingStatus)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_META[s].label}
        </option>
      ))}
    </select>
  );
}
