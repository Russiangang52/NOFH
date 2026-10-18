import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Icon, SectionHead } from "@/components/ui";
import { DOC_SECTIONS } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DOC_SECTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = DOC_SECTIONS.find((s) => s.slug === slug);
  if (!section) return { title: "Раздел не найден" };
  return { title: section.title, description: section.description };
}

export default async function DocumentSectionPage({ params }: Props) {
  const { slug } = await params;
  const section = DOC_SECTIONS.find((s) => s.slug === slug);
  if (!section) notFound();

  const others = DOC_SECTIONS.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHero
        eyebrow="Документы"
        title={section.title}
        lead={section.description}
        breadcrumbs={[
          { label: "Федерация", href: "/federaciya/o-federacii" },
          { label: "Документы", href: "/federaciya/dokumenty" },
          { label: section.title, href: `/federaciya/dokumenty/${section.slug}` },
        ]}
      />

      <section className="py-16 md:py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <Reveal>
              <SectionHead eyebrow="Файлы" title="Доступно для скачивания" />
            </Reveal>

            <div className="mt-6">
              {section.items.map((item, i) => (
                <Reveal key={item.name} delay={i * 50}>
                  <div className="group flex cursor-pointer items-center gap-5 border-b border-line py-5 transition-colors hover:bg-paper-2">
                    <Icon
                      name="document"
                      className="h-6 w-6 shrink-0 text-muted-2 transition-colors group-hover:text-accent"
                      strokeWidth={1.2}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium leading-snug text-ink-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[12px] text-muted-2">
                        {item.meta} · {item.size}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-900">
                      <Icon name="download" className="h-4 w-4" strokeWidth={1.4} />
                      <span className="hidden sm:inline">Скачать</span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <p className="mt-10 border-l-2 border-line py-2 pl-5 text-[14px] leading-relaxed text-muted">
                Документы публикуются в форматах PDF, DOCX и XLSX. Если нужный
                файл недоступен или требуется заверенная копия, направьте запрос
                через форму в разделе{" "}
                <Link
                  href="/federaciya/quest"
                  className="u-link font-medium text-ink-900"
                >
                  «Задать вопрос»
                </Link>
                .
              </p>
            </Reveal>
          </div>

          <aside>
            <Reveal delay={80}>
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow border-b border-line pb-3 text-muted-2">
                  Другие разделы
                </p>
                <div>
                  {others.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/federaciya/dokumenty/${s.slug}`}
                      className="group flex items-center gap-3 border-b border-line py-3.5 text-[14px] text-ink-700 transition-colors hover:text-accent"
                    >
                      <Icon
                        name={s.icon}
                        className="h-4.5 w-4.5 shrink-0 text-muted-2 transition-colors group-hover:text-accent"
                        strokeWidth={1.2}
                      />
                      <span className="flex-1">{s.title}</span>
                      <Icon
                        name="arrow"
                        className="arrow-slide h-4 w-4"
                        strokeWidth={1.4}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
