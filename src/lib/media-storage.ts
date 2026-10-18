import sharp from "sharp";
import { db } from "@/db";
import { media } from "@/db/schema";
import { MAX_PHOTO_BYTES, PHOTO_MIME_TYPES, type LibraryPhoto } from "@/lib/photos";

export class PhotoUploadError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = "PhotoUploadError";
  }
}

export async function storePhoto(file: File): Promise<LibraryPhoto> {
  if (file.size === 0) throw new PhotoUploadError("Выберите непустой файл фотографии.");
  if (file.size > MAX_PHOTO_BYTES) {
    throw new PhotoUploadError("Файл больше 4 МБ. Уменьшите его перед загрузкой.", 413);
  }
  if (!PHOTO_MIME_TYPES.includes(file.type)) {
    throw new PhotoUploadError("Поддерживаются только JPEG, PNG и WebP. SVG, GIF и другие файлы не принимаются.");
  }

  let encoded: { data: Buffer; info: { width: number; height: number } };
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const image = sharp(bytes, { limitInputPixels: 40_000_000, failOn: "warning" });
    const metadata = await image.metadata();
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format) || (metadata.pages ?? 1) > 1) {
      throw new Error("Unsupported image content");
    }
    encoded = await image
      .rotate()
      .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 86 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new PhotoUploadError("Не удалось прочитать фотографию. Используйте исправный JPEG, PNG или WebP до 40 мегапикселей.");
  }
  if (encoded.data.byteLength > MAX_PHOTO_BYTES) {
    throw new PhotoUploadError("Изображение слишком большое после обработки. Уменьшите разрешение.", 413);
  }

  const base = file.name
    .replace(/\.[^.]*$/, "")
    .replace(/[\\/\x00-\x1f\x7f]/g, "-")
    .slice(0, 180) || "photo";
  const [row] = await db.insert(media).values({
    filename: `${base}.webp`,
    mime: "image/webp",
    data: encoded.data.toString("base64"),
  }).returning({ id: media.id, filename: media.filename, createdAt: media.createdAt });

  return {
    id: `uploaded-${row.id}`,
    mediaId: row.id,
    url: `/api/media/${row.id}`,
    filename: row.filename,
    title: base,
    mime: "image/webp",
    bytes: encoded.data.byteLength,
    width: encoded.info.width,
    height: encoded.info.height,
    storage: "database",
    createdAt: row.createdAt.toISOString(),
  };
}
