import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { NewsCard } from "@/components/NewsCard";
import { SectionHead, TextLink, formatDate } from "@/components/ui";
import { getNewsBySlug, getRelatedNews } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "Материал не найден" };
  return { title: item.title, description: item.excerpt };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const related = await getRelatedNews(slug);
  const paragraphs = item.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const leadIsFull = !item.excerpt.endsWith("…");
  const bodyParagraphs = leadIsFull
    ? paragraphs.filter(
        (p) => p.replace(/\s+/g, " ").trim() !== item.excerpt.trim(),
      )
    : paragraphs;
  const tags = item.tags.split(",").filter(Boolean);
  const section = item.category === "nofh" ? "Новости НОФХ" : "Новости";
  const sectionHref = item.category === "nofh" ? "/novosti-nofh" : "/novosti";

  return (
    <>
      <div className="border-b border-line bg-paper-2">
        <div className="container-x flex h-11 items-center gap-2 overflow-x-auto whitespace-nowrap text-[11.5px] text-muted">
          <Link href="/" className="hover:text-accent">
            Главная
          </Link>
          <span className="text-line-strong">—</span>
          <Link href={sectionHref} className="hover:text-accent">
            {section}
          </Link>
          <span className="text-line-strong">—</span>
          <span className="truncate text-ink-900">{item.title}</span>
        </div>
      </div>

      <article className="py-14 md:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-[760px]">
            <div className="animate-soft-in flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-muted-2">
              {tags.map((t) => (
                <span key={t} className="text-accent">
                  {t}
                </span>
              ))}
              <span className="h-px w-5 bg-line-strong" />
              <time className="tnum">{formatDate(item.publishedAt)}</time>
              <span className="tnum">{item.views.toLocaleString("ru-RU")} просмотров</span>
            </div>

            <h1 className="animate-soft-in mt-5 text-[2.1rem] font-bold leading-[1.1] tracking-[-0.025em] text-ink-900 sm:text-[2.8rem]">
              {item.title}
            </h1>

            {leadIsFull ? (
            <p className="animate-soft-in mt-7 border-l-2 border-accent pl-5 text-[1.1rem] font-medium leading-[1.65] text-ink-700">
              {item.excerpt}
            </p>
            ) : null}
          </div>

          <Reveal className="mx-auto mt-12 max-w-[1000px]">
            <figure>
              <div className="relative aspect-[16/9] overflow-hidden bg-paper-3">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  className="photo-grade object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[12px] text-muted-2">
                Фото: Нижегородская областная федерация хоккея
              </figcaption>
            </figure>
          </Reveal>

          <div className="prose-article mx-auto mt-12 max-w-[700px]">
            {bodyParagraphs.map((p, i) => (
              <Reveal key={i} delay={i * 40}>
                <p className="whitespace-pre-line">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-14 flex max-w-[700px] flex-wrap items-center justify-between gap-5 border-t border-line pt-6">
            <span className="text-[11px] uppercase tracking-[0.12em] text-muted-2">
              Поделиться
            </span>
            <div className="flex gap-3">
              {["ВК", "ТГ", "ОК", "Ссылка"].map((s) => (
                <span
                  key={s}
                  className="cursor-pointer border border-line px-4 py-2 text-[11.5px] text-ink-700 transition-colors hover:border-ink-900 hover:text-ink-900"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-[700px]">
            <TextLink href={sectionHref}>Вернуться к списку</TextLink>
          </div>
        </div>
      </article>

      <section className="border-t border-line bg-paper-2 py-16 md:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Читайте также" title="Другие материалы" />
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {related.map((r, i) => (
              <Reveal key={r.id} delay={i * 80}>
                <NewsCard item={r} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
