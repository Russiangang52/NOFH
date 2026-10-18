"use client";

import Image from "next/image";
import { useState } from "react";
import { isOwnedPhotoPath } from "@/lib/photos";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

function LocalPhoto({ src, alt, fill = true, sizes, priority, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  if (!isOwnedPhotoPath(src) || failed) {
    return (
      <span
        role="img"
        aria-label={alt ? `${alt}: фотография недоступна` : "Без фотографии"}
        className={`flex items-center justify-center bg-paper-3 ${fill ? "absolute inset-0" : "h-full w-full"}`}
      >
        <span className="px-4 text-center text-[11px] uppercase tracking-[0.12em] text-muted">
          {failed ? "Фотография недоступна" : "Без фотографии"}
        </span>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : 1200}
      height={fill ? undefined : 800}
      sizes={sizes}
      priority={priority}
      unoptimized
      className={`photo-grade object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

/** Same-origin files only. A missing event photo is never replaced by another event. */
export default function Photo(props: Props) {
  return <LocalPhoto key={props.src} {...props} />;
}
