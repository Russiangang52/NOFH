import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import {
  Icon,
  SectionHead,
  formatDate,
  formatTime,
} from "@/components/ui";
import { getRecentResults, getUpcomingMatches } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Расписание матчей",
  description:
    "Расписание матчей областных соревнований по хоккею: Чемпионат, Первенство, студенческая и юниорская лиги.",
};

export default async function SchedulePage() {
  const [upcoming, results] = await Promise.all([
    getUpcomingMatches(30),
    getRecentResults(12),
  ]);

  const groups = new Map<string, typeof upcoming>();
  upcoming.forEach((m) => {
    const key = formatDate(m.startsAt);
    groups.set(key, [...(groups.get(key) ?? []), m]);
  });

  return (
    <>
      <PageHero
        eyebrow="Сезон 2025 / 2026"
        title="Расписание матчей"
        lead="Календарь игр областных соревнований. Обновляется после каждого игрового уик-энда и согласования с принимающими аренами."
        breadcrumbs={[{ label: "Расписание", href: "/raspisanie" }]}
        aside={
          <dl className="border-l border-line pl-6 text-[13px] text-muted">
            <div className="flex items-baseline gap-3">
              <dt className="tnum font-display text-[1.6rem] font-semibold text-ink-900">
                {upcoming.length}
              </dt>
              <dd>матчей в ближайших турах</dd>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <dt className="tnum font-display text-[1.6rem] font-semibold text-ink-900">
                4
              </dt>
              <dd>дивизиона в календаре</dd>
            </div>
          </dl>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Календарь" title="Предстоящие матчи" />
          </Reveal>

          <div className="mt-10">
            {Array.from(groups.entries()).map(([date, list], gi) => (
              <Reveal key={date} delay={gi * 60}>
                <div className="grid gap-6 border-b border-line py-8 lg:grid-cols-[200px_1fr]">
                  <div>
                    <p className="font-display text-[1.05rem] font-semibold text-ink-900">
                      {date}
                    </p>
                    <p className="tnum mt-1 text-[12px] text-muted-2">
                      {list.length} матч(а)
                    </p>
                  </div>

                  <div className="divide-y divide-line">
                    {list.map((m) => (
                      <div
                        key={m.id}
                        className="row-hover grid items-center gap-3 py-4 md:grid-cols-[70px_1fr_auto]"
                      >
                        <span className="tnum text-[15px] font-semibold text-ink-900">
                          {formatTime(m.startsAt)}
                        </span>
                        <span>
                          <span className="block text-[15px] font-medium text-ink-900">
                            {m.homeTeam}
                            <span className="px-2 text-muted-2">—</span>
                            {m.awayTeam}
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
                            <span className="text-accent">{m.division}</span>
                            <span>{m.stage}</span>
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
                          <Icon
                            name="pin"
                            className="h-3.5 w-3.5"
                            strokeWidth={1.4}
                          />
                          {m.venue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}

            {upcoming.length === 0 ? (
              <p className="py-8 text-muted">
                Ближайшие матчи будут опубликованы после жеребьёвки.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2 py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Сыгранные матчи" title="Результаты" />
          </Reveal>

          <Reveal delay={80} className="mt-10 overflow-x-auto bg-paper">
            <table className="w-full min-w-[680px] border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-line text-[10.5px] uppercase tracking-[0.1em] text-muted-2">
                  <th className="px-5 py-3 text-left font-semibold">Дата</th>
                  <th className="px-5 py-3 text-left font-semibold">Стадия</th>
                  <th className="px-5 py-3 text-right font-semibold">Хозяева</th>
                  <th className="px-5 py-3 text-center font-semibold">Счёт</th>
                  <th className="px-5 py-3 text-left font-semibold">Гости</th>
                </tr>
              </thead>
              <tbody>
                {results.map((m) => {
                  const homeWin = (m.homeScore ?? 0) > (m.awayScore ?? 0);
                  return (
                    <tr
                      key={m.id}
                      className="row-hover border-b border-line last:border-b-0"
                    >
                      <td className="tnum whitespace-nowrap px-5 py-4 text-muted">
                        {formatDate(m.startsAt)}
                      </td>
                      <td className="px-5 py-4 text-[12.5px] text-muted">
                        {m.stage}
                      </td>
                      <td
                        className={`px-5 py-4 text-right ${homeWin ? "font-semibold text-ink-900" : "text-muted"}`}
                      >
                        {m.homeTeam}
                      </td>
                      <td className="tnum px-5 py-4 text-center font-semibold text-ink-900">
                        {m.homeScore} : {m.awayScore}
                      </td>
                      <td
                        className={`px-5 py-4 ${!homeWin ? "font-semibold text-ink-900" : "text-muted"}`}
                      >
                        {m.awayTeam}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>
    </>
  );
}
