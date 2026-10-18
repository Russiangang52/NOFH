import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { NewsCard } from "@/components/NewsCard";
import { TextLink } from "@/components/ui";
import { getNews } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Новости нижегородского хоккея",
  description:
    "Новости нижегородского хоккея: матчи, результаты, достижения команд региона.",
};

export default async function NewsPage() {
  const items = await getNews({ category: "hockey", limit: 40 });
  const [lead, ...rest] = items;

  return (
    <>
      <PageHero
        eyebrow="Новости"
        title="Нижегородский хоккей"
        lead="Результаты матчей, выступления команд области на всероссийской арене, события клубов и спортивных школ."
        breadcrumbs={[{ label: "Новости", href: "/novosti" }]}
        aside={
          <div className="flex flex-col items-start gap-3 border-l border-line pl-6">
            <TextLink href="/novosti-nofh">Новости НОФХ</TextLink>
            <TextLink href="/raspisanie">Расписание матчей</TextLink>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="container-x">
          {lead ? (
            <Reveal className="border-b border-line pb-14">
              <NewsCard item={lead} size="lg" />
            </Reveal>
          ) : null}

          <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, i) => (
              <Reveal key={item.id} delay={(i % 3) * 80}>
                <NewsCard item={item} />
              </Reveal>
            ))}
          </div>

          {items.length === 0 ? (
            <p className="text-muted">Новостей пока нет.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
