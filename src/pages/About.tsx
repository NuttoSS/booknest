import { BookOpen, Code, Database, ExternalLink, Layers, Palette } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const TEAM = [
  {
    no: '01',
    name: 'นาย นรากร นิลรวม',
    studentId: '1670704681',
    title: 'Frontend & UI Design',
    initials: 'นร',
    color: 'var(--color-primary)',
    duties: [
      ['UX/UI Design', 'ออกแบบ Wireframe และ Theme มืดผสมทอง'],
      ['Frontend Development', 'พัฒนาระบบแสดงผลด้วย React 19'],
      ['Interactive Layout', 'จัดการ Responsive Grid แสดงรายการหนังสือ'],
    ],
  },
  {
    no: '02',
    name: 'นาย ณัฐชาติ กาจณรงค์',
    studentId: '1660704618',
    title: 'API & Data Integration',
    initials: 'ณช',
    color: 'var(--color-secondary)',
    duties: [
      ['UX/UI Design', 'ร่วมวาง Flow หน้าคอลเลกชันและแดชบอร์ด'],
      ['API Integration', 'เชื่อมต่อ Google Books REST API'],
      ['State & Cache', 'จัดการข้อมูลด้วย TanStack Query และ Zustand'],
    ],
  },
];

const STACK = [
  { icon: Code, title: 'Frontend Core', items: ['React 19', 'Vite', 'TypeScript', 'React Router v7'] },
  { icon: Layers, title: 'State & API', items: ['TanStack Query', 'Zustand + persist', 'LocalStorage', 'Google Books API'] },
  { icon: Palette, title: 'UI & UX', items: ['Tailwind CSS', 'DaisyUI', 'Loading & Retry', 'Responsive'] },
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="The people behind the pages"
        title={
          <>
            About <span className="text-primary">BookNest</span>
          </>
        }
        description="พื้นที่ส่วนตัวสำหรับค้นหาหนังสือ เก็บเรื่องราวที่สำคัญ และติดตามทุกก้าวของการอ่าน — All-in-One Book Space สำหรับนักอ่านยุคใหม่"
        action={
          <div className="panel px-5 py-3">
            <p className="font-serif text-3xl font-semibold text-primary">5</p>
            <p className="text-xs text-base-content/55">pages · Discover · Organize · Track</p>
          </div>
        }
      />

      <section className="mb-10">
        <h2 className="font-serif text-3xl font-semibold">Meet the Team</h2>
        <p className="mb-5 text-sm text-base-content/60">ผู้จัดทำโครงการ Mini Project 2 — Web Application Development</p>
        <div className="grid gap-5 md:grid-cols-2">
          {TEAM.map((m) => (
            <article key={m.no} className="panel relative overflow-hidden p-6">
              <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: m.color }} />
              <div className="flex items-start gap-4">
                <div
                  className="grid size-14 shrink-0 place-items-center rounded-full text-lg font-semibold text-base-100"
                  style={{ background: m.color }}
                  aria-hidden
                >
                  {m.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow" style={{ color: m.color }}>
                    Member {m.no}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{m.name}</h3>
                  <p className="text-xs text-base-content/60">{m.title}</p>
                </div>
              </div>
              <dl className="mt-5 space-y-2 border-t border-base-300 pt-4 text-sm">
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <dt className="text-base-content/50">Student ID</dt>
                  <dd className="font-mono">{m.studentId}</dd>
                </div>
                {m.duties.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[120px_1fr] gap-2">
                    <dt className="text-base-content/50">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-5 font-serif text-3xl font-semibold">Technology Stack</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {STACK.map(({ icon: Icon, title, items }) => (
            <div key={title} className="panel p-5">
              <p className="flex items-center gap-2 font-semibold">
                <Icon className="size-4 text-primary" /> {title}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((i) => (
                  <span key={i} className="badge badge-outline badge-sm border-base-300">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* API Attribution */}
      <section className="panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <BookOpen className="size-6" />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-2xl font-semibold">
            Book data by <span className="text-primary">Google Books API</span>
          </h2>
          <p className="mt-1 text-sm text-base-content/65">
            ข้อมูลหนังสือ เรื่องย่อ และภาพปก ดึงจาก Google Books REST API (v1) ผ่าน endpoint{' '}
            <code className="text-xs">/volumes</code> และ <code className="text-xs">/volumes/&#123;volumeId&#125;</code>{' '}
            ส่วนรายการหนังสือและสถานะการอ่านของผู้ใช้เก็บไว้ใน LocalStorage ของเบราว์เซอร์เท่านั้น ไม่ต้องล็อกอิน
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs text-base-content/45">
            <Database className="size-3.5" /> ไม่มีการส่งข้อมูลคอลเลกชันของผู้ใช้ออกไปภายนอก
          </p>
        </div>
        <a
          href="https://developers.google.com/books/docs/v1/using"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline btn-primary btn-sm"
        >
          API Docs <ExternalLink className="size-3.5" />
        </a>
      </section>
    </>
  );
}
