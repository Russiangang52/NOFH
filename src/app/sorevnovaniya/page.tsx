import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import StandingsBoard from "@/components/StandingsBoard";
import { Icon, SectionHead, TextLink } from "@/components/ui";
import { COMPETITIONS } from "@/lib/content";
import { getStandings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Соревнования",
  description:
    "Областные соревнования по хоккею: Чемпионат и Первенство Нижегородской области, студенческая и юниорская лиги, турнирные таблицы.",
};

const CUPS = [
  {
    title: "Большой Кубок",
    note: "Команды 1–4 мест регулярного чемпионата",
    rows: [
      ["1/2 финала", "ХК «Кстово»", "ХК «Саров»", "2:0"],
      ["1/2 финала", "Старт", "ХК «Княгинино»", "2:1"],
      ["Матч за 3-е место", "ХК «Княгинино»", "ХК «Саров»", "1:2"],
      ["Финал", "ХК «Кстово»", "Старт", "3:2"],
    ],
    medals: [
      ["Победитель", "ХК «Кстово»"],
      ["2 место", "Старт"],
      ["3 место", "ХК «Саров»"],
    ],
  },
  {
    title: "Малый Кубок",
    note: "Команды 5–8 мест регулярного чемпионата",
    rows: [
      ["1/2 финала", "Металлург", "Авто-Транс НН", "0:2"],
      ["1/2 финала", "ХК «Арзамас»", "ХК «Сеченово»", "0:2"],
      ["Матч за 3-е место", "Металлург", "ХК «Арзамас»", "2:1"],
      ["Финал", "ХК «Сеченово»", "Авто-Транс НН", "0:2"],
    ],
    medals: [
      ["Победитель", "Авто-Транс НН"],
      ["2 место", "ХК «Сеченово»"],
      ["3 место", "Металлург"],
    ],
  },
];

export default async function CompetitionsPage() {
  const standings = await getStandings();

  return (
    <>
      <PageHero
        eyebrow="Сезон 2025 / 2026"
        title="Соревнования федерации"
        lead="Четыре направления областных турниров: взрослый чемпионат, юношеское первенство, студенческая и юниорская лиги."
        breadcrumbs={[{ label: "Соревнования", href: "/sorevnovaniya" }]}
        aside={
          <div className="flex flex-col items-start gap-3 border-l border-line pl-6">
            <TextLink href="/sorevnovaniya/arxiv">Архив сезонов</TextLink>
            <TextLink href="/raspisanie">Расписание матчей</TextLink>
            <TextLink href="/federaciya/dokumenty/reglament">Регламент</TextLink>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Турниры" title="Структура соревнований" />
          </Reveal>

          <div className="mt-4">
            {COMPETITIONS.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <div className="grid gap-x-10 gap-y-4 border-b border-line py-9 lg:grid-cols-[90px_1fr_1.4fr_170px]">
                  <span className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">
                    {c.code}
                  </span>
                  <div>
                    <h3 className="text-[1.3rem] font-semibold leading-tight text-ink-900">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] text-muted-2">
                      {c.subtitle}
                    </p>
                  </div>
                  <p className="text-[14px] leading-relaxed text-muted">
                    {c.description}
                  </p>
                  <dl className="space-y-1.5 text-[12.5px] text-muted">
                    <div className="flex justify-between gap-4 border-b border-line pb-1.5">
                      <dt>Команд</dt>
                      <dd className="tnum font-semibold text-ink-900">
                        {c.teams}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Период</dt>
                      <dd className="text-ink-700">{c.period}</dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2 py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Таблицы" title="Положение команд" />
          </Reveal>
          <Reveal delay={80} className="mt-10 bg-paper p-6 md:p-8">
            <StandingsBoard rows={standings} />
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead
              eyebrow="Плей-офф"
              title="Кубковая стадия чемпионата"
              lead="Четвёрка лучших разыгрывает Большой Кубок, команды с пятого по восьмое место — Малый Кубок."
            />
          </Reveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            {CUPS.map((cup, idx) => (
              <Reveal key={cup.title} delay={idx * 100}>
                <div className="border-t-2 border-ink-900 pt-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[1.4rem] font-semibold text-ink-900">
                      {cup.title}
                    </h3>
                    <Icon
                      name="trophy"
                      className="h-5 w-5 text-muted-2"
                      strokeWidth={1.3}
                    />
                  </div>
                  <p className="mt-1 text-[12.5px] text-muted-2">{cup.note}</p>

                  <table className="mt-6 w-full border-collapse text-[14px]">
                    <tbody>
                      {cup.rows.map((r, i) => (
                        <tr key={i} className="row-hover border-b border-line">
                          <td className="w-[130px] py-3 text-[11px] uppercase tracking-[0.08em] text-muted-2">
                            {r[0]}
                          </td>
                          <td className="py-3 text-right text-ink-900">{r[1]}</td>
                          <td className="tnum w-16 py-3 text-center font-semibold text-ink-900">
                            {r[3]}
                          </td>
                          <td className="py-3 text-ink-900">{r[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <dl className="mt-6 grid grid-cols-3 gap-px bg-line">
                    {cup.medals.map(([label, team]) => (
                      <div key={label} className="bg-paper py-4 pr-3">
                        <dt className="text-[10.5px] uppercase tracking-[0.1em] text-muted-2">
                          {label}
                        </dt>
                        <dd className="mt-1.5 text-[14px] font-semibold leading-snug text-ink-900">
                          {team}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
              <p className="max-w-xl text-[14px] leading-relaxed text-muted">
                Регламент, календари и формы заявок на участие в соревнованиях
                сезона опубликованы в разделе документов федерации.
              </p>
              <Link
                href="/federaciya/dokumenty"
                className="group inline-flex items-center gap-2.5 border border-line-strong px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-900 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
              >
                Документы
                <Icon name="arrow" className="arrow-slide h-4 w-4" strokeWidth={1.6} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
