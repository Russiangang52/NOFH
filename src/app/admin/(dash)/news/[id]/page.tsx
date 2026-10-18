import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { requireAdmin } from "@/lib/auth";
import NewsEditor, { type NewsDraft } from "@/components/admin/NewsEditor";

export const dynamic = "force-dynamic";

export default async function NewsFormPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  await ensureSeeded();
  const { id } = await params;
  const isNew = id === "new";
  let item = null;
  if (!isNew) {
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
    const rows = await db.select().from(news).where(eq(news.id, Number(id))).limit(1);
    item = rows[0] ?? null;
    if (!item) notFound();
  }
  const date = item?.publishedAt ?? new Date();
  const draft: NewsDraft = {
    id: item?.id,
    title: item?.title ?? "",
    body: item?.body ?? "",
    excerpt: item?.excerpt ?? "",
    category: item?.category === "nofh" ? "nofh" : "hockey",
    tags: item?.tags ?? "",
    slug: item?.slug ?? "",
    image: item?.image ?? "",
    featured: item?.featured ?? false,
    publishedAt: new Date(date.getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16),
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-accent">{isNew ? "Новый материал" : "Редактирование"}</p>
          <h1 className="mt-3 text-[1.8rem] font-bold tracking-tight text-ink-900">{isNew ? "Добавить новость" : "Изменить новость"}</h1>
        </div>
        <Link href="/admin/news" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-accent">← К списку</Link>
      </div>
      <NewsEditor initial={draft} />
    </>
  );
}
