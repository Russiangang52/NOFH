import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import QuestionForm from "@/components/QuestionForm";
import { Icon, SectionHead } from "@/components/ui";
import { FAQ, SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Задать вопрос",
  description:
    "Задайте вопрос Нижегородской областной федерации хоккея онлайн. Ответ в течение трёх рабочих дней.",
};

export default function QuestPage() {
  return (
    <>
      <PageHero
        eyebrow="Обратная связь"
        title="Задать вопрос"
        lead="Заполните форму — обращение поступит профильному специалисту федерации, ответ направим на указанный контакт."
        breadcrumbs={[
          { label: "Федерация", href: "/federaciya/o-federacii" },
          { label: "Задать вопрос", href: "/federaciya/quest" },
        ]}
      />

      <section className="py-16 md:py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <QuestionForm />
          </Reveal>

          <div>
            <Reveal delay={80}>
              <h2 className="rule-accent text-[1.4rem] font-bold text-ink-900">
                Прямые контакты
              </h2>
              <dl className="mt-6">
                {[
                  ["phone", "Телефон", SITE.phone, `tel:${SITE.phone}`],
                  ["mail", "E-mail", SITE.email, `mailto:${SITE.email}`],
                  ["clock", "Приём обращений", SITE.schedule, undefined],
                ].map(([icon, label, value, href]) => (
                  <div
                    key={label as string}
                    className="flex gap-4 border-b border-line py-4"
                  >
                    <Icon
                      name={icon as "phone"}
                      className="mt-0.5 h-5 w-5 shrink-0 text-muted-2"
                      strokeWidth={1.3}
                    />
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-2">
                        {label as string}
                      </dt>
                      <dd className="mt-1 text-[14.5px] text-ink-900">
                        {href ? (
                          <a href={href as string} className="u-link">
                            {value as string}
                          </a>
                        ) : (
                          (value as string)
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-10 bg-paper-2 p-7">
                <p className="text-[15px] font-semibold text-ink-900">
                  Обратите внимание
                </p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                  Обращения по дисциплинарным эпизодам принимаются только от
                  официальных представителей клубов в письменном виде с печатью
                  организации и подписью руководителя.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2 py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead
              eyebrow="Частые вопросы"
              title="Коротко о главном"
              lead="Возможно, ответ на ваш вопрос уже есть здесь."
            />
          </Reveal>

          <div className="mt-10 max-w-3xl">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 50}>
                <details className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] font-medium text-ink-900 transition-colors hover:text-accent">
                    {f.q}
                    <Icon
                      name="plus"
                      className="h-4 w-4 shrink-0 text-muted-2 transition-transform duration-300 group-open:rotate-45"
                      strokeWidth={1.4}
                    />
                  </summary>
                  <p className="max-w-2xl pb-6 text-[14.5px] leading-relaxed text-muted">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
