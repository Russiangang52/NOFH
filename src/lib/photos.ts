import catalog from "../../media-library/manifest.json";

export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
export const PHOTO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  credit?: string;
  storage: "project" | "database";
  createdAt?: string;
};

export type LibraryResponse = {
  photos: LibraryPhoto[];
  total: number;
  nextCursor: number | null;
};

// Metadata only. Original bytes stay in media-library/originals, outside JS bundles.
export const BUNDLED_PHOTOS: LibraryPhoto[] = catalog.files.map((file, index) => ({
  id: `bundled-${index}`,
  url: file.path,
  filename: file.filename,
  title: file.title,
  mime: file.mime,
  bytes: file.bytes,
  width: file.width,
  height: file.height,
  credit: file.credit,
  storage: "project",
}));

const bundledPaths = new Set(BUNDLED_PHOTOS.map((file) => file.url));

export function isOwnedPhotoPath(value: string): boolean {
  return bundledPaths.has(value) || /^\/api\/media\/[1-9]\d*$/.test(value);
}

export function isBundledPhotoPath(value: string): boolean {
  return bundledPaths.has(value);
}

export function photoSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} МБ`
    : `${Math.max(1, Math.round(bytes / 1024))} КБ`;
}

export function photoDownloadUrl(photo: LibraryPhoto): string {
  return photo.storage === "database" ? `${photo.url}?download=1` : photo.url;
}
