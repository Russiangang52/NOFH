import { desc, lt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { MAX_PHOTO_BYTES, type LibraryPhoto } from "@/lib/photos";
import { PhotoUploadError, storePhoto } from "@/lib/media-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Войдите в панель управления." }, { status: 401 });
  const url = new URL(request.url);
  const rawCursor = url.searchParams.get("cursor");
  const cursor = rawCursor === null ? null : Number(rawCursor);
  if (cursor !== null && (!Number.isSafeInteger(cursor) || cursor <= 0)) {
    return NextResponse.json({ error: "Некорректная страница медиатеки." }, { status: 400 });
  }
  try {
    const rows = await db.select({
      id: media.id,
      filename: media.filename,
      mime: media.mime,
      createdAt: media.createdAt,
      bytes: sql<number>`(length(${media.data}) / 4 * 3 - case when right(${media.data}, 2) = '==' then 2 when right(${media.data}, 1) = '=' then 1 else 0 end)::int`,
    }).from(media).where(cursor === null ? undefined : lt(media.id, cursor)).orderBy(desc(media.id)).limit(51);
    const [count] = await db.select({ total: sql<number>`count(*)::int` }).from(media);
    const page = rows.slice(0, 50);
    const photos: LibraryPhoto[] = page.map((row) => ({
      id: `uploaded-${row.id}`, mediaId: row.id, url: `/api/media/${row.id}`,
      filename: row.filename, title: row.filename, mime: row.mime, bytes: row.bytes,
      storage: "database", createdAt: row.createdAt.toISOString(),
    }));
    return NextResponse.json({ photos, total: count.total, nextCursor: rows.length > 50 ? page[page.length - 1].id : null }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Media library could not be read", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Хранилище фотографий недоступно. Проверьте подключение PostgreSQL." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Сессия истекла. Войдите в панель управления снова." }, { status: 401 });
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get("host")) throw new Error("Foreign origin");
    } catch {
      return NextResponse.json({ error: "Загрузка разрешена только с этого сайта." }, { status: 403 });
    }
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_PHOTO_BYTES + 128 * 1024) {
    return NextResponse.json({ error: "Размер файла не должен превышать 4 МБ." }, { status: 413 });
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json({ error: "Не удалось получить файл. Повторите загрузку." }, { status: 400 });
  }
  const file = data.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Выберите фотографию." }, { status: 400 });

  try {
    const photo = await storePhoto(file);
    return NextResponse.json({ photo }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof PhotoUploadError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Photo could not be saved", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Фото не сохранено. Проверьте подключение к базе и попробуйте снова." }, { status: 503 });
  }
}
