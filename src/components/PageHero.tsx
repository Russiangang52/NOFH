import Link from "next/link";
import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs = [],
  aside,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumbs?: { label: string; href: string }[];
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="border-b border-line bg-paper-2">
        <div className="container-x flex h-11 items-center gap-2 overflow-x-auto whitespace-nowrap text-[11.5px] text-muted">
          <Link href="/" className="transition-colors hover:text-accent">
            Главная
          </Link>
          {breadcrumbs.map((b, i) => (
            <span key={b.href} className="flex items-center gap-2">
              <span className="text-line-strong">—</span>
              <Link
                href={b.href}
                className={
                  i === breadcrumbs.length - 1
                    ? "text-ink-900"
                    : "transition-colors hover:text-accent"
                }
              >
                {b.label}
              </Link>
            </span>
          ))}
        </div>
      </div>

      <div className="container-x py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div className="animate-soft-in max-w-3xl">
            {eyebrow ? (
              <span className="eyebrow block text-accent">{eyebrow}</span>
            ) : null}
            <h1 className="mt-4 text-[2.35rem] font-bold leading-[1.05] tracking-[-0.025em] text-ink-900 sm:text-[3.1rem]">
              {title}
            </h1>
            {lead ? (
              <p className="mt-5 max-w-2xl text-[1.0125rem] leading-[1.75] text-muted">
                {lead}
              </p>
            ) : null}
            {children ? <div className="mt-8">{children}</div> : null}
          </div>

          {aside ? (
            <div className="animate-soft-in lg:justify-self-end">{aside}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
