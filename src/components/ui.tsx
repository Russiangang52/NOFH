import Link from "next/link";
import type { ReactNode } from "react";

/* ---------------- logo ---------------- */

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" className={className} aria-hidden="true" fill="none">
      <path
        d="M24 2 45 9.5v19.9C45 41 35.6 49.9 24 54 12.4 49.9 3 41 3 29.4V9.5L24 2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M15 15.5 21.5 33M33 15.5 26.5 33"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path d="M13 32.5h22" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="37" width="8" height="4" rx="1" fill="#c8102e" />
    </svg>
  );
}

/* ---------------- icons ---------------- */

export type IconName =
  | "arrow"
  | "arrow-up-right"
  | "calendar"
  | "document"
  | "whistle"
  | "book"
  | "scales"
  | "ban"
  | "transfer"
  | "press"
  | "pin"
  | "phone"
  | "mail"
  | "clock"
  | "play"
  | "trophy"
  | "download"
  | "plus"
  | "chevron"
  | "puck";

const PATHS: Record<IconName, ReactNode> = {
  arrow: <path d="M3 10h14M12 5l5 5-5 5" />,
  "arrow-up-right": <path d="M6 14 14 6M7 6h7v7" />,
  calendar: (
    <>
      <rect x="3" y="4.5" width="14" height="13" rx="1" />
      <path d="M3 8.5h14M7 2.5v4M13 2.5v4" />
    </>
  ),
  document: (
    <>
      <path d="M5 2.5h6.5L16 7v10.5H5z" />
      <path d="M11 2.5V7h5" />
    </>
  ),
  whistle: (
    <>
      <circle cx="8" cy="11" r="5" />
      <path d="M12.5 8.5 18 6.5v4l-5.5 1.5M8 11h0" />
    </>
  ),
  book: (
    <>
      <path d="M3.5 4h5a2.5 2.5 0 0 1 2.5 2.5V17a2 2 0 0 0-2-2h-5.5z" />
      <path d="M16.5 4h-5A2.5 2.5 0 0 0 9 6.5V17a2 2 0 0 1 2-2h5.5z" />
    </>
  ),
  scales: (
    <>
      <path d="M10 3v14M5 17h10M4 7h12M4 7 1.5 12.5h5zM16 7l2.5 5.5h-5z" />
    </>
  ),
  ban: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="m5 5 10 10" />
    </>
  ),
  transfer: <path d="M3 7h12l-3-3M17 13H5l3 3" />,
  press: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" rx="1" />
      <path d="M5.5 8h5M5.5 11h5M13 8h1.5M13 11h1.5" />
    </>
  ),
  pin: (
    <>
      <path d="M10 18s6-5.2 6-9.3A6 6 0 0 0 4 8.7C4 12.8 10 18 10 18Z" />
      <circle cx="10" cy="8.5" r="2.2" />
    </>
  ),
  phone: (
    <path d="M6.2 3h-2A1.2 1.2 0 0 0 3 4.2C3 11 9 17 15.8 17a1.2 1.2 0 0 0 1.2-1.2v-2l-3.4-1.2-1.5 1.8a11 11 0 0 1-4.5-4.5l1.8-1.5z" />
  ),
  mail: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" rx="1" />
      <path d="m3 6 7 5 7-5" />
    </>
  ),
  clock: (
    <>
      <circle cx="10" cy="10" r="7.2" />
      <path d="M10 5.5V10l3 2" />
    </>
  ),
  play: <path d="M7 4.5 15.5 10 7 15.5z" />,
  trophy: (
    <>
      <path d="M6 3h8v4.5a4 4 0 0 1-8 0z" />
      <path d="M6 4H3.5v1.5A3 3 0 0 0 6 8.4M14 4h2.5v1.5A3 3 0 0 1 14 8.4M8 11.5h4M7 17h6l-.6-2.5H7.6z" />
    </>
  ),
  download: <path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M3.5 15.5h13" />,
  plus: <path d="M10 4.5v11M4.5 10h11" />,
  chevron: <path d="m5 8 5 5 5-5" />,
  puck: (
    <>
      <ellipse cx="10" cy="7.5" rx="6.5" ry="2.5" />
      <path d="M3.5 7.5v4c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-4" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.4,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const filled = name === "play";
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/* ---------------- typography blocks ---------------- */

export function Eyebrow({
  children,
  tone = "accent",
}: {
  children: ReactNode;
  tone?: "accent" | "muted" | "light";
}) {
  const color =
    tone === "accent"
      ? "text-accent"
      : tone === "light"
        ? "text-white/60"
        : "text-muted";
  return <span className={`eyebrow ${color}`}>{children}</span>;
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  action,
  tone = "dark",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  action?: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <Eyebrow tone={tone === "light" ? "light" : "accent"}>{eyebrow}</Eyebrow>
        ) : null}
        <h2
          className={`mt-3 text-[1.9rem] font-bold leading-[1.1] sm:text-[2.4rem] ${
            tone === "light" ? "text-white" : "text-ink-900"
          }`}
        >
          {title}
        </h2>
        {lead ? (
          <p
            className={`mt-3 max-w-xl text-[0.95rem] leading-relaxed ${
              tone === "light" ? "text-white/65" : "text-muted"
            }`}
          >
            {lead}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ---------------- buttons ---------------- */

const BTN_BASE =
  "group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300";

export function Btn({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "accent" | "light";
  className?: string;
}) {
  const styles = {
    solid: "bg-ink-900 text-white hover:bg-accent",
    accent: "bg-accent text-white hover:bg-accent-dark",
    outline:
      "border border-line-strong text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-white",
    light:
      "border border-white/25 text-white hover:bg-white hover:text-ink-900",
  } as const;
  return (
    <Link href={href} className={`${BTN_BASE} ${styles[variant]} ${className}`}>
      {children}
      <Icon name="arrow" className="arrow-slide h-4 w-4" strokeWidth={1.6} />
    </Link>
  );
}

export function TextLink({
  href,
  children,
  tone = "dark",
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] ${
        tone === "light"
          ? "text-white/80 hover:text-white"
          : "text-ink-900 hover:text-accent"
      }`}
    >
      <span className="u-link">{children}</span>
      <Icon name="arrow" className="arrow-slide h-4 w-4" strokeWidth={1.6} />
    </Link>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "ink";
}) {
  const styles = {
    default: "border-line text-muted",
    accent: "border-accent/30 bg-accent-soft text-accent",
    ink: "border-ink-900/15 bg-paper-2 text-ink-700",
  } as const;
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------------- formatting ---------------- */

export function formatDate(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateShort(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
  }).format(d);
}

export function formatTime(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
