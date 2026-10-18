import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Icon, SectionHead } from "@/components/ui";
import { REPORTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Отчётность",
  description:
    "Годовые отчёты и финансовая отчётность Нижегородской областной федерации хоккея.",
};

const FIGURES = [
  { value: "186", label: "команд в соревнованиях" },
  { value: "742", label: "матча проведено за сезон" },
  { value: "214", label: "аттестованных арбитров" },
  { value: "52", label: "муниципалитета охвачено" },
];

export default function ReportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Прозрачность"
        title="Отчётность"
        lead="Федерация ежегодно публикует отчёты о деятельности, финансовые документы и заключения ревизионной комиссии."
        breadcrumbs={[{ label: "Отчётность", href: "/otchyotnost" }]}
      />

      <section className="border-b border-line">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4">
          {FIGURES.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 60}
              className={`py-9 lg:py-11 ${i % 2 === 1 ? "border-l border-line pl-6" : ""} ${
                i > 1 ? "border-t border-line lg:border-t-0" : ""
              } ${i >= 2 ? "lg:border-l lg:border-line lg:pl-6" : ""}`}
            >
              <p className="tnum font-display text-[2.2rem] font-semibold leading-none text-ink-900">
                {f.value}
              </p>
              <p className="mt-3 max-w-[180px] text-[12.5px] leading-snug text-muted">
                {f.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Документы" title="Публичная отчётность" />
          </Reveal>

          <div className="mt-6 grid gap-x-14 md:grid-cols-2">
            {REPORTS.map((r, i) => (
              <Reveal key={r.title} delay={(i % 2) * 60}>
                <div className="group flex cursor-pointer items-center gap-5 border-b border-line py-5 transition-colors hover:bg-paper-2">
                  <span className="tnum font-display text-[13px] font-semibold text-accent">
                    {r.year}
                  </span>
                  <p className="min-w-0 flex-1 text-[14.5px] leading-snug text-ink-900">
                    {r.title}
                  </p>
                  <span className="shrink-0 text-[12px] text-muted-2">
                    PDF · {r.size}
                  </span>
                  <Icon
                    name="download"
                    className="h-4 w-4 shrink-0 text-muted-2 transition-colors group-hover:text-accent"
                    strokeWidth={1.4}
                  />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="mt-12 max-w-3xl border-l-2 border-line py-2 pl-5 text-[14px] leading-relaxed text-muted">
              Отчётность формируется в соответствии с требованиями
              законодательства об общественных объединениях и уставом федерации.
              Документы утверждаются конференцией и публикуются в течение 30 дней
              после утверждения.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
