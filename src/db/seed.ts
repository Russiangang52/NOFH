import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { matches, meta, news, standings } from "@/db/schema";
import { NEWS_SEED, NEWS_SEED_VERSION } from "@/db/news-data";

type StandingSeed = [
  division: string,
  position: number,
  team: string,
  city: string,
  games: number,
  wins: number,
  winsOt: number,
  winsSo: number,
  lossesSo: number,
  lossesOt: number,
  losses: number,
  gf: number,
  ga: number,
  points: number,
];

const standingsSeed: StandingSeed[] = [
  ["Чемпионат области", 1, "ХК «Кстово»", "Кстово", 16, 12, 0, 1, 1, 1, 1, 98, 45, 40],
  ["Чемпионат области", 2, "Старт", "Нижний Новгород", 16, 11, 1, 1, 1, 0, 2, 94, 67, 38],
  ["Чемпионат области", 3, "ХК «Княгинино»", "Княгинино", 16, 10, 1, 0, 0, 0, 5, 70, 50, 32],
  ["Чемпионат области", 4, "ХК «Саров»", "Саров", 16, 8, 1, 1, 1, 0, 5, 80, 66, 28],
  ["Чемпионат области", 5, "ХК «Сеченово»", "Сеченово", 16, 8, 0, 0, 1, 1, 6, 83, 79, 26],
  ["Чемпионат области", 6, "Металлург", "Выкса", 16, 6, 0, 0, 0, 0, 10, 60, 59, 18],
  ["Чемпионат области", 7, "Авто-Транс НН", "Нижний Новгород", 16, 5, 0, 1, 0, 0, 10, 79, 92, 17],
  ["Чемпионат области", 8, "ХК «Арзамас»", "Арзамас", 16, 5, 0, 0, 0, 1, 10, 69, 77, 16],
  ["Чемпионат области", 9, "Кварц", "Бор", 16, 0, 0, 0, 0, 0, 16, 44, 142, 0],

  ["Первенство области", 1, "Торпедо-2010", "Нижний Новгород", 18, 15, 1, 0, 0, 1, 1, 121, 44, 48],
  ["Первенство области", 2, "ХК «Дзержинск»", "Дзержинск", 18, 13, 0, 1, 1, 0, 3, 104, 58, 41],
  ["Первенство области", 3, "Саров-Юниор", "Саров", 18, 11, 1, 0, 1, 1, 4, 92, 61, 37],
  ["Первенство области", 4, "Арзамас-Оникс", "Арзамас", 18, 10, 0, 1, 0, 1, 6, 88, 70, 33],
  ["Первенство области", 5, "Кстово-2011", "Кстово", 18, 8, 0, 0, 1, 1, 8, 71, 73, 26],
  ["Первенство области", 6, "Металлург-Ю", "Выкса", 18, 6, 1, 0, 0, 0, 11, 64, 88, 20],
  ["Первенство области", 7, "Радий", "Нижний Новгород", 18, 5, 0, 1, 1, 0, 11, 59, 91, 18],
  ["Первенство области", 8, "Рубин", "Ардатов", 18, 3, 0, 0, 0, 1, 14, 48, 112, 10],

  ["Студенты", 1, "НГТУ", "Нижний Новгород", 14, 11, 1, 0, 0, 1, 1, 78, 39, 36],
  ["Студенты", 2, "ННГУ", "Нижний Новгород", 14, 9, 0, 1, 1, 0, 3, 66, 44, 29],
  ["Студенты", 3, "НГПУ им. Минина", "Нижний Новгород", 14, 7, 1, 0, 0, 1, 5, 58, 51, 24],
  ["Студенты", 4, "ВГУВТ", "Нижний Новгород", 14, 6, 0, 0, 1, 0, 7, 49, 55, 19],
  ["Студенты", 5, "НГСХА", "Нижний Новгород", 14, 4, 0, 1, 0, 1, 8, 41, 62, 14],
  ["Студенты", 6, "НИУ ВШЭ НН", "Нижний Новгород", 14, 2, 0, 0, 0, 0, 12, 30, 71, 6],

  ["Юниоры", 1, "Торпедо-Юниор", "Нижний Новгород", 12, 10, 0, 1, 0, 0, 1, 72, 28, 33],
  ["Юниоры", 2, "Чайка-2008", "Нижний Новгород", 12, 8, 1, 0, 1, 0, 2, 61, 34, 28],
  ["Юниоры", 3, "Саров-Юниор", "Саров", 12, 6, 0, 1, 0, 1, 4, 48, 42, 21],
  ["Юниоры", 4, "Кстово-Юниор", "Кстово", 12, 4, 0, 0, 1, 1, 6, 39, 47, 14],
  ["Юниоры", 5, "Дзержинск-Юниор", "Дзержинск", 12, 2, 0, 0, 0, 1, 9, 28, 58, 7],
  ["Юниоры", 6, "Арзамас-Юниор", "Арзамас", 12, 1, 0, 0, 0, 0, 11, 22, 61, 3],
];

type MatchSeed = {
  division: string;
  stage: string;
  home: string;
  away: string;
  hs?: number;
  as?: number;
  venue: string;
  inDays: number;
  hour: number;
  status: string;
};

const matchesSeed: MatchSeed[] = [
  { division: "Чемпионат области", stage: "Финал. Большой Кубок", home: "ХК «Кстово»", away: "Старт", hs: 3, as: 2, venue: "ФОК «Кстово»", inDays: -12, hour: 18, status: "finished" },
  { division: "Чемпионат области", stage: "Матч за 3-е место", home: "ХК «Княгинино»", away: "ХК «Саров»", hs: 1, as: 2, venue: "ФОК «Нива», Княгинино", inDays: -13, hour: 15, status: "finished" },
  { division: "Чемпионат области", stage: "Финал. Малый Кубок", home: "ХК «Сеченово»", away: "Авто-Транс НН", hs: 0, as: 2, venue: "ФОК «Олимп», Сеченово", inDays: -14, hour: 17, status: "finished" },
  { division: "Студенты", stage: "Плей-офф. 1/4 финала", home: "ННГУ", away: "НГТУ", hs: 2, as: 4, venue: "КРК «Нагорный», Нижний Новгород", inDays: -5, hour: 19, status: "finished" },

  { division: "Первенство области", stage: "Финал четырёх. Полуфинал", home: "Торпедо-2010", away: "Арзамас-Оникс", venue: "ЛД «Торпедо», Нижний Новгород", inDays: 3, hour: 11, status: "scheduled" },
  { division: "Первенство области", stage: "Финал четырёх. Полуфинал", home: "ХК «Дзержинск»", away: "Саров-Юниор", venue: "ЛД «Уран», Дзержинск", inDays: 3, hour: 14, status: "scheduled" },
  { division: "Первенство области", stage: "Финал четырёх. Финал", home: "Победитель 1/2", away: "Победитель 1/2", venue: "ЛД «Торпедо», Нижний Новгород", inDays: 5, hour: 13, status: "scheduled" },
  { division: "Юниоры", stage: "Регулярный чемпионат", home: "Торпедо-Юниор", away: "Чайка-2008", venue: "КРК «Нагорный», Нижний Новгород", inDays: 2, hour: 16, status: "scheduled" },
  { division: "Юниоры", stage: "Регулярный чемпионат", home: "Кстово-Юниор", away: "Саров-Юниор", venue: "ФОК «Кстово»", inDays: 4, hour: 12, status: "scheduled" },
  { division: "Студенты", stage: "Плей-офф. 1/2 финала", home: "НГТУ", away: "НГПУ им. Минина", venue: "КРК «Нагорный», Нижний Новгород", inDays: 6, hour: 19, status: "scheduled" },
  { division: "Чемпионат области", stage: "Кубок открытия сезона", home: "ХК «Кстово»", away: "Авто-Транс НН", venue: "ФОК «Кстово»", inDays: 9, hour: 18, status: "scheduled" },
  { division: "Чемпионат области", stage: "Кубок открытия сезона", home: "ХК «Саров»", away: "Металлург", venue: "ЛД «Саров»", inDays: 10, hour: 17, status: "scheduled" },
];

const day = 24 * 60 * 60 * 1000;

let seedPromise: Promise<void> | null = null;

async function runSeed(): Promise<void> {
  await db.transaction(async (tx) => {
    // A database lock protects concurrent cold starts on serverless hosting.
    await tx.execute(sql`select pg_advisory_xact_lock(73849217)`);
    const [newsFlag] = await tx.select().from(meta).where(eq(meta.key, "news_seed_version")).limit(1);
    if (newsFlag?.value !== NEWS_SEED_VERSION) {
      const existing = await tx.select({ id: news.id }).from(news).limit(1);
      // Never delete or overwrite administrator content, even without a seed flag.
      if (existing.length === 0) {
        await tx.insert(news).values(NEWS_SEED.map((item) => ({
          ...item,
          publishedAt: new Date(`${item.publishedAt}T12:00:00+03:00`),
        }))).onConflictDoNothing({ target: news.slug });
      }
      await tx.insert(meta).values({ key: "news_seed_version", value: NEWS_SEED_VERSION })
        .onConflictDoUpdate({ target: meta.key, set: { value: NEWS_SEED_VERSION } });
    }

    const [sportsFlag] = await tx.select().from(meta).where(eq(meta.key, "sports_seed_version")).limit(1);
    if (sportsFlag) return;
    const existingStandings = await tx.select({ id: standings.id }).from(standings).limit(1);
    if (!existingStandings.length) {
      await tx.insert(standings).values(standingsSeed.map((row) => ({
        season: "2025-2026", division: row[0], position: row[1], team: row[2], city: row[3],
        games: row[4], wins: row[5], winsOt: row[6], winsSo: row[7], lossesSo: row[8],
        lossesOt: row[9], losses: row[10], goalsFor: row[11], goalsAgainst: row[12], points: row[13],
      })));
    }
    const existingMatches = await tx.select({ id: matches.id }).from(matches).limit(1);
    if (!existingMatches.length) {
      const now = Date.now();
      await tx.insert(matches).values(matchesSeed.map((m) => ({
        season: "2025-2026", division: m.division, stage: m.stage,
        homeTeam: m.home, awayTeam: m.away, homeScore: m.hs ?? null, awayScore: m.as ?? null,
        venue: m.venue,
        startsAt: new Date(new Date(now + m.inDays * day).setHours(m.hour, 0, 0, 0)),
        status: m.status,
      })));
    }
    await tx.insert(meta).values({ key: "sports_seed_version", value: "1" }).onConflictDoNothing();
  });
}

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
