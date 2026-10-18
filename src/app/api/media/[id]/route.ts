import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: "Некорректный идентификатор" }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(media)
    .where(eq(media.id, numericId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
  }

  const buffer = Buffer.from(row.data, "base64");
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": row.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(buffer.byteLength),
    },
  });
}
