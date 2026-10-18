import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { Logo } from "@/components/ui";

const NAV = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/news", label: "Новости" },
  { href: "/admin/matches", label: "Матчи и события" },
  { href: "/admin/standings", label: "Турнирные таблицы" },
  { href: "/admin/questions", label: "Обращения" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper-2">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo className="h-9 w-9 text-ink-900" />
            <span className="leading-tight">
              <span className="block font-display text-[14px] font-bold text-ink-900">
                Панель управления
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-muted">
                НОФХ
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-accent"
            >
              Открыть сайт ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="border border-line-strong px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-900 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>

        <nav className="container-x flex gap-7 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link whitespace-nowrap py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="container-x py-10 md:py-14">{children}</main>
    </div>
  );
}
