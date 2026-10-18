import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { matches } from "@/db/schema";
import { deleteMatchAction, saveMatchAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

function toDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const DIVISIONS = [
  "Чемпионат области",
  "Первенство области",
  "Студенты",
  "Юниоры",
  "Золотая шайба",
];

export default async function MatchEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const rows = await db
    .select()
    .from(matches)
    .where(eq(matches.id, numericId))
    .limit(1);
  const item = rows[0];
  if (!item) notFound();

  const FIELD =
    "w-full border border-line bg-paper px-4 py-3 text-[14.5px] text-ink-900 outline-none focus:border-ink-900";
  const LABEL =
    "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-accent">Событие</p>
          <h1 className="mt-3 text-[1.8rem] font-bold tracking-tight text-ink-900">
            {item.homeTeam} — {item.awayTeam}
          </h1>
        </div>
        <Link
          href="/admin/matches"
          className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-accent"
        >
          ← К списку
        </Link>
      </div>

      <form
        action={saveMatchAction}
        className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start"
      >
        <input type="hidden" name="id" value={item.id} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="homeTeam">
              Хозяева *
            </label>
            <input
              id="homeTeam"
              name="homeTeam"
              required
              defaultValue={item.homeTeam}
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="awayTeam">
              Гости *
            </label>
            <input
              id="awayTeam"
              name="awayTeam"
              required
              defaultValue={item.awayTeam}
              className={FIELD}
            />
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
              defaultValue={toDateTimeLocal(item.startsAt)}
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="division">
              Турнир
            </label>
            <select
              id="division"
              name="division"
              defaultValue={item.division}
              className={FIELD}
            >
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={LABEL} htmlFor="stage">
              Стадия
            </label>
            <input
              id="stage"
              name="stage"
              defaultValue={item.stage}
              className={FIELD}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={LABEL} htmlFor="venue">
              Площадка
            </label>
            <input
              id="venue"
              name="venue"
              defaultValue={item.venue}
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL} htmlFor="homeScore">
              Голы хозяев
            </label>
            <input
              id="homeScore"
              name="homeScore"
              type="number"
              min="0"
              defaultValue={item.homeScore ?? ""}
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="awayScore">
              Голы гостей
            </label>
            <input
              id="awayScore"
              name="awayScore"
              type="number"
              min="0"
              defaultValue={item.awayScore ?? ""}
              className={FIELD}
            />
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8">
          <div className="border border-line p-6">
            <p className="eyebrow text-muted-2">Статус</p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
              {item.homeScore !== null
                ? "Счёт указан — событие показывается в разделе результатов."
                : "Счёт не указан — событие показывается в ближайших матчах."}
            </p>
            <div className="mt-5">
              <label className={LABEL} htmlFor="status">
                Принудительно
              </label>
              <select
                id="status"
                name="status"
                defaultValue={item.status}
                className={FIELD}
              >
                <option value="scheduled">Запланировано</option>
                <option value="finished">Сыграно</option>
              </select>
              <p className="mt-2 text-[12px] text-muted-2">
                Применяется, только если счёт не заполнен.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-ink-900 px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent"
            >
              Сохранить
            </button>
          </div>

        </aside>
      </form>

      <form action={deleteMatchAction} className="mt-8 border-t border-line pt-6">
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          className="border border-line px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:border-accent hover:text-accent"
        >
          Удалить событие
        </button>
      </form>
    </>
  );
}
