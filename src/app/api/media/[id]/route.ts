import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
import { PHOTO_MIME_TYPES } from "@/lib/photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return NextResponse.json({ error: "Файл не найден." }, { status: 404 });
  }
  try {
    const [row] = await db.select().from(media).where(eq(media.id, Number(id))).limit(1);
    if (!row || !PHOTO_MIME_TYPES.includes(row.mime)) {
      return NextResponse.json({ error: "Фотография не найдена." }, { status: 404 });
    }
    const bytes = Buffer.from(row.data, "base64");
    const etag = `"${createHash("sha256").update(bytes).digest("hex")}"`;
    const headers: Record<string, string> = {
      "Content-Type": row.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "ETag": etag,
    };
    if (request.headers.get("if-none-match") === etag) {
      return new NextResponse(null, { status: 304, headers });
    }
    if (new URL(request.url).searchParams.get("download") === "1") {
      const filename = encodeURIComponent(row.filename).replace(/'/g, "%27");
      headers["Content-Disposition"] = `attachment; filename="photo-${row.id}.${row.mime === "image/jpeg" ? "jpg" : row.mime.split("/")[1]}"; filename*=UTF-8''${filename}`;
    }
    headers["Content-Length"] = String(bytes.byteLength);
    return new NextResponse(new Uint8Array(bytes), { headers });
  } catch (error) {
    console.error("Photo storage is unavailable", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Хранилище временно недоступно." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
