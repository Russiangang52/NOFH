import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { standings } from "@/db/schema";
import { deleteStandingAction, saveStandingAction } from "@/app/admin/actions";
import { Icon } from "@/components/ui";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

const DIVISIONS = [
  "Чемпионат области",
  "Первенство области",
  "Студенты",
  "Юниоры",
  "Золотая шайба",
];

const SEASONS = ["2025-2026", "2024-2025", "2026-2027"];

export default async function AdminStandingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; group?: string }>;
}) {
  const { saved, deleted } = await searchParams;

  let rows: typeof standings.$inferSelect[] = [];
  try {
    rows = await db
      .select()
      .from(standings)
      .orderBy(asc(standings.season), asc(standings.division), asc(standings.position));
  } catch {
    rows = [];
  }

  const groups = new Map<string, typeof rows>();
  for (const row of rows) {
    const key = `${row.season}||${row.division}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }

  const FIELD =
    "w-full border border-line bg-paper px-3 py-2.5 text-[14px] text-ink-900 outline-none focus:border-ink-900";
  const LABEL =
    "mb-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted";
  const NUM =
    "w-full border border-line bg-paper px-3 py-2.5 text-[14px] text-ink-900 outline-none focus:border-ink-900 tnum";

  return (
    <>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-accent">Таблицы</p>
        <h1 className="mt-3 text-[2rem] font-bold tracking-tight text-ink-900">
          Турнирные таблицы
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] text-muted">
          Редактируйте очки, голы, победы и поражения. Создавайте новые турнирные
          таблицы — выберите сезон и дивизион, добавьте команды.
        </p>
      </div>

      {saved ? (
        <p className="mt-6 border-l-2 border-ink-900 py-2 pl-4 text-[13.5px] text-ink-700">
          Запись сохранена, таблица обновлена.
        </p>
      ) : null}
      {deleted ? (
        <p className="mt-6 border-l-2 border-accent py-2 pl-4 text-[13.5px] text-accent">
          Запись удалена.
        </p>
      ) : null}

      <div className="mt-10 border border-line p-7">
        <h2 className="eyebrow text-muted-2">Добавить команду в таблицу</h2>
        <form
          action={saveStandingAction}
          className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label className={LABEL} htmlFor="season">Сезон *</label>
            <input id="season" name="season" required list="seasons-list" defaultValue="2025-2026" className={FIELD} placeholder="2025-2026" />
            <datalist id="seasons-list">
              {SEASONS.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>

          <div>
            <label className={LABEL} htmlFor="division">Турнир (дивизион) *</label>
            <input id="division" name="division" required list="divisions-list" defaultValue="Чемпионат области" className={FIELD} placeholder="Чемпионат области" />
            <datalist id="divisions-list">
              {DIVISIONS.map((d) => <option key={d} value={d} />)}
            </datalist>
            <p className="mt-1 text-[11px] text-muted-2">
              Можно вписать своё название — будет создана новая таблица.
            </p>
          </div>

          <div>
            <label className={LABEL} htmlFor="team">Команда *</label>
            <input id="team" name="team" required className={FIELD} placeholder="ХК «Кстово»" />
          </div>

          <div>
            <label className={LABEL} htmlFor="city">Город</label>
            <input id="city" name="city" className={FIELD} placeholder="Кстово" />
          </div>

          <div>
            <label className={LABEL} htmlFor="position">Место</label>
            <input id="position" name="position" type="number" min="1" defaultValue="1" className={NUM} />
          </div>

          <div>
            <label className={LABEL} htmlFor="games">Игры</label>
            <input id="games" name="games" type="number" min="0" defaultValue="0" className={NUM} />
          </div>

          <div>
            <label className={LABEL} htmlFor="wins">Победы (осн.)</label>
            <input id="wins" name="wins" type="number" min="0" defaultValue="0" className={NUM} />
          </div>

          <div>
            <label className={LABEL} htmlFor="winsOt">Победы (ОТ)</label>
            <input id="winsOt" name="winsOt" type="number" min="0" defaultValue="0" className={NUM} />
          </div>

          <div>
            <label className={LABEL} htmlFor="winsSo">Победы (бул.)</label>
            <input id="winsSo" name="winsSo" type="number" min="0" defaultValue="0" className={NUM} />
          </div>

          <div>
            <label className={LABEL} htmlFor="lossesOt">Поражения (ОТ)</label>
            <input id="lossesOt" name="lossesOt" type="number" min="0" defaultValue="0" className={NUM} />
          </div>

          <div>
            <label className={LABEL} htmlFor="lossesSo">Поражения (бул.)</label>
            <input id="lossesSo" name="lossesSo" type="number" min="0" defaultValue="0" className={NUM} />
          </div>

          <div>
            <label className={LABEL} htmlFor="losses">Поражения (осн.)</label>
            <input id="losses" name="losses" type="number" min="0" defaultValue="0" className={NUM} />
          </div>

          <div>
            <label className={LABEL} htmlFor="goalsFor">Заброшено</label>
            <input id="goalsFor" name="goalsFor" type="number" min="0" defaultValue="0" className={NUM} />
          </div>

          <div>
            <label className={LABEL} htmlFor="goalsAgainst">Пропущено</label>
            <input id="goalsAgainst" name="goalsAgainst" type="number" min="0" defaultValue="0" className={NUM} />
          </div>

          <div>
            <label className={LABEL} htmlFor="points">Очки</label>
            <input id="points" name="points" type="number" min="0" defaultValue="0" className={NUM} />
          </div>

          <div className="flex items-end lg:col-span-1">
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 bg-ink-900 px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent">
              <Icon name="plus" className="h-4 w-4" strokeWidth={1.6} />
              Добавить
            </button>
          </div>
        </form>
      </div>

      {groups.size === 0 ? (
        <p className="mt-12 py-8 text-center text-[14px] text-muted">
          Пока нет ни одной записи. Добавьте первую команду выше.
        </p>
      ) : null}

      {Array.from(groups.entries()).map(([key, items]) => {
        const [season, division] = key.split("||");
        return (
          <section key={key} className="mt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
              <h2 className="text-[1.15rem] font-bold tracking-tight text-ink-900">
                {division}{" "}
                <span className="ml-2 text-[13px] font-medium text-muted">
                  {season} · {items.length} команд
                </span>
              </h2>
              <Link
                href={`/admin/standings/new?season=${encodeURIComponent(season)}&division=${encodeURIComponent(division)}`}
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent hover:underline"
              >
                + Команда в этот турнир
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="mt-5 w-full text-left text-[13px]">
                <thead className="border-b border-line text-[11px] uppercase tracking-[0.1em] text-muted">
                  <tr>
                    <th className="py-3 pr-3 font-semibold">№</th>
                    <th className="py-3 pr-3 font-semibold">Команда</th>
                    <th className="py-3 pr-3 font-semibold">Город</th>
                    <th className="py-3 pr-3 text-right font-semibold">И</th>
                    <th className="py-3 pr-3 text-right font-semibold">В</th>
                    <th className="py-3 pr-3 text-right font-semibold">ВОТ</th>
                    <th className="py-3 pr-3 text-right font-semibold">ВБ</th>
                    <th className="py-3 pr-3 text-right font-semibold">ПОТ</th>
                    <th className="py-3 pr-3 text-right font-semibold">ПБ</th>
                    <th className="py-3 pr-3 text-right font-semibold">П</th>
                    <th className="py-3 pr-3 text-right font-semibold">Ш</th>
                    <th className="py-3 pr-3 text-right font-semibold">О</th>
                    <th className="py-3 pr-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {items.map((row) => (
                    <tr key={row.id} className="hover:bg-paper-2">
                      <td className="py-3 pr-3 tnum text-ink-900">{row.position}</td>
                      <td className="py-3 pr-3 font-medium text-ink-900">{row.team}</td>
                      <td className="py-3 pr-3 text-muted">{row.city || "—"}</td>
                      <td className="py-3 pr-3 text-right tnum">{row.games}</td>
                      <td className="py-3 pr-3 text-right tnum">{row.wins}</td>
                      <td className="py-3 pr-3 text-right tnum">{row.winsOt}</td>
                      <td className="py-3 pr-3 text-right tnum">{row.winsSo}</td>
                      <td className="py-3 pr-3 text-right tnum">{row.lossesOt}</td>
                      <td className="py-3 pr-3 text-right tnum">{row.lossesSo}</td>
                      <td className="py-3 pr-3 text-right tnum">{row.losses}</td>
                      <td className="py-3 pr-3 text-right tnum text-muted">
                        {row.goalsFor}:{row.goalsAgainst}
                      </td>
                      <td className="py-3 pr-3 text-right tnum font-bold text-accent">{row.points}</td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/standings/${row.id}`}
                            className="border border-line-strong px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-900 transition-colors hover:border-ink-900"
                          >
                            Изменить
                          </Link>
                          <form action={deleteStandingAction}>
                            <input type="hidden" name="id" value={row.id} />
                            <button
                              type="submit"
                              className="border border-line px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-accent"
                            >
                              ✕
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-muted-2">
              И — игры, В — победы (осн.), ВОТ — в овертайме, ВБ — по буллитам,
              ПОТ — поражения в овертайме, ПБ — по буллитам, П — поражения (осн.),
              Ш — забито:пропущено, О — очки.
            </p>
          </section>
        );
      })}
    </>
  );
}
