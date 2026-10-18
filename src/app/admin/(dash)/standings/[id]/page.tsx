import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { standings } from "@/db/schema";
import { deleteStandingAction, saveStandingAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const DIVISIONS = [
  "Чемпионат области",
  "Первенство области",
  "Студенты",
  "Юниоры",
  "Золотая шайба",
];

const SEASONS = ["2025-2026", "2024-2025", "2026-2027"];

export default async function StandingEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; division?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  // Создание новой записи: id === "new"
  const isNew = id === "new";
  let item: typeof standings.$inferSelect | null = null;

  if (!isNew) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) notFound();
    const rows = await db
      .select()
      .from(standings)
      .where(eq(standings.id, numericId))
      .limit(1);
    item = rows[0] ?? null;
    if (!item) notFound();
  }

  const FIELD =
    "w-full border border-line bg-paper px-4 py-3 text-[14.5px] text-ink-900 outline-none focus:border-ink-900";
  const NUM =
    "w-full border border-line bg-paper px-4 py-3 text-[14.5px] text-ink-900 outline-none focus:border-ink-900 tnum";
  const LABEL =
    "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

  // Значения по умолчанию: либо из записи, либо из query (для новой в этом турнире)
  const defaultSeason = item?.season ?? query.season ?? "2025-2026";
  const defaultDivision = item?.division ?? query.division ?? "Чемпионат области";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-accent">
            {isNew ? "Новая запись" : "Редактирование"}
          </p>
          <h1 className="mt-3 text-[1.8rem] font-bold tracking-tight text-ink-900">
            {isNew ? "Команда в таблице" : item!.team}
          </h1>
        </div>
        <Link
          href="/admin/standings"
          className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-accent"
        >
          ← К списку таблиц
        </Link>
      </div>

      <form
        action={saveStandingAction}
        className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start"
      >
        {item ? <input type="hidden" name="id" value={item.id} /> : null}

        <div className="space-y-6">
          {/* Основная информация */}
          <div className="border border-line p-6">
            <p className="eyebrow text-muted-2">Команда</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={LABEL} htmlFor="team">
                  Команда *
                </label>
                <input
                  id="team"
                  name="team"
                  required
                  defaultValue={item?.team ?? ""}
                  className={FIELD}
                  placeholder="ХК «Кстово»"
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="city">
                  Город
                </label>
                <input
                  id="city"
                  name="city"
                  defaultValue={item?.city ?? ""}
                  className={FIELD}
                  placeholder="Кстово"
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="season">
                  Сезон *
                </label>
                <input
                  id="season"
                  name="season"
                  required
                  list="seasons-list"
                  defaultValue={defaultSeason}
                  className={FIELD}
                />
                <datalist id="seasons-list">
                  {SEASONS.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className={LABEL} htmlFor="division">
                  Турнир *
                </label>
                <input
                  id="division"
                  name="division"
                  required
                  list="divisions-list"
                  defaultValue={defaultDivision}
                  className={FIELD}
                />
                <datalist id="divisions-list">
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className={LABEL} htmlFor="position">
                  Место в таблице
                </label>
                <input
                  id="position"
                  name="position"
                  type="number"
                  min="1"
                  defaultValue={item?.position ?? 1}
                  className={NUM}
                />
                <p className="mt-2 text-[12px] text-muted-2">
                  1 — первое место, 2 — второе и т.д.
                </p>
              </div>
            </div>
          </div>

          {/* Статистика матчей */}
          <div className="border border-line p-6">
            <p className="eyebrow text-muted-2">Матчи</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={LABEL} htmlFor="games">
                  Всего игр (И)
                </label>
                <input
                  id="games"
                  name="games"
                  type="number"
                  min="0"
                  defaultValue={item?.games ?? 0}
                  className={NUM}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="wins">
                  Победы в основное (В)
                </label>
                <input
                  id="wins"
                  name="wins"
                  type="number"
                  min="0"
                  defaultValue={item?.wins ?? 0}
                  className={NUM}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="winsOt">
                  Победы в овертайме (ВОТ)
                </label>
                <input
                  id="winsOt"
                  name="winsOt"
                  type="number"
                  min="0"
                  defaultValue={item?.winsOt ?? 0}
                  className={NUM}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="winsSo">
                  Победы по буллитам (ВБ)
                </label>
                <input
                  id="winsSo"
                  name="winsSo"
                  type="number"
                  min="0"
                  defaultValue={item?.winsSo ?? 0}
                  className={NUM}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="lossesOt">
                  Поражения в овертайме (ПОТ)
                </label>
                <input
                  id="lossesOt"
                  name="lossesOt"
                  type="number"
                  min="0"
                  defaultValue={item?.lossesOt ?? 0}
                  className={NUM}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="lossesSo">
                  Поражения по буллитам (ПБ)
                </label>
                <input
                  id="lossesSo"
                  name="lossesSo"
                  type="number"
                  min="0"
                  defaultValue={item?.lossesSo ?? 0}
                  className={NUM}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="losses">
                  Поражения в основное (П)
                </label>
                <input
                  id="losses"
                  name="losses"
                  type="number"
                  min="0"
                  defaultValue={item?.losses ?? 0}
                  className={NUM}
                />
              </div>
            </div>
            <p className="mt-4 text-[12px] text-muted-2">
              И = В + ВОТ + ВБ + ПОТ + ПБ + П — обычно сумма всех матчей.
              Если не сходится, проверьте значения.
            </p>
          </div>

          {/* Голы и очки */}
          <div className="border border-line p-6">
            <p className="eyebrow text-muted-2">Голы и очки</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <label className={LABEL} htmlFor="goalsFor">
                  Заброшено шайб
                </label>
                <input
                  id="goalsFor"
                  name="goalsFor"
                  type="number"
                  min="0"
                  defaultValue={item?.goalsFor ?? 0}
                  className={NUM}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="goalsAgainst">
                  Пропущено шайб
                </label>
                <input
                  id="goalsAgainst"
                  name="goalsAgainst"
                  type="number"
                  min="0"
                  defaultValue={item?.goalsAgainst ?? 0}
                  className={NUM}
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="points">
                  Очки
                </label>
                <input
                  id="points"
                  name="points"
                  type="number"
                  min="0"
                  defaultValue={item?.points ?? 0}
                  className={NUM}
                />
                <p className="mt-2 text-[12px] text-muted-2">
                  Формула: В×3 + (ВОТ+ВБ)×2 + (ПОТ+ПБ)×1
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8">
          <div className="border border-line p-6">
            <p className="eyebrow text-muted-2">Действия</p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
              {isNew
                ? "Новая запись появится в указанном турнире сразу после сохранения."
                : "После сохранения таблица на сайте обновится автоматически."}
            </p>
            <div className="mt-5 space-y-3">
              <button
                type="submit"
                className="w-full bg-ink-900 px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent"
              >
                {isNew ? "Добавить в таблицу" : "Сохранить изменения"}
              </button>
              <Link
                href="/admin/standings"
                className="block w-full border border-line-strong px-6 py-3.5 text-center text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-900 hover:border-ink-900"
              >
                Отмена
              </Link>
            </div>
          </div>

          {!isNew && item ? (
            <form action={deleteStandingAction} className="border border-line p-6">
              <p className="eyebrow text-muted-2">Опасная зона</p>
              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                Удалить эту запись из таблицы? Действие необратимо.
              </p>
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="mt-4 w-full border border-accent px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-accent transition-colors hover:bg-accent hover:text-white"
              >
                Удалить запись
              </button>
            </form>
          ) : null}
        </aside>
      </form>
    </>
  );
}
