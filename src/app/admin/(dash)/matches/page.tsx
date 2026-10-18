import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { matches } from "@/db/schema";
import { deleteMatchAction, saveMatchAction } from "@/app/admin/actions";
import { Icon, formatDate, formatTime } from "@/components/ui";

export const dynamic = "force-dynamic";

const DIVISIONS = [
  "Чемпионат области",
  "Первенство области",
  "Студенты",
  "Юниоры",
  "Золотая шайба",
];

export default async function AdminMatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const rows = await db
    .select()
    .from(matches)
    .orderBy(desc(matches.startsAt))
    .limit(200);

  const now = Date.now();
  const upcoming = rows.filter(
    (m) => m.status === "scheduled" && m.startsAt.getTime() >= now - 36e5,
  );
  const past = rows.filter((m) => !upcoming.includes(m));

  const FIELD =
    "w-full border border-line bg-paper px-3 py-2.5 text-[14px] text-ink-900 outline-none focus:border-ink-900";
  const LABEL =
    "mb-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted";

  return (
    <>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-accent">Календарь</p>
        <h1 className="mt-3 text-[2rem] font-bold tracking-tight text-ink-900">
          Матчи и события
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] text-muted">
          Добавьте игру — она появится в расписании на сайте. Когда матч сыгран,
          впишите счёт: событие автоматически уйдёт из «ближайших» в результаты.
        </p>
      </div>

      {saved ? (
        <p className="mt-6 border-l-2 border-ink-900 py-2 pl-4 text-[13.5px] text-ink-700">
          Событие сохранено, расписание на сайте обновлено.
        </p>
      ) : null}
      {deleted ? (
        <p className="mt-6 border-l-2 border-accent py-2 pl-4 text-[13.5px] text-accent">
          Событие удалено.
        </p>
      ) : null}

      <div className="mt-10 border border-line p-7">
        <h2 className="eyebrow text-muted-2">Новое событие</h2>
        <form
          action={saveMatchAction}
          className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="lg:col-span-1">
            <label className={LABEL} htmlFor="homeTeam">
              Хозяева *
            </label>
            <input id="homeTeam" name="homeTeam" required className={FIELD} placeholder="ХК «Кстово»" />
          </div>
          <div className="lg:col-span-1">
            <label className={LABEL} htmlFor="awayTeam">
              Гости *
            </label>
            <input id="awayTeam" name="awayTeam" required className={FIELD} placeholder="Старт" />
          </div>
          <div>
            <label className={LABEL} htmlFor="startsAt">
              Дата и время *
            </label>
            <input
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              required
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="division">
              Турнир
            </label>
            <select id="division" name="division" className={FIELD}>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className={LABEL} htmlFor="venue">
              Площадка
            </label>
            <input id="venue" name="venue" className={FIELD} placeholder="ФОК «Кстово»" />
          </div>
          <div className="lg:col-span-2">
            <label className={LABEL} htmlFor="stage">
              Стадия
            </label>
            <input
              id="stage"
              name="stage"
              className={FIELD}
              placeholder="Регулярный чемпионат, 1/2 финала…"
            />
          </div>

          <div>
            <label className={LABEL} htmlFor="homeScore">
              Голы хозяев
            </label>
            <input id="homeScore" name="homeScore" type="number" min="0" className={FIELD} />
          </div>
          <div>
            <label className={LABEL} htmlFor="awayScore">
              Голы гостей
            </label>
            <input id="awayScore" name="awayScore" type="number" min="0" className={FIELD} />
          </div>
          <div className="flex items-end lg:col-span-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 bg-ink-900 px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent"
            >
              <Icon name="plus" className="h-4 w-4" strokeWidth={1.6} />
              Добавить событие
            </button>
          </div>
        </form>
        <p className="mt-4 text-[12px] text-muted-2">
          Если указать счёт, событие сразу попадёт в результаты как сыгранное.
        </p>
      </div>

      {/* upcoming */}
      <section className="mt-14">
        <h2 className="eyebrow border-b border-line pb-3 text-muted-2">
          Предстоящие ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <p className="py-4 text-[14px] text-muted">
            Пока ничего не запланировано.
          </p>
        ) : null}
        {upcoming.map((m) => (
          <div
            key={m.id}
            className="grid items-center gap-4 border-b border-line py-4 md:grid-cols-[150px_1fr_1fr_auto]"
          >
            <p className="tnum text-[13px] text-muted">
              {formatDate(m.startsAt)}
              <span className="block text-ink-900">
                {formatTime(m.startsAt)}
              </span>
            </p>
            <p className="text-[15px] font-semibold text-ink-900">
              {m.homeTeam} — {m.awayTeam}
            </p>
            <p className="text-[12.5px] text-muted">
              {m.division} · {m.stage}
              {m.venue ? <span className="block">{m.venue}</span> : null}
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/matches/${m.id}`}
                className="border border-line-strong px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-900 transition-colors hover:border-ink-900"
              >
                Изменить
              </Link>
              <form action={deleteMatchAction}>
                <input type="hidden" name="id" value={m.id} />
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
      </section>

      {/* past */}
      <section className="mt-14">
        <h2 className="eyebrow border-b border-line pb-3 text-muted-2">
          Прошедшие и сыгранные ({past.length})
        </h2>
        {past.map((m) => (
          <div
            key={m.id}
            className="grid items-center gap-4 border-b border-line py-4 md:grid-cols-[150px_1fr_1fr_auto]"
          >
            <p className="tnum text-[13px] text-muted">
              {formatDate(m.startsAt)}
            </p>
            <p className="text-[15px] font-semibold text-ink-900">
              {m.homeTeam} — {m.awayTeam}
              {m.homeScore !== null ? (
                <span className="tnum ml-2 text-accent">
                  {m.homeScore}:{m.awayScore}
                </span>
              ) : null}
            </p>
            <p className="text-[12.5px] text-muted">
              {m.division} · {m.stage}
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/matches/${m.id}`}
                className="border border-line-strong px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-900 transition-colors hover:border-ink-900"
              >
                Изменить
              </Link>
              <form action={deleteMatchAction}>
                <input type="hidden" name="id" value={m.id} />
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
      </section>
    </>
  );
}
