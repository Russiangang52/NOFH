import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { NewsCard } from "@/components/NewsCard";
import { TextLink } from "@/components/ui";
import { getNews } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Новости НОФХ",
  description:
    "Официальные новости Нижегородской областной федерации хоккея: решения исполкома, документы, судейство.",
};

export default async function NofhNewsPage() {
  const items = await getNews({ category: "nofh", limit: 40 });

  return (
    <>
      <PageHero
        eyebrow="Официально"
        title="Новости федерации"
        lead="Решения исполкома и комитетов, обновления регламентов и документов, организационные объявления."
        breadcrumbs={[{ label: "Новости НОФХ", href: "/novosti-nofh" }]}
        aside={
          <div className="border-l border-line pl-6">
            <TextLink href="/novosti">Новости нижегородского хоккея</TextLink>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 80}>
              <NewsCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
