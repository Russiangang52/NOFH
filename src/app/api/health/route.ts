import { sql } from "drizzle-orm";
import { db } from "@/db";
import { BUNDLED_PHOTOS } from "@/lib/photos";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({
      ok: true,
      db: true,
      media: {
        bundledOriginals: BUNDLED_PHOTOS.length,
        staticFolder: "public/photos",
        portableOriginals: "media-library/originals",
        uploads: "PostgreSQL: media",
        externalImageFallbacks: false,
      },
    });
  } catch {
    return Response.json({ ok: false, db: false }, { status: 500 });
  }
}
