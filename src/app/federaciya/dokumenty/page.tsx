import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Icon, SectionHead, TextLink } from "@/components/ui";
import { DOC_SECTIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Документы",
  description:
    "Документы Нижегородской областной федерации хоккея: регламенты, календари, судейство, дисквалификации, переходы, пресса.",
};

export default function DocumentsPage() {
  const total = DOC_SECTIONS.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <>
      <PageHero
        eyebrow="Федерация"
        title="Документы"
        lead="Регламенты, календари, нормативные акты и формы для клубов, тренеров, арбитров и представителей СМИ."
        breadcrumbs={[
          { label: "Федерация", href: "/federaciya/o-federacii" },
          { label: "Документы", href: "/federaciya/dokumenty" },
        ]}
        aside={
          <div className="border-l border-line pl-6">
            <p className="tnum font-display text-[2rem] font-semibold text-ink-900">
              {total}
            </p>
            <p className="mt-1 text-[13px] text-muted">
              действующих файлов в {DOC_SECTIONS.length} разделах
            </p>
            <div className="mt-4">
              <TextLink href="/otchyotnost">Отчётность</TextLink>
            </div>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Разделы" title="Библиотека документов" />
          </Reveal>

          <div className="mt-10 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
            {DOC_SECTIONS.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 70}>
                <Link
                  href={`/federaciya/dokumenty/${s.slug}`}
                  className="group flex h-full flex-col bg-paper p-8 transition-colors hover:bg-paper-2"
                >
                  <div className="flex items-start justify-between">
                    <Icon
                      name={s.icon}
                      className="h-7 w-7 text-ink-900 transition-colors group-hover:text-accent"
                      strokeWidth={1.2}
                    />
                    <span className="tnum text-[11px] uppercase tracking-[0.1em] text-muted-2">
                      {s.items.length} файлов
                    </span>
                  </div>

                  <h3 className="mt-7 text-[1.2rem] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-accent">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted">
                    {s.description}
                  </p>

                  <span className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-900">
                    Открыть
                    <Icon
                      name="arrow"
                      className="arrow-slide h-4 w-4"
                      strokeWidth={1.6}
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
