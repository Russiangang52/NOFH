import Image from "next/image";
import Link from "next/link";
import type { NewsRow } from "@/db/schema";
import { formatDate } from "@/components/ui";

export function NewsCard({
  item,
  size = "md",
}: {
  item: NewsRow;
  size?: "md" | "lg";
}) {
  const tag = item.tags.split(",").filter(Boolean)[0];

  return (
    <Link href={`/novosti/${item.slug}`} className="group block">
      <div
        className={`media-zoom relative overflow-hidden bg-paper-3 ${
          size === "lg" ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes={size === "lg" ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 100vw, 33vw"}
          className="photo-grade object-cover"
        />
      </div>

      <div className="pt-5">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-muted-2">
          {tag ? <span className="text-accent">{tag}</span> : null}
          <span className="h-px w-4 bg-line-strong" />
          <time className="tnum">{formatDate(item.publishedAt)}</time>
        </div>

        <h3
          className={`mt-3 font-semibold leading-[1.25] text-ink-900 transition-colors group-hover:text-accent ${
            size === "lg" ? "text-[1.65rem] sm:text-[2rem]" : "text-[1.1rem]"
          }`}
        >
          {item.title}
        </h3>

        <p
          className={`mt-3 text-[14px] leading-relaxed text-muted ${
            size === "lg" ? "line-clamp-3 max-w-2xl" : "line-clamp-2"
          }`}
        >
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}

export function NewsRowItem({ item, index }: { item: NewsRow; index: number }) {
  return (
    <Link
      href={`/novosti/${item.slug}`}
      className="group grid grid-cols-[auto_1fr] gap-5 border-b border-line py-5 last:border-b-0"
    >
      <span className="tnum pt-1 text-[12px] font-semibold text-line-strong transition-colors group-hover:text-accent">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span>
        <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-muted-2">
          <time className="tnum">{formatDate(item.publishedAt)}</time>
        </span>
        <span className="mt-1.5 block text-[15.5px] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-accent">
          {item.title}
        </span>
      </span>
    </Link>
  );
}
