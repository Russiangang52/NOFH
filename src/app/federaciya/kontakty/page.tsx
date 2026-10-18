import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Btn, Icon, SectionHead } from "@/components/ui";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты Нижегородской областной федерации хоккея: адрес, телефон, e-mail, режим работы, ледовые площадки региона.",
};

const DEPARTMENTS = [
  {
    name: "Отдел соревнований",
    person: "Сергей Гришин",
    phone: "+7 (831) 433-15-81",
    email: "sport@nofh.ru",
  },
  {
    name: "Судейский комитет",
    person: "Дмитрий Белов",
    phone: "+7 (831) 433-15-82",
    email: "referee@nofh.ru",
  },
  {
    name: "Детско-юношеский хоккей",
    person: "Олег Кузьмин",
    phone: "+7 (831) 433-15-83",
    email: "youth@nofh.ru",
  },
  {
    name: "Пресс-служба",
    person: "Ирина Нестерова",
    phone: "+7 (831) 433-15-84",
    email: "press@nofh.ru",
  },
];

const ARENAS = [
  ["Нижний Новгород", "КРК «Нагорный», ЛД «Торпедо», «Красная звезда»"],
  ["Дзержинск", "ЛД «Уран»"],
  ["Кстово", "ФОК «Кстово»"],
  ["Саров", "ЛД «Саров»"],
  ["Арзамас", "ФОК «Звёздный»"],
  ["Выкса", "ФОК «Баташёв Арена»"],
  ["Бор", "ФОК «Кварц»"],
  ["Княгинино", "ФОК «Нива»"],
  ["Сеченово", "ФОК «Олимп»"],
];

export default function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Связь"
        title="Контакты"
        lead="Обращения клубов, тренеров, родителей и СМИ рассматриваются в течение трёх рабочих дней."
        breadcrumbs={[
          { label: "Федерация", href: "/federaciya/o-federacii" },
          { label: "Контакты", href: "/federaciya/kontakty" },
        ]}
      >
        <Btn href="/federaciya/quest">Задать вопрос онлайн</Btn>
      </PageHero>

      <section className="py-16 md:py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <h2 className="rule-accent text-[1.6rem] font-bold text-ink-900">
              Главный офис
            </h2>
            <dl className="mt-8">
              {[
                ["pin", "Адрес", SITE.address, undefined],
                ["phone", "Телефон", SITE.phone, `tel:${SITE.phone}`],
                ["mail", "E-mail", SITE.email, `mailto:${SITE.email}`],
                ["clock", "Режим работы", SITE.schedule, undefined],
              ].map(([icon, label, value, href]) => (
                <div
                  key={label as string}
                  className="flex gap-5 border-b border-line py-5"
                >
                  <Icon
                    name={icon as "pin"}
                    className="mt-0.5 h-5 w-5 shrink-0 text-muted-2"
                    strokeWidth={1.3}
                  />
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-2">
                      {label as string}
                    </dt>
                    <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-900">
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

            <div className="relative mt-10 aspect-[16/10] overflow-hidden border border-line bg-paper-2">
              <div
                className="absolute inset-0 opacity-[0.55]"
                style={{
                  backgroundImage:
                    "linear-gradient(#e3e6ea 1px, transparent 1px), linear-gradient(90deg, #e3e6ea 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <Icon
                  name="pin"
                  className="mx-auto h-7 w-7 text-accent"
                  strokeWidth={1.4}
                />
                <p className="mt-3 font-display text-[15px] font-semibold text-ink-900">
                  КРК «Нагорный»
                </p>
                <p className="mt-1 max-w-xs text-[12.5px] text-muted">
                  г. Нижний Новгород, ул. Советская, 16
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal delay={80}>
              <SectionHead eyebrow="Подразделения" title="Куда обращаться" />
            </Reveal>

            <div className="mt-6">
              {DEPARTMENTS.map((d, i) => (
                <Reveal key={d.name} delay={i * 60}>
                  <div className="grid gap-2 border-b border-line py-5 sm:grid-cols-[1.2fr_1fr]">
                    <div>
                      <p className="text-[15px] font-semibold text-ink-900">
                        {d.name}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-muted-2">
                        {d.person}
                      </p>
                    </div>
                    <div className="text-[13.5px] text-muted sm:text-right">
                      <a href={`tel:${d.phone}`} className="u-link block hover:text-ink-900">
                        {d.phone}
                      </a>
                      <a
                        href={`mailto:${d.email}`}
                        className="u-link block hover:text-ink-900"
                      >
                        {d.email}
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="mt-14">
                <SectionHead eyebrow="География" title="Ледовые площадки" />
              </div>
            </Reveal>

            <div className="mt-6">
              {ARENAS.map(([city, place], i) => (
                <Reveal key={city} delay={i * 35}>
                  <div className="row-hover grid grid-cols-[150px_1fr] gap-4 border-b border-line py-3.5">
                    <span className="text-[14px] font-medium text-ink-900">
                      {city}
                    </span>
                    <span className="text-[13.5px] text-muted">{place}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
