import Link from "next/link";
import { desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { matches, news, questions } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { Icon, formatDate, formatTime } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await ensureSeeded();

  const [newsCount] = await db
    .select({ c: sql<number>`cast(count(*) as int)` })
    .from(news);
  const [upcoming] = await db
    .select({ c: sql<number>`cast(count(*) as int)` })
    .from(matches)
    .where(eq(matches.status, "scheduled"));
  const [finished] = await db
    .select({ c: sql<number>`cast(count(*) as int)` })
    .from(matches)
    .where(eq(matches.status, "finished"));
  const [openQuestions] = await db
    .select({ c: sql<number>`cast(count(*) as int)` })
    .from(questions)
    .where(sql`${questions.answer} is null`);

  const latestNews = await db
    .select()
    .from(news)
    .orderBy(desc(news.publishedAt))
    .limit(5);

  const nextMatches = await db
    .select()
    .from(matches)
    .where(
      gte(matches.startsAt, new Date(Date.now() - 36e5)),
    )
    .orderBy(matches.startsAt)
    .limit(5);

  const cards = [
    { label: "Новостей", value: newsCount?.c ?? 0, href: "/admin/news", note: "опубликовано на сайте" },
    { label: "Событий впереди", value: upcoming?.c ?? 0, href: "/admin/matches", note: "запланировано матчей" },
    { label: "Результатов", value: finished?.c ?? 0, href: "/admin/matches", note: "сыгранных матчей" },
    { label: "Без ответа", value: openQuestions?.c ?? 0, href: "/admin/questions", note: "обращений с сайта" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-accent">Панель управления</p>
          <h1 className="mt-3 text-[2rem] font-bold tracking-tight text-ink-900">
            Что нужно обновить?
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-2 bg-ink-900 px-5 py-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent"
          >
            <Icon name="plus" className="h-4 w-4" strokeWidth={1.6} />
            Новость
          </Link>
          <Link
            href="/admin/matches"
            className="inline-flex items-center gap-2 border border-line-strong px-5 py-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-900 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
          >
            Событие
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group bg-paper p-7 transition-colors hover:bg-paper-2"
          >
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-2">
              {c.label}
            </p>
            <p className="tnum mt-4 font-display text-[2.4rem] font-semibold leading-none text-ink-900 group-hover:text-accent">
              {c.value}
            </p>
            <p className="mt-3 text-[12px] text-muted-2">{c.note}</p>
          </Link>
        ))}
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <h2 className="eyebrow text-muted-2">Последние материалы</h2>
            <Link href="/admin/news" className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-900 hover:text-accent">
              Все
            </Link>
          </div>
          {latestNews.map((n) => (
            <Link
              key={n.id}
              href={`/admin/news/${n.id}`}
              className="row-hover flex items-baseline justify-between gap-4 border-b border-line py-3.5"
            >
              <span className="min-w-0">
                <span className="block truncate text-[14.5px] font-medium text-ink-900">
                  {n.title}
                </span>
                <span className="tnum mt-0.5 block text-[11.5px] text-muted-2">
                  {formatDate(n.publishedAt)} · {n.category === "nofh" ? "НОФХ" : "Хоккей"}
                </span>
              </span>
              <Icon name="arrow" className="h-4 w-4 shrink-0 text-muted-2" strokeWidth={1.4} />
            </Link>
          ))}
        </section>

        <section>
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <h2 className="eyebrow text-muted-2">Ближайшие события</h2>
            <Link href="/admin/matches" className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-900 hover:text-accent">
              Все
            </Link>
          </div>
          {nextMatches.length === 0 ? (
            <p className="py-4 text-[14px] text-muted">
              Запланированных матчей нет — добавьте событие.
            </p>
          ) : null}
          {nextMatches.map((m) => (
            <Link
              key={m.id}
              href={`/admin/matches/${m.id}`}
              className="row-hover flex items-baseline justify-between gap-4 border-b border-line py-3.5"
            >
              <span className="min-w-0">
                <span className="block truncate text-[14.5px] font-medium text-ink-900">
                  {m.homeTeam} — {m.awayTeam}
                </span>
                <span className="tnum mt-0.5 block text-[11.5px] text-muted-2">
                  {formatDate(m.startsAt)} · {formatTime(m.startsAt)} · {m.division}
                </span>
              </span>
              <Icon name="arrow" className="h-4 w-4 shrink-0 text-muted-2" strokeWidth={1.4} />
            </Link>
          ))}
        </section>
      </div>

      <section className="mt-14 border border-line bg-paper-2 p-8">
        <h2 className="text-[1.1rem] font-semibold text-ink-900">
          Как это работает
        </h2>
        <div className="mt-5 grid gap-8 text-[13.5px] leading-relaxed text-muted md:grid-cols-3">
          <p>
            <strong className="text-ink-900">Новости</strong> — пишете заголовок,
            текст и загружаете фото. Материал сразу появляется в разделе новостей
            и на главной.
          </p>
          <p>
            <strong className="text-ink-900">Матчи и события</strong> —
            добавляете игру с датой, площадкой и турниром. После матча вводите
            счёт — событие автоматически переносится в результаты.
          </p>
          <p>
            <strong className="text-ink-900">Обращения</strong> — здесь попадают
            вопросы из формы «Задать вопрос», можно сохранить ответ.
          </p>
        </div>
      </section>
    </>
  );
}
