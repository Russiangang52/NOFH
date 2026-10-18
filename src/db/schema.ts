import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  category: varchar("category", { length: 40 }).notNull().default("hockey"),
  tags: text("tags").notNull().default(""),
  image: varchar("image", { length: 300 }).notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const standings = pgTable("standings", {
  id: serial("id").primaryKey(),
  season: varchar("season", { length: 20 }).notNull().default("2025-2026"),
  division: varchar("division", { length: 40 }).notNull(),
  position: integer("position").notNull(),
  team: varchar("team", { length: 80 }).notNull(),
  city: varchar("city", { length: 80 }).notNull().default(""),
  games: integer("games").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  winsOt: integer("wins_ot").notNull().default(0),
  winsSo: integer("wins_so").notNull().default(0),
  lossesSo: integer("losses_so").notNull().default(0),
  lossesOt: integer("losses_ot").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  goalsFor: integer("goals_for").notNull().default(0),
  goalsAgainst: integer("goals_against").notNull().default(0),
  points: integer("points").notNull().default(0),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  season: varchar("season", { length: 20 }).notNull().default("2025-2026"),
  division: varchar("division", { length: 40 }).notNull(),
  stage: varchar("stage", { length: 80 }).notNull().default("Регулярный чемпионат"),
  homeTeam: varchar("home_team", { length: 80 }).notNull(),
  awayTeam: varchar("away_team", { length: 80 }).notNull(),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  venue: varchar("venue", { length: 160 }).notNull().default(""),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("scheduled"),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  contact: varchar("contact", { length: 160 }).notNull().default(""),
  topic: varchar("topic", { length: 80 }).notNull().default("Общий вопрос"),
  message: text("message").notNull(),
  answer: text("answer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 240 }).notNull(),
  mime: varchar("mime", { length: 80 }).notNull(),
  data: text("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const meta = pgTable("meta", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: text("value").notNull(),
});

export type NewsRow = typeof news.$inferSelect;
export type StandingRow = typeof standings.$inferSelect;
export type MatchRow = typeof matches.$inferSelect;
export type QuestionRow = typeof questions.$inferSelect;
export type MediaRow = typeof media.$inferSelect;
