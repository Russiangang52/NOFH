import Photo from "@/components/Photo";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ScoreStrip from "@/components/ScoreStrip";
import StandingsBoard from "@/components/StandingsBoard";
import { NewsCard, NewsRowItem } from "@/components/NewsCard";
import {
  Btn,
  Icon,
  SectionHead,
  TextLink,
  formatDateShort,
  formatTime,
} from "@/components/ui";
import { COMPETITIONS, PARTNERS, VIDEOS } from "@/lib/content";
import {
  getNews,
  getRecentResults,
  getStandings,
  getUpcomingMatches,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const FACTS = [
  { value: "1992", label: "год основания федерации" },
  { value: "186", label: "команд в соревнованиях" },
  { value: "34", label: "ледовые площадки региона" },
  { value: "52", label: "муниципалитета охвачено" },
];

export default async function HomePage() {
  const [allNews, standings, upcoming, results] = await Promise.all([
    getNews({ limit: 9 }),
    getStandings(),
    getUpcomingMatches(6),
    getRecentResults(6),
  ]);

  const lead = allNews[0];
  const sidebar = allNews.slice(1, 5);
  const grid = allNews.slice(5, 8);

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="relative isolate bg-ink-900">
        <div className="absolute inset-0">
          <Photo
            src="/photos/stock/action-1.jpg"
            alt=""
            fill
            priority
            className="photo-grade object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/80 to-ink-900/25" />
        </div>

        <p className="absolute bottom-3 right-4 z-10 text-[10px] text-white/40">
          Фото: Luke Miller / Pexels
        </p>
                <div className="container-x relative py-16 sm:py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <p className="animate-soft-in eyebrow text-white/55">
              Сезон 2025 / 2026 · Официальный сайт
            </p>
            <h1 className="animate-soft-in mt-6 text-[1.9rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.6rem] md:text-[3.6rem] lg:text-[4.3rem]">
              Нижегородская областная
              <br className="hidden sm:block" /> федерация хоккея
            </h1>
            <p className="animate-soft-in mt-6 max-w-xl text-[0.95rem] leading-[1.7] text-white/70 sm:mt-7 sm:text-[1.05rem] sm:leading-[1.75]">
              Организуем Чемпионат и Первенство области, студенческую и
              юниорскую лиги, региональный этап клуба «Золотая шайба» и
              подготовку арбитров с 1992 года.
            </p>
            <div className="animate-soft-in mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
              <Btn href="/raspisanie" variant="accent">
                Расписание матчей
              </Btn>
              <Btn href="/sorevnovaniya" variant="light">
                Турнирные таблицы
              </Btn>
            </div>
          </div>
        </div>

      <ScoreStrip results={results} upcoming={upcoming} />

      {/* ---------- facts ---------- */}
      <section className="border-b border-line">
        <div className="container-x grid gap-8 grid-cols-2 lg:grid-cols-4 border-t border-line pt-10">
          {FACTS.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 70}
              className={`py-9 lg:py-11 border-r border-line last:border-r-0 ${
                i > 1 ? "border-t border-line lg:border-t-0 pt-10 lg:pt-0" : ""
              }`}
            >
              <p className="tnum font-display text-[2.4rem] font-semibold leading-none tracking-tight text-ink-900">
                {f.value}
              </p>
              <p className="mt-3 max-w-[180px] text-[12.5px] leading-snug text-muted">
                {f.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- news ---------- */}
      <section className="py-20 md:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHead
              eyebrow="Новости"
              title="Хроника нижегородского хоккея"
              action={<TextLink href="/novosti">Все новости</TextLink>}
            />
          </Reveal>

          <div className="mt-12 grid gap-12 border-t border-line pt-10 lg:grid-cols-[1.55fr_1fr]">
            {lead ? (
              <Reveal>
                <NewsCard item={lead} size="lg" />
              </Reveal>
            ) : null}

            <Reveal delay={90}>
              <div className="border-l border-line pl-6 lg:pl-10 pt-6 lg:pt-0">
                <p className="eyebrow border-b border-line pb-3 text-muted-2">
                  Лента
                </p>
                <div className="mt-2">
                  {sidebar.map((item, i) => (
                    <NewsRowItem key={item.id} item={item} index={i} />
                  ))}
                </div>
                <div className="pt-5">
                  <TextLink href="/novosti-nofh">Новости НОФХ</TextLink>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-3">
            {grid.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <NewsCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- standings + schedule ---------- */}
      <section className="border-y border-line bg-paper-2 py-20 md:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHead
              eyebrow="Сезон 2025 / 2026"
              title="Турнирные таблицы"
              lead="Положение команд в областных соревнованиях после завершённых туров."
              action={<TextLink href="/sorevnovaniya">Соревнования</TextLink>}
            />
          </Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-[2.1fr_1fr]">
            <Reveal className="bg-paper p-6 md:p-8">
              <StandingsBoard rows={standings} />
            </Reveal>

            <Reveal delay={100}>
              <div className="bg-paper p-6 md:p-8">
                <p className="eyebrow border-b border-line pb-3 text-muted-2">
                  Ближайшие матчи
                </p>
                <div className="divide-y divide-line">
                  {upcoming.slice(0, 5).map((m) => (
                    <div key={m.id} className="py-4">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-muted-2">
                        <span>{m.division}</span>
                        <span className="tnum">
                          {formatDateShort(m.startsAt)} · {formatTime(m.startsAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-[14.5px] font-semibold leading-snug text-ink-900">
                        {m.homeTeam}
                        <span className="px-2 text-muted-2">—</span>
                        {m.awayTeam}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[12px] text-muted">
                        <Icon name="pin" className="h-3.5 w-3.5" strokeWidth={1.4} />
                        {m.venue}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pt-5">
                  <TextLink href="/raspisanie">Полное расписание</TextLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- competitions ---------- */}
      <section className="py-20 md:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHead
              eyebrow="Соревнования"
              title="Турниры под эгидой федерации"
              action={<TextLink href="/sorevnovaniya/arxiv">Архив сезонов</TextLink>}
            />
          </Reveal>

          <div className="mt-4">
            {COMPETITIONS.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <Link
                  href="/sorevnovaniya"
                  className="group grid items-baseline gap-x-8 gap-y-3 border-b border-line py-8 md:grid-cols-[90px_1.2fr_1.6fr_auto]"
                >
                  <span className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">
                    {c.code}
                  </span>
                  <span>
                    <span className="block text-[1.3rem] font-semibold leading-tight text-ink-900 transition-colors group-hover:text-accent">
                      {c.title}
                    </span>
                    <span className="mt-1 block text-[12.5px] text-muted-2">
                      {c.subtitle}
                    </span>
                  </span>
                  <span className="text-[14px] leading-relaxed text-muted">
                    {c.description}
                  </span>
                  <span className="flex items-center gap-6 text-[12px] text-muted-2">
                    <span className="tnum">{c.teams} команд</span>
                    <span className="hidden lg:inline">{c.period}</span>
                    <Icon
                      name="arrow"
                      className="arrow-slide h-4 w-4 text-ink-900"
                      strokeWidth={1.5}
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- golden puck ---------- */}
      <section className="bg-ink-900 text-white">
        <div className="grid lg:grid-cols-2">
          <Reveal className="flex items-center">
            <div className="container-x py-20 lg:max-w-[640px] lg:py-28">
              <p className="eyebrow text-white/45">Клуб «Золотая шайба»</p>
              <h2 className="mt-5 text-[2.2rem] font-bold leading-[1.08] text-white sm:text-[2.9rem]">
                Хоккей начинается
                <br /> во дворе
              </h2>
              <p className="mt-6 max-w-lg text-[15.5px] leading-[1.8] text-white/65">
                Более 300 дворовых и школьных команд региона ежегодно играют в
                соревнованиях всероссийского клуба «Золотая шайба». Победители
                областного финала представляют Нижегородскую область в финале
                страны.
              </p>

              <dl className="mt-10 grid max-w-md grid-cols-3 border-t border-white/15">
                {[
                  ["300+", "команд"],
                  ["4 800", "участников"],
                  ["4", "этапа"],
                ].map(([v, l]) => (
                  <div key={l} className="border-r border-white/15 py-6 pr-4 last:border-r-0">
                    <dt className="tnum font-display text-[1.7rem] font-semibold leading-none">
                      {v}
                    </dt>
                    <dd className="mt-2 text-[12px] text-white/50">{l}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-wrap gap-4">
                <Btn href="/zolotaya-shajba" variant="accent">
                  О соревнованиях
                </Btn>
                <Btn href="/federaciya/quest" variant="light">
                  Заявить команду
                </Btn>
              </div>
            </div>
          </Reveal>

          <div className="relative min-h-[360px] lg:min-h-full">
            <Photo
              src="/photos/news/regionalnyj-final-zolotoj-shajby-zevershyon.jpg"
              alt="Региональный финал «Золотой шайбы», Ардатов"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="photo-grade object-cover"
            />
            <div className="absolute inset-0 bg-ink-900/20" />
          </div>
        </div>
      </section>

      {/* ---------- video ---------- */}
      <section className="py-20 md:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHead
              eyebrow="Медиа"
              title="Видео федерации"
              action={<TextLink href="/video">Весь архив</TextLink>}
            />
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {VIDEOS.slice(0, 3).map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <Link href="/video" className="group block">
                  <div className="media-zoom relative aspect-[16/10] overflow-hidden bg-paper-3">
                    <Photo
                      src={v.poster}
                      alt={v.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="photo-grade object-cover"
                    />
                    <span className="absolute inset-0 bg-ink-900/25 transition-colors duration-500 group-hover:bg-ink-900/10" />
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
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- partners ---------- */}
      <section className="border-t border-line py-16">
        <div className="container-x">
          <p className="eyebrow text-muted-2">Партнёры и соорганизаторы</p>
          <div className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.map((p) => (
              <div
                key={p}
                className="flex min-h-[88px] items-center bg-paper px-6 text-[14px] font-medium text-ink-700 transition-colors hover:text-accent"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
