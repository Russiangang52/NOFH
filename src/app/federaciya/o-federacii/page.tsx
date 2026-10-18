import Image from "next/image";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { SectionHead, TextLink } from "@/components/ui";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "О федерации",
  description:
    "Нижегородская областная федерация хоккея: история, задачи, направления работы и структура организации.",
};

const DIRECTIONS = [
  {
    n: "01",
    title: "Массовый хоккей",
    text: "Поддержка дворовых и школьных команд, региональный этап клуба «Золотая шайба», работа с муниципалитетами по развитию площадок.",
  },
  {
    n: "02",
    title: "Соревнования",
    text: "Проведение Чемпионата и Первенства области, студенческой и юниорской лиг по единым регламентам и календарям.",
  },
  {
    n: "03",
    title: "Судейство",
    text: "Подготовка, аттестация и назначение арбитров, Школа хоккейного арбитра, разбор игровых эпизодов.",
  },
  {
    n: "04",
    title: "Развитие",
    text: "Взаимодействие с министерством спорта региона, ФХР и клубами, методическая помощь спортивным школам.",
  },
];

const TIMELINE = [
  { year: "1992", text: "Создана федерация, проведён первый Чемпионат Нижегородской области." },
  { year: "2001", text: "Запущено Первенство области среди юношеских команд спортивных школ." },
  { year: "2009", text: "Возрождён региональный этап всероссийского клуба «Золотая шайба»." },
  { year: "2014", text: "Открыта Школа хоккейного арбитра, подготовлено более 200 судей." },
  { year: "2018", text: "Стартовала Студенческая хоккейная лига Нижегородской области." },
  { year: "2023", text: "Введена электронная система протоколов и статистики соревнований." },
  { year: "2026", text: "34 ледовые площадки, 186 команд в системе соревнований федерации." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`Организация с ${SITE.founded} года`}
        title="О федерации"
        lead="Региональная общественная организация, объединяющая клубы, спортивные школы, тренеров, арбитров и болельщиков Нижегородской области."
        breadcrumbs={[{ label: "Федерация", href: "/federaciya/o-federacii" }]}
        aside={
          <div className="flex flex-col items-start gap-3 border-l border-line pl-6">
            <TextLink href="/federaciya/rukovodstvo">Руководство</TextLink>
            <TextLink href="/federaciya/dokumenty">Документы</TextLink>
            <TextLink href="/otchyotnost">Отчётность</TextLink>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <Reveal>
            <figure>
              <div className="media-zoom relative aspect-[4/3] overflow-hidden bg-paper-3">
                <Image
                  src="/photos/news/ceremoniya-nagrazhdeniya-prizyorov-i-laureatov.jpg"
                  alt="Церемония награждения призёров и лауреатов"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="photo-grade object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[12px] text-muted-2">
                Церемония награждения призёров и лауреатов сезона, май 2026. Фото: НОФХ
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={90}>
            <h2 className="rule-accent text-[1.9rem] font-bold leading-[1.15] text-ink-900 sm:text-[2.3rem]">
              Хоккей как региональная традиция
            </h2>
            <div className="prose-article mt-6">
              <p>
                Федерация основана в {SITE.founded} году и представляет Федерацию
                хоккея России в Нижегородской области. Мы отвечаем за проведение
                областных соревнований, аттестацию арбитров, ведение реестра
                переходов и развитие детско-юношеского хоккея.
              </p>
              <p>
                В системе соревнований федерации выступают взрослые, юниорские,
                юношеские и студенческие команды из Нижнего Новгорода, Дзержинска,
                Кстова, Сарова, Арзамаса, Выксы, Бора, Княгинина, Сеченова,
                Ардатова и других муниципальных образований.
              </p>
              <p>
                Приоритет федерации — доступность хоккея: бесплатные отделения при
                спортивных школах, поддержка дворовых команд и ввод новых ледовых
                площадок в районах области.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-3 border-t border-line">
              {[
                ["186", "команд"],
                ["742", "матча за сезон"],
                ["214", "арбитров"],
              ].map(([v, l]) => (
                <div key={l} className="border-r border-line py-6 pr-4 last:border-r-0">
                  <dt className="tnum font-display text-[1.7rem] font-semibold text-ink-900">
                    {v}
                  </dt>
                  <dd className="mt-1 text-[12px] text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2 py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Задачи" title="Направления работы" />
          </Reveal>

          <div className="mt-10 grid gap-px bg-line md:grid-cols-2">
            {DIRECTIONS.map((d, i) => (
              <Reveal key={d.n} delay={i * 70}>
                <div className="h-full bg-paper p-8 lg:p-10">
                  <span className="tnum font-display text-[12px] font-semibold tracking-[0.14em] text-accent">
                    {d.n}
                  </span>
                  <h3 className="mt-4 text-[1.25rem] font-semibold text-ink-900">
                    {d.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted">
                    {d.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="История" title="Ключевые вехи" />
          </Reveal>

          <div className="mt-10">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 50}>
                <div className="grid items-baseline gap-x-10 gap-y-2 border-b border-line py-6 md:grid-cols-[120px_1fr]">
                  <span className="tnum font-display text-[1.25rem] font-semibold text-ink-900">
                    {t.year}
                  </span>
                  <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
                    {t.text}
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
