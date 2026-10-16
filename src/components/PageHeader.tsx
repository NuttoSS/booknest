import type { ReactNode } from 'react';

interface Props {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, action }: Props) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-base-content/65">{description}</p>}
      </div>
      {action}
    </header>
  );
}
