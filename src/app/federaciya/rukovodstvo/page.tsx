import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { SectionHead, TextLink } from "@/components/ui";
import { LEADERSHIP } from "@/lib/content";

export const metadata: Metadata = {
  title: "Руководство",
  description:
    "Руководство Нижегородской областной федерации хоккея: президент, исполнительный директор, профильные комитеты.",
};

const BODIES = [
  {
    title: "Конференция",
    text: "Высший орган управления. Созывается не реже одного раза в год, утверждает отчёты и избирает президента федерации.",
  },
  {
    title: "Исполком",
    text: "Коллегиальный орган между конференциями: утверждает регламенты, календари и составы комитетов.",
  },
  {
    title: "Судейский комитет",
    text: "Аттестация арбитров, назначение бригад, разбор игровых эпизодов, обучение судей.",
  },
  {
    title: "Дисциплинарный комитет",
    text: "Рассмотрение нарушений регламента, применение санкций, работа с апелляциями клубов.",
  },
];

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Федерация"
        title="Руководство"
        lead="Исполнительные органы НОФХ и профильные комитеты, обеспечивающие проведение областных соревнований."
        breadcrumbs={[
          { label: "Федерация", href: "/federaciya/o-federacii" },
          { label: "Руководство", href: "/federaciya/rukovodstvo" },
        ]}
        aside={
          <div className="flex flex-col items-start gap-3 border-l border-line pl-6">
            <TextLink href="/federaciya/kontakty">Контакты</TextLink>
            <TextLink href="/federaciya/quest">Задать вопрос</TextLink>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Состав" title="Исполнительный аппарат" />
          </Reveal>

          <div className="mt-10">
            {LEADERSHIP.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <div className="grid gap-x-10 gap-y-3 border-b border-line py-8 md:grid-cols-[64px_1fr_1.4fr]">
                  <span className="flex h-14 w-14 items-center justify-center border border-line font-display text-[15px] font-semibold text-ink-900">
                    {p.initials}
                  </span>
                  <div>
                    <h3 className="text-[1.15rem] font-semibold leading-snug text-ink-900">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.1em] text-accent">
                      {p.role}
                    </p>
                  </div>
                  <p className="text-[14px] leading-relaxed text-muted">
                    {p.bio}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2 py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Структура" title="Органы управления" />
          </Reveal>
          <div className="mt-10 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
            {BODIES.map((b, i) => (
              <Reveal key={b.title} delay={i * 70}>
                <div className="h-full bg-paper p-7">
                  <span className="tnum font-display text-[12px] font-semibold tracking-[0.14em] text-accent">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-[1.05rem] font-semibold text-ink-900">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                    {b.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
