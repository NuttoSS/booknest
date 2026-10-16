import { BookOpen, Info, LayoutDashboard, Library, Menu, Search } from 'lucide-react';
import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router';
import { useCollection } from '../store/collectionStore';

const NAV = [
  { to: '/', label: 'Home', icon: Search, end: true },
  { to: '/collection', label: 'My Collection', icon: Library, end: false },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: false },
  { to: '/about', label: 'About', icon: Info, end: false },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `relative px-1 py-5 text-sm transition-colors ${
    isActive
      ? 'text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary'
      : 'text-base-content/70 hover:text-base-content'
  }`;
}

export default function Layout() {
  const count = useCollection((s) => Object.keys(s.items).length);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 py-4">
            <BookOpen className="size-5 text-primary" />
            <span className="font-serif text-2xl font-semibold tracking-wide">
              Book<span className="text-primary">Nest</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="เมนูหลัก">
            {NAV.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={navClass}>
                {label}
                {to === '/collection' && count > 0 && (
                  <span className="badge badge-primary badge-xs ml-1.5 align-middle">{count}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile nav */}
          <div className="dropdown dropdown-end md:hidden">
            <button type="button" tabIndex={0} className="btn btn-ghost btn-square" aria-label="เปิดเมนู">
              <Menu className="size-5" />
            </button>
            <ul tabIndex={0} className="menu dropdown-content z-40 mt-2 w-56 rounded-box border border-base-300 bg-base-200 p-2 shadow-xl">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) => (isActive ? 'menu-active' : '')}
                    onClick={() => (document.activeElement as HTMLElement | null)?.blur()}
                  >
                    <Icon className="size-4" /> {label}
                    {to === '/collection' && count > 0 && <span className="badge badge-primary badge-xs">{count}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-base-300 py-6 text-center text-xs text-base-content/50">
        BookNest · Mini Project 2 · Book data by{' '}
        <a href="https://developers.google.com/books" target="_blank" rel="noreferrer" className="link link-primary">
          Google Books API
        </a>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
