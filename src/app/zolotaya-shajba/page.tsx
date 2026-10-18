import Image from "next/image";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { NewsCard } from "@/components/NewsCard";
import { Btn, SectionHead, TextLink } from "@/components/ui";
import { GOLDEN_PUCK_STAGES } from "@/lib/content";
import { getNews } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Золотая шайба",
  description:
    "Клуб «Золотая шайба» в Нижегородской области: этапы соревнований, возрастные группы, порядок заявки команды.",
};

const AGES = [
  ["2015–2016 г.р.", "78"],
  ["2013–2014 г.р.", "86"],
  ["2011–2012 г.р.", "74"],
  ["2009–2010 г.р.", "62"],
];

export default async function GoldenPuckPage() {
  const all = await getNews({ limit: 40 });
  const related = all.filter((n) => n.tags.includes("Золотая шайба")).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Всероссийский клуб"
        title="«Золотая шайба»"
        lead="Самые массовые детские хоккейные соревнования страны. В Нижегородской области в них ежегодно участвуют более 300 дворовых и школьных команд."
        breadcrumbs={[
          { label: "Соревнования", href: "/sorevnovaniya" },
          { label: "Золотая шайба", href: "/zolotaya-shajba" },
        ]}
        aside={
          <div className="flex flex-col items-start gap-4 border-l border-line pl-6">
            <Btn href="/federaciya/quest" variant="accent">
              Заявить команду
            </Btn>
            <TextLink href="/federaciya/dokumenty/kalendari">
              Календарь этапов
            </TextLink>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <Reveal>
            <h2 className="rule-accent text-[1.9rem] font-bold leading-[1.15] text-ink-900 sm:text-[2.2rem]">
              Хоккей для всех, без отбора
            </h2>
            <div className="prose-article mt-6">
              <p>
                Клуб «Золотая шайба» имени А. В. Тарасова — всероссийские
                соревнования юных хоккеистов, в которых участвуют дворовые,
                школьные и клубные команды, не входящие в систему спортивных школ
                олимпийского резерва.
              </p>
              <p>
                В Нижегородской области региональный этап проводит НОФХ совместно
                с министерством спорта. Турнир охватывает все муниципальные
                образования и проходит в четыре этапа — от дворовых площадок до
                всероссийского финала.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
              {AGES.map(([group, teams]) => (
                <div key={group} className="bg-paper py-5 pr-4">
                  <dt className="text-[11px] uppercase tracking-[0.08em] text-muted-2">
                    {group}
                  </dt>
                  <dd className="tnum mt-2 font-display text-[1.5rem] font-semibold text-ink-900">
                    {teams}
                    <span className="ml-1.5 text-[11px] font-normal text-muted">
                      команд
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={90}>
            <figure>
              <div className="media-zoom relative aspect-[4/3] overflow-hidden bg-paper-3">
                <Image
                  src="/photos/news/regionalnyj-final-zolotoj-shajby-2014-2015-zaver.jpg"
                  alt="Региональный финал «Золотой шайбы» 2014–2015 г.р."
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="photo-grade object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[12px] text-muted-2">
                Региональный финал «Золотой шайбы» среди команд 2014–2015 г.р. Фото: НОФХ
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2 py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Структура" title="Четыре этапа отбора" />
          </Reveal>

          <div className="mt-10 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
            {GOLDEN_PUCK_STAGES.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <div className="h-full bg-paper p-7">
                  <span className="tnum font-display text-[12px] font-semibold tracking-[0.14em] text-accent">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-[1.1rem] font-semibold text-ink-900">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-[11.5px] uppercase tracking-[0.08em] text-muted-2">
                    {s.period}
                  </p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="py-16 md:py-20">
          <div className="container-x">
            <Reveal>
              <SectionHead
                eyebrow="Новости"
                title="«Золотая шайба» в регионе"
                action={<TextLink href="/novosti">Все новости</TextLink>}
              />
            </Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {related.map((n, i) => (
                <Reveal key={n.id} delay={i * 80}>
                  <NewsCard item={n} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
