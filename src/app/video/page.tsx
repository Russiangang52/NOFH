import Photo from "@/components/Photo";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Icon, SectionHead, TextLink } from "@/components/ui";
import { VIDEOS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Видео",
  description:
    "Видеоархив НОФХ: обзоры туров, полные матчи, репортажи и церемонии награждения нижегородского хоккея.",
};

export default function VideoPage() {
  const [lead, ...rest] = VIDEOS;

  return (
    <>
      <PageHero
        eyebrow="Медиа"
        title="Видео"
        lead="Обзоры туров, записи матчей, сюжеты о командах и ледовых аренах Нижегородской области."
        breadcrumbs={[
          { label: "Медиа", href: "/media" },
          { label: "Видео", href: "/video" },
        ]}
        aside={
          <div className="border-l border-line pl-6">
            <TextLink href="/media">Медиацентр</TextLink>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <div className="group grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div className="media-zoom relative aspect-[16/9] cursor-pointer overflow-hidden bg-paper-3">
                <Photo
                  src={lead.poster}
                  alt={lead.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="photo-grade object-cover"
                />
                <span className="absolute inset-0 bg-ink-900/25 transition-colors duration-500 group-hover:bg-ink-900/10" />
                <span className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center bg-paper text-ink-900 transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                  <Icon name="play" className="h-4 w-4" />
                </span>
              </div>

              <div>
                <p className="eyebrow text-accent">{lead.tag}</p>
                <h2 className="mt-4 text-[1.8rem] font-bold leading-[1.15] text-ink-900 sm:text-[2.2rem]">
                  {lead.title}
                </h2>
                <p className="tnum mt-4 text-[12.5px] uppercase tracking-[0.1em] text-muted-2">
                  {lead.date} · {lead.duration}
                </p>
                <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-muted">
                  Полная запись матча с комментарием. Видео доступно в
                  официальном сообществе федерации и на канале НОФХ.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-16">
              <SectionHead eyebrow="Видеоархив" title="Другие материалы" />
            </div>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 80}>
                <div className="group cursor-pointer">
                  <div className="media-zoom relative aspect-[16/10] overflow-hidden bg-paper-3">
                    <Photo
                      src={v.poster}
                      alt={v.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="photo-grade object-cover"
                    />
                    <span className="absolute inset-0 bg-ink-900/20 transition-colors duration-500 group-hover:bg-ink-900/5" />
                    <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center bg-paper text-ink-900 transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                      <Icon name="play" className="h-3.5 w-3.5" />
                    </span>
                    <span className="tnum absolute bottom-4 right-4 bg-ink-900/80 px-2 py-1 text-[11px] text-white">
                      {v.duration}
                    </span>
                  </div>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.1em] text-muted-2">
                    {v.tag} · {v.date}
                  </p>
                  <h3 className="mt-2 text-[1.05rem] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-accent">
                    {v.title}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
