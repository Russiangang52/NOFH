import { and, asc, desc, eq, gte, ne } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded, ensureMediaFromPublic } from "@/db/seed";
import { matches, news, standings } from "@/db/schema";
import type { MatchRow, NewsRow, StandingRow } from "@/db/schema";

async function ready() {
  await ensureSeeded();
  await ensureMediaFromPublic();
}

export async function getNews(options?: {
  category?: string;
  limit?: number;
}): Promise<NewsRow[]> {
  await ready();
  const limit = options?.limit ?? 50;
  if (options?.category) {
    return db
      .select()
      .from(news)
      .where(eq(news.category, options.category))
      .orderBy(desc(news.publishedAt))
      .limit(limit);
  }
  return db.select().from(news).orderBy(desc(news.publishedAt)).limit(limit);
}

export async function getFeaturedNews(): Promise<NewsRow[]> {
  await ready();
  return db
    .select()
    .from(news)
    .where(eq(news.featured, true))
    .orderBy(desc(news.publishedAt))
    .limit(3);
}

export async function getNewsBySlug(slug: string): Promise<NewsRow | null> {
  await ready();
  const rows = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getRelatedNews(slug: string): Promise<NewsRow[]> {
  await ready();
  return db
    .select()
    .from(news)
    .where(ne(news.slug, slug))
    .orderBy(desc(news.publishedAt))
    .limit(3);
}

export async function getStandings(division?: string): Promise<StandingRow[]> {
  await ready();
  if (division) {
    return db
      .select()
      .from(standings)
      .where(eq(standings.division, division))
      .orderBy(asc(standings.position));
  }
  return db
    .select()
    .from(standings)
    .orderBy(asc(standings.division), asc(standings.position));
}

export async function getUpcomingMatches(limit = 8): Promise<MatchRow[]> {
  await ready();
  return db
    .select()
    .from(matches)
    .where(and(eq(matches.status, "scheduled"), gte(matches.startsAt, new Date(Date.now() - 36e5))))
    .orderBy(asc(matches.startsAt))
    .limit(limit);
}

export async function getRecentResults(limit = 6): Promise<MatchRow[]> {
  await ready();
  return db
    .select()
    .from(matches)
    .where(eq(matches.status, "finished"))
    .orderBy(desc(matches.startsAt))
    .limit(limit);
}
