"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/content";
import { Icon, Logo } from "@/components/ui";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (item: (typeof NAV)[number]) => {
    if (item.href === "/") return pathname === "/";
    if (pathname.startsWith(item.href)) return true;
    return (item.children ?? []).some((c) => pathname.startsWith(c.href));
  };

  return (
    <header>
      {/* utility bar */}
      <div className="hidden bg-ink-900 text-white/70 md:block">
        <div className="container-x flex h-10 items-center justify-between text-[11.5px]">
          <p className="tracking-wide">
            Официальный сайт · Региональная общественная организация · с{" "}
            {SITE.founded} года
          </p>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <Icon name="phone" className="h-3.5 w-3.5" strokeWidth={1.5} />
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <Icon name="mail" className="h-3.5 w-3.5" strokeWidth={1.5} />
              {SITE.email}
            </a>
            <a
              href={SITE.vk}
              target="_blank"
              rel="noreferrer"
              className="tracking-[0.12em] uppercase text-[10.5px] transition-colors hover:text-white"
            >
              Вконтакте
            </a>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div
        className={`sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-[2px] transition-shadow duration-300 ${
          stuck ? "shadow-[0_8px_24px_-18px_rgba(11,16,22,.5)]" : ""
        }`}
      >
        <div className="container-x flex items-center justify-between gap-8">
          <Link
            href="/"
            className={`flex items-center gap-3 transition-all duration-300 ${
              stuck ? "py-3" : "py-4"
            }`}
          >
            <Logo
              className={`text-ink-900 transition-all duration-300 ${
                stuck ? "h-9 w-9" : "h-11 w-11"
              }`}
            />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold tracking-tight text-ink-900">
                Федерация хоккея
              </span>
              <span className="block text-[10.5px] uppercase tracking-[0.18em] text-muted">
                Нижегородская область
              </span>
            </span>
          </Link>

          <nav className="hidden h-full items-stretch gap-7 md:flex">
            {NAV.map((item) => (
              <div key={item.label} className="group relative flex items-stretch">
                <Link
                  href={item.href}
                  data-active={isActive(item)}
                  className="nav-link flex items-center gap-1.5 py-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-700 transition-colors hover:text-ink-900 data-[active=true]:text-ink-900"
                >
                  {item.label}
                  {item.children ? (
                    <Icon
                      name="chevron"
                      className="h-3 w-3 text-muted-2 transition-transform duration-300 group-hover:rotate-180"
                      strokeWidth={1.8}
                    />
                  ) : null}
                </Link>

                {item.children ? (
                  <div className="dropdown-panel absolute left-0 top-full z-50 w-[300px] border border-line bg-paper shadow-[0_24px_48px_-28px_rgba(11,16,22,.45)]">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="group/i flex items-center justify-between border-b border-line px-5 py-3 text-[13px] text-ink-700 transition-colors last:border-b-0 hover:bg-paper-2 hover:text-ink-900"
                      >
                        {child.label}
                        <Icon
                          name="arrow"
                          className="h-3.5 w-3.5 -translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover/i:translate-x-0 group-hover/i:opacity-100"
                          strokeWidth={1.6}
                        />
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/federaciya/quest"
              className="hidden bg-ink-900 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent inline-flex"
            >
              Задать вопрос
            </Link>
            <button
              type="button"
              aria-label="Меню"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] border border-line md:hidden"
            >
              <span
                className={`h-px w-5 bg-ink-900 transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-5 bg-ink-900 transition-all duration-300 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-5 bg-ink-900 transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink-900/35 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[90%] max-w-sm overflow-y-auto bg-paper px-6 pb-16 pt-24 transition-transform duration-500 ease-[cubic-bezier(.19,1,.22,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-line">
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  className="flex-1 py-4 font-display text-[17px] font-semibold text-ink-900"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <button
                    type="button"
                    aria-label="Подменю"
                    onClick={() =>
                      setExpanded(expanded === item.label ? null : item.label)
                    }
                    className={`flex h-8 w-8 items-center justify-center text-muted transition-transform duration-300 ${
                      expanded === item.label ? "rotate-180" : ""
                    }`}
                  >
                    <Icon name="chevron" className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                ) : null}
              </div>
              {item.children ? (
                <div
                  className="grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(.19,1,.22,1)]"
                  style={{
                    gridTemplateRows: expanded === item.label ? "1fr" : "0fr",
                  }}
                >
                  <div className="min-h-0">
                    <div className="pb-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-2 text-[14px] text-muted transition-colors hover:text-accent"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          <Link
            href="/federaciya/quest"
            className="mt-8 flex items-center justify-center bg-ink-900 px-6 py-4 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white"
          >
            Задать вопрос
          </Link>

          <div className="mt-8 space-y-2 text-[13px] text-muted">
            <p>{SITE.phone}</p>
            <p>{SITE.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
