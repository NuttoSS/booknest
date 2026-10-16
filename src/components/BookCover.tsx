import { useState } from 'react';

const PALETTES = [
  ['#b4552d', '#e9a35a'],
  ['#2f4f45', '#8bb9a5'],
  ['#7a2a2a', '#d98a6c'],
  ['#1f3554', '#d8a64c'],
  ['#4b3a2a', '#d9b98a'],
  ['#3b4a2f', '#c8c27a'],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

interface Props {
  src?: string;
  title: string;
  author?: string;
  className?: string;
  size?: 'card' | 'large';
}

/** ภาพปกหนังสือ — ถ้าไม่มีภาพหรือโหลดไม่ได้จะสร้างปกกราฟิกแทน */
export default function BookCover({ src, title, author, className = '', size = 'card' }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  if (showImage) {
    return (
      <img
        src={src}
        alt={`ปกหนังสือ ${title}`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`aspect-[2/3] w-full object-cover ${className}`}
      />
    );
  }

  const [dark, light] = PALETTES[hash(title) % PALETTES.length];
  return (
    <div
      role="img"
      aria-label={`ปกหนังสือ ${title}`}
      className={`relative flex aspect-[2/3] w-full flex-col justify-end overflow-hidden p-3 ${className}`}
      style={{ background: `linear-gradient(160deg, ${dark}, #111)` }}
    >
      <div
        className="absolute -right-6 -top-6 size-24 rounded-full opacity-80"
        style={{ background: light }}
      />
      <div
        className="absolute bottom-1/3 left-0 right-0 h-1/3"
        style={{ background: `linear-gradient(135deg, transparent 49%, ${light}55 50%)` }}
      />
      <p
        className={`relative font-serif font-semibold leading-tight text-white ${
          size === 'large' ? 'text-3xl' : 'text-base'
        } line-clamp-2`}
      >
        {title}
      </p>
      {author && (
        <p className={`relative mt-1 text-white/70 ${size === 'large' ? 'text-sm' : 'text-[11px]'}`}>
          {author}
        </p>
      )}
    </div>
  );
}
