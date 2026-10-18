import { existsSync } from "node:fs";
import path from "node:path";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const PHOTO_DIRS = ["public/photos/news", "public/photos/stock"];

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    const root = process.cwd();
    const photos = PHOTO_DIRS.map((dir) => {
      const full = path.join(root, dir);
      const exists = existsSync(full);
      const count = exists
        ? // eslint-disable-next-line @typescript-eslint/no-require-imports
          (require("node:fs") as typeof import("node:fs")).readdirSync(full)
            .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).length
        : 0;
      return { dir, exists, files: count };
    });

    return Response.json({
      ok: true,
      db: true,
      photos,
      photosOk: photos.every((p) => p.exists && p.files > 0),
      hint:
        photos.some((p) => !p.exists)
          ? "Папка public/photos не найдена: добавьте её в репозиторий (должна лежать рядом с src и package.json)."
          : null,
    });
  } catch {
    return Response.json({ ok: false, db: false }, { status: 500 });
  }
}
