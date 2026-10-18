/**
 * Резервные источники фотографий.
 *
 * 1. Основной путь — локальный файл в public/photos (самый быстрый и надёжный).
 * 2. Если файл не доехал (например, папка public не попала в деплой на Vercel),
 *    берём реальное фото по HTTPS. nofh.ru работает только по http, поэтому их
 *    изображения как резерв на HTTPS-сайте использоваться не могут.
 * 3. Если и это не загрузилось — компонент Photo рисует оформленную заглушку.
 */

const P = (id: number, w = 1800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const LUK = "Luke Miller / Pexels";
const RON = "Ron Lach / Pexels";

const FALLBACKS: Record<string, { src: string; credit?: string }> = {
  "/photos/news/radij-zanyal-2-e-mesto-vo-vserossijskom-finale.jpg": { src: P(8973008), credit: RON },
  "/photos/news/arzamas-oniks-uspeshno-vystupil-vo-vserossijskix.jpg": { src: P(8974645), credit: RON },
  "/photos/news/nngu-vyxodit-v-plej-off.jpg": { src: P(8974848), credit: RON },
  "/photos/news/rubin-pobeditel-vserossijskix-sorevnovanij-sredi.jpg": { src: P(8974645), credit: RON },
  "/photos/news/xk-rubin-pobeditel-vserossijskix-sorevnovanij-zo.png": { src: P(8973009), credit: RON },
  "/photos/news/dmitrij-kulyabov-laureat-premii-zhivu-studenches.png": { src: P(13978862), credit: LUK },
  "/photos/news/nizhnij-novgorod-kuznica-xokkejnyx-kadrov.jpg": { src: P(13978860), credit: LUK },
  "/photos/news/regionalnyj-final-zolotoj-shajby-2014-2015-zaver.jpg": { src: P(8973008), credit: RON },
  "/photos/news/regionalnyj-final-zolotoj-shajby-zevershyon.jpg": { src: P(8974645), credit: RON },
  "/photos/news/zavershilsya-polufinal-zolotoj-shajby-2008-2009.jpg": { src: P(13978860), credit: LUK },
  "/photos/news/xk-sechenovo-20092010-serebryanyj-prizer.jpg": { src: P(8973008), credit: RON },
  "/photos/news/itogi-turnira-pamyati-alekseya-chepko.jpg": { src: P(8974848), credit: RON },
  "/photos/news/ceremoniya-nagrazhdeniya-prizyorov-i-laureatov.jpg": { src: P(8973008), credit: RON },
  "/photos/news/aleksandr-snegov-luchshij-glavnyj-arbitr.png": { src: P(13978862), credit: LUK },
  "/photos/news/master-klass-dlya-sudej.jpg": { src: P(8973009), credit: RON },
  "/photos/news/uchebno-trenirovochnye-sbory-sudej-pfo.jpg": { src: P(13978862), credit: LUK },
  "/photos/news/zolotaya-shajba-3-kvoty-dlya-nizhegorodskoj-obla.jpg": { src: P(8974645), credit: RON },
  "/photos/news/cudejskij-master-klass.jpg": { src: P(8973009), credit: RON },
  "/photos/stock/action-1.jpg": { src: P(13978860, 2400), credit: LUK },
  "/photos/stock/action-2.jpg": { src: P(8974848, 2400), credit: RON },
  "/photos/stock/action-3.jpg": { src: P(13978862, 2400), credit: LUK },
  "/photos/stock/youth-game.jpg": { src: P(8974645, 2400), credit: RON },
  "/photos/stock/celebrate.jpg": { src: P(8973008, 2400), credit: RON },
  "/photos/stock/youth-bench.jpg": { src: P(8973009, 2400), credit: RON },
};

export type PhotoFallback = { src: string; credit?: string };

export function getFallback(src: string): PhotoFallback | null {
  const direct = FALLBACKS[src];
  if (direct) return direct;
  if (src.startsWith("/photos/")) {
    return { src: P(13978860), credit: LUK };
  }
  return null;
}

// === Типы и хелперы для медиатеки ===

export type LibraryPhoto = {
  id: string;
  mediaId?: number;
  url: string;
  filename: string;
  title: string;
  mime: string;
  bytes: number;
  width?: number;
  height?: number;
  storage: "database" | "project";
  createdAt?: string;
};

export type LibraryResponse = {
  photos: LibraryPhoto[];
  total: number;
  nextCursor: number | null;
};

export const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // 4 МБ
export const PHOTO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const OWNED_PREFIXES = ["/photos/", "/api/media/"];
export function isOwnedPhotoPath(src: string): boolean {
  return OWNED_PREFIXES.some(prefix => src.startsWith(prefix));
}

export function photoSize(bytes: number): string {
  if (!bytes) return "0 КБ";
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

export function photoDownloadUrl(photo: { url: string; filename: string }): string {
  const sep = photo.url.includes("?") ? "&" : "?";
  return `${photo.url}${sep}download=1`;
}

// === Bundled photos — из media-library/manifest.json (без node:fs, безопасно для браузера) ===

import photosManifest from "../../media-library/manifest.json";

type ManifestFile = {
  path: string;
  filename: string;
  category: "news" | "stock";
  title: string;
  mime: string;
  bytes: number;
  width: number;
  height: number;
};

export const BUNDLED_PHOTOS: LibraryPhoto[] = (photosManifest as { files: ManifestFile[] }).files.map(file => ({
  id: `project-${file.path}`,
  url: file.path,
  filename: file.filename,
  title: file.title,
  mime: file.mime,
  bytes: file.bytes,
  width: file.width,
  height: file.height,
  storage: "project" as const,
}));
