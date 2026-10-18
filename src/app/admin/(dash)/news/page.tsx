import Photo from "@/components/Photo";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { deleteNewsAction } from "@/app/admin/actions";
import { Icon, formatDate } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const rows = await db.select().from(news).orderBy(desc(news.publishedAt));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-accent">Материалы</p>
          <h1 className="mt-3 text-[2rem] font-bold tracking-tight text-ink-900">
            Новости
          </h1>
          <p className="mt-2 text-[14px] text-muted">
            Всего материалов: <span className="tnum">{rows.length}</span>
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 bg-ink-900 px-5 py-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent"
        >
          <Icon name="plus" className="h-4 w-4" strokeWidth={1.6} />
          Добавить новость
        </Link>
      </div>

      {saved ? (
        <p className="mt-6 border-l-2 border-ink-900 py-2 pl-4 text-[13.5px] text-ink-700">
          Материал сохранён и опубликован.
        </p>
      ) : null}
      {deleted ? (
        <p className="mt-6 border-l-2 border-accent py-2 pl-4 text-[13.5px] text-accent">
          Материал удалён.
        </p>
      ) : null}

      <div className="mt-8">
        {rows.map((n) => (
          <div
            key={n.id}
            className="grid items-center gap-5 border-b border-line py-5 md:grid-cols-[100px_1fr_auto]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-paper-3">
              <Photo
                src={n.image}
                alt=""
                fill
                sizes="100px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-muted-2">
                <span className={n.category === "nofh" ? "text-accent" : ""}>
                  {n.category === "nofh" ? "Новости НОФХ" : "Хоккей"}
                </span>
                <span className="tnum">{formatDate(n.publishedAt)}</span>
                {n.featured ? <span>главная</span> : null}
                {n.tags ? <span>{n.tags.split(",")[0]}</span> : null}
              </div>
              <p className="mt-1.5 truncate text-[16px] font-semibold text-ink-900">
                {n.title}
              </p>
              <p className="tnum mt-1 text-[12px] text-muted-2">
                {n.views.toLocaleString("ru-RU")} просмотров · /{n.slug}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Link
                href={`/novosti/${n.slug}`}
                target="_blank"
                className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-accent"
              >
                Смотреть
              </Link>
              <Link
                href={`/admin/news/${n.id}`}
                className="border border-line-strong px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-900 transition-colors hover:border-ink-900"
              >
                Изменить
              </Link>
              <form action={deleteNewsAction}>
                <input type="hidden" name="id" value={n.id} />
                <button
                  type="submit"
                  className="border border-line px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  Удалить
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
