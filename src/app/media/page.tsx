import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Btn, Icon, SectionHead, TextLink } from "@/components/ui";
import { SITE, VIDEOS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Медиацентр",
  description:
    "Медиацентр НОФХ: видео, фотоархив, аккредитация СМИ и фирменный стиль федерации.",
};

const GALLERY = [
  { src: "/photos/news/regionalnyj-final-zolotoj-shajby-zevershyon.jpg", caption: "Региональный финал «Золотой шайбы» 2010–2011 г.р.", wide: true },
  { src: "/photos/news/radij-zanyal-2-e-mesto-vo-vserossijskom-finale.jpg", caption: "«Радий» — серебро всероссийского финала" },
  { src: "/photos/news/nngu-vyxodit-v-plej-off.jpg", caption: "ННГУ в Студенческой хоккейной лиге" },
  { src: "/photos/news/ceremoniya-nagrazhdeniya-prizyorov-i-laureatov.jpg", caption: "Церемония награждения призёров и лауреатов", wide: true },
  { src: "/photos/news/master-klass-dlya-sudej.jpg", caption: "Мастер-класс для судей, КРК «Нагорный»" },
  { src: "/photos/news/xk-sechenovo-20092010-serebryanyj-prizer.jpg", caption: "ХК «Сеченово» 2009/2010 — серебряный призёр" },
];

export default function MediaPage() {
  return (
    <>
      <PageHero
        eyebrow="Медиа"
        title="Медиацентр"
        lead="Фотогалерея матчей, видеоархив, аккредитация журналистов и официальные материалы федерации."
        breadcrumbs={[{ label: "Медиа", href: "/media" }]}
        aside={
          <div className="flex flex-col items-start gap-4 border-l border-line pl-6">
            <Btn href="/video">Смотреть видео</Btn>
            <a
              href={SITE.vk}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-900 hover:text-accent"
            >
              <span className="u-link">Фотоальбомы ВКонтакте</span>
              <Icon
                name="arrow-up-right"
                className="arrow-slide h-4 w-4"
                strokeWidth={1.6}
              />
            </a>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead
              eyebrow="Фото"
              title="Кадры сезона"
              lead="Избранные моменты матчей областных соревнований. Полные альбомы — в сообществе федерации."
            />
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-6">
            {GALLERY.map((g, i) => (
              <Reveal
                key={g.src}
                delay={(i % 3) * 70}
                className={g.wide ? "md:col-span-4" : "md:col-span-2"}
              >
                <figure className="group">
                  <div
                    className={`media-zoom relative overflow-hidden bg-paper-3 ${
                      g.wide ? "aspect-[16/9]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={g.src}
                      alt={g.caption}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="photo-grade object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-[12.5px] text-muted">
                    {g.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2 py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead
              eyebrow="Видео"
              title="Популярные ролики"
              action={<TextLink href="/video">Весь архив</TextLink>}
            />
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {VIDEOS.slice(0, 4).map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <Link href="/video" className="group block">
                  <div className="media-zoom relative aspect-[16/10] overflow-hidden bg-paper-3">
                    <Image
                      src={v.poster}
                      alt={v.title}
                      fill
                      sizes="25vw"
                      className="photo-grade object-cover"
                    />
                    <span className="absolute inset-0 bg-ink-900/20" />
                    <span className="tnum absolute bottom-3 right-3 bg-ink-900/80 px-2 py-1 text-[11px] text-white">
                      {v.duration}
                    </span>
                  </div>
                  <p className="mt-3 text-[10.5px] uppercase tracking-[0.1em] text-muted-2">
                    {v.tag}
                  </p>
                  <h3 className="mt-1.5 text-[14.5px] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-accent">
                    {v.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-x grid gap-px bg-line md:grid-cols-3">
          {[
            {
              title: "Аккредитация СМИ",
              text: "Заявки принимаются не позднее чем за три дня до матча на press@nofh.ru с указанием издания и состава съёмочной группы.",
              href: "/federaciya/dokumenty/pressa",
              cta: "Форма заявки",
            },
            {
              title: "Фирменный стиль",
              text: "Логотипы федерации, цветовые схемы и правила использования символики в публикациях и трансляциях.",
              href: "/federaciya/dokumenty/pressa",
              cta: "Скачать пакет",
            },
            {
              title: "Пресс-релизы",
              text: "Официальные сообщения по итогам соревнований, заседаний исполкома и решений комитетов федерации.",
              href: "/novosti-nofh",
              cta: "Читать",
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <Link
                href={c.href}
                className="group flex h-full flex-col bg-paper p-8 transition-colors hover:bg-paper-2"
              >
                <h3 className="text-[1.15rem] font-semibold text-ink-900 transition-colors group-hover:text-accent">
                  {c.title}
                </h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted">
                  {c.text}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-900">
                  {c.cta}
                  <Icon name="arrow" className="arrow-slide h-4 w-4" strokeWidth={1.6} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
