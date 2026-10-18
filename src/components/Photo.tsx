"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { getFallback } from "@/lib/photos";

type Stage = "primary" | "media" | "pexels" | "broken";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Фотография с гарантированной подменой:
 * 1. основной путь (локальный файл или /api/media/…)
 * 2. для файлов из public/photos — копия из базы через /api/media/by-name
 * 3. резервное реальное фото по HTTPS (Pexels)
 * 4. оформленная заглушка — если ничего не загрузилось
 */
export default function Photo({
  src,
  alt,
  fill,
  sizes,
  priority,
  className = "",
}: Props) {
  const [stage, setStage] = useState<Stage>("primary");

  const fallback = getFallback(src);
  const mediaFallback = src.startsWith("/photos/")
    ? `/api/media/by-name?name=${encodeURIComponent(src.split("/").pop() ?? "")}`
    : null;

  const current =
    stage === "primary"
      ? src
      : stage === "media"
        ? mediaFallback
        : stage === "pexels"
          ? fallback?.src ?? null
          : null;

  // Next.js оптимизирует только локальные пути и разрешённые HTTPS-домены.
  // /api/media/… — локальный путь, /api/media/by-name?name=… тоже.
  const optimize =
    !!current &&
    (current.startsWith("/") || /^https?:\/\//.test(current));

  const onError = useCallback(() => {
    setStage((prev) => {
      if (prev === "primary" && mediaFallback) return "media";
      if (prev === "media" || (prev === "primary" && !mediaFallback)) {
        return fallback?.src ? "pexels" : "broken";
      }
      if (prev === "pexels") return "broken";
      return prev;
    });
  }, [mediaFallback, fallback?.src]);

  if (stage === "broken" || !current) {
    return (
      <span
        aria-label={alt}
        role="img"
        className={`flex items-center justify-center bg-paper-3 ${
          fill ? "absolute inset-0" : "block h-full w-full"
        } ${className}`}
      >
        <span className="flex flex-col items-center gap-2 px-4 text-center">
          <span className="h-px w-8 bg-accent" />
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-2">
            Фото
          </span>
        </span>
      </span>
    );
  }

  return (
    <Image
      src={current}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      unoptimized={!optimize}
      className={`photo-grade object-cover ${className}`}
      onError={onError}
    />
  );
}
