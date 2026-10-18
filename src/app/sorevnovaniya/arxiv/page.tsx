import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { SectionHead, TextLink } from "@/components/ui";
import { ARCHIVE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Архив сезонов",
  description:
    "Архив областных соревнований: победители и призёры Чемпионата Нижегородской области по сезонам.",
};

export default function ArchivePage() {
  return (
    <>
      <PageHero
        eyebrow="История"
        title="Архив сезонов"
        lead="Победители и призёры Чемпионата Нижегородской области, статистика проведённых розыгрышей."
        breadcrumbs={[
          { label: "Соревнования", href: "/sorevnovaniya" },
          { label: "Архив", href: "/sorevnovaniya/arxiv" },
        ]}
        aside={
          <div className="border-l border-line pl-6">
            <TextLink href="/sorevnovaniya">Текущий сезон</TextLink>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Чемпионат области" title="Призёры по сезонам" />
          </Reveal>

          <Reveal delay={80} className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-[14.5px]">
              <thead>
                <tr className="border-b border-ink-900 text-[10.5px] uppercase tracking-[0.1em] text-muted-2">
                  <th className="py-3 text-left font-semibold">Сезон</th>
                  <th className="py-3 text-left font-semibold">Чемпион</th>
                  <th className="py-3 text-left font-semibold">2 место</th>
                  <th className="py-3 text-left font-semibold">3 место</th>
                  <th className="py-3 text-right font-semibold">Команд</th>
                  <th className="py-3 text-right font-semibold">Матчей</th>
                </tr>
              </thead>
              <tbody>
                {ARCHIVE.map((a) => (
                  <tr
                    key={a.season}
                    className="row-hover border-b border-line last:border-b-0"
                  >
                    <td className="tnum py-4 font-display text-[1.05rem] font-semibold text-ink-900">
                      {a.season}
                    </td>
                    <td className="py-4">
                      <span className="flex items-center gap-2.5">
                        <span className="h-4 w-[2px] bg-accent" />
                        <span className="font-semibold text-ink-900">
                          {a.champion}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 text-ink-700">{a.runnerUp}</td>
                    <td className="py-4 text-ink-700">{a.third}</td>
                    <td className="tnum py-4 text-right text-muted">{a.teams}</td>
                    <td className="tnum py-4 text-right text-muted">
                      {a.matches}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-14 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
              {[
                {
                  t: "Протоколы матчей",
                  d: "Хранятся в архиве федерации с сезона 2009/2010 в бумажном и электронном виде.",
                },
                {
                  t: "Статистика игроков",
                  d: "Индивидуальные показатели бомбардиров и вратарей доступны с сезона 2018/2019.",
                },
                {
                  t: "Запрос материалов",
                  d: "Архивные документы предоставляются по письменному запросу клубов и СМИ.",
                },
              ].map((c) => (
                <div key={c.t}>
                  <h3 className="text-[1.05rem] font-semibold text-ink-900">
                    {c.t}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">
                    {c.d}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
