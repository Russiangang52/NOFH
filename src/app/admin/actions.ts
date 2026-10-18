"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { matches, media, news, questions, standings } from "@/db/schema";
import {
  checkPassword,
  createSession,
  destroySession,
  requireAdmin,
} from "@/lib/auth";

const MAX_UPLOAD = 4 * 1024 * 1024; // 4 МБ

function str(data: FormData, key: string, max = 4000): string {
  return String(data.get(key) ?? "")
    .trim()
    .slice(0, max);
}

function num(data: FormData, key: string): number {
  const raw = str(data, key, 20);
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

function slugify(input: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  const base = input
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return base || `material-${Date.now()}`;
}

function refreshPublic(): void {
  revalidatePath("/");
  revalidatePath("/novosti");
  revalidatePath("/novosti-nofh");
  revalidatePath("/raspisanie");
  revalidatePath("/sorevnovaniya");
  revalidatePath("/zolotaya-shajba");
}

/* ------------------------- auth ------------------------- */

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = str(formData, "password", 200);
  if (!password) return { error: "Введите пароль" };
  if (!checkPassword(password)) return { error: "Неверный пароль" };
  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------- media ------------------------- */

async function saveUpload(
  file: File | null,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_UPLOAD) {
    throw new Error("Файл больше 4 МБ — уменьшите размер изображения");
  }
  const mime = file.type || "image/jpeg";
  if (!mime.startsWith("image/")) {
    throw new Error("Можно загружать только изображения");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const [row] = await db
    .insert(media)
    .values({
      filename: (file.name || "upload.jpg").slice(0, 240),
      mime,
      data: buffer.toString("base64"),
    })
    .returning();
  return `/api/media/${row.id}`;
}

/* ------------------------- news ------------------------- */

export type NewsFormState = { error?: string };

// Overload 1: для <form action={saveNewsAction}> (без useActionState)
export async function saveNewsAction(formData: FormData): Promise<void>;
// Overload 2: для useActionState — NewsEditor.tsx
export async function saveNewsAction(prev: NewsFormState, formData: FormData): Promise<NewsFormState>;
// Implementation
export async function saveNewsAction(
  prevOrFormData: NewsFormState | FormData,
  formDataOrUndefined?: FormData,
): Promise<NewsFormState | void> {
  await requireAdmin();

  const data: FormData = formDataOrUndefined ?? (prevOrFormData as FormData);

  const id = Number(str(data, "id", 20));
  const title = str(data, "title", 300);
  if (title.length < 3) return { error: "Укажите заголовок (минимум 3 символа)" };

  const body = str(data, "body", 20000);
  const excerptInput = str(data, "excerpt", 600);
  const excerpt =
    excerptInput ||
    `${body.replace(/\s+/g, " ").trim().slice(0, 200)}…`;

  const category = str(data, "category", 20) === "nofh" ? "nofh" : "hockey";
  const tags = str(data, "tags", 200);
  const slug = str(data, "slug", 200) || slugify(title);
  const publishedAtRaw = str(data, "publishedAt", 40);
  const publishedAt = publishedAtRaw
    ? new Date(publishedAtRaw)
    : new Date();

  const uploaded = await saveUpload(data.get("imageFile") as File | null);
  const image = uploaded || str(data, "image", 300) || "/photos/stock/action-2.jpg";
  const featured = data.get("featured") === "on";
  const viewsRaw = Number(str(data, "views", 12));

  const values = {
    slug,
    title,
    excerpt,
    body,
    category,
    tags,
    image,
    featured,
    views: Number.isFinite(viewsRaw) && viewsRaw >= 0 ? viewsRaw : 0,
    publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
  };

  try {
    if (Number.isInteger(id) && id > 0) {
      await db.update(news).set(values).where(eq(news.id, id));
    } else {
      await db.insert(news).values(values);
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Не удалось сохранить публикацию." };
  }

  refreshPublic();
  redirect("/admin/news?saved=1");
  return {};
}

export async function deleteNewsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(str(formData, "id", 20));
  if (Number.isInteger(id) && id > 0) {
    await db.delete(news).where(eq(news.id, id));
  }
  refreshPublic();
  revalidatePath("/admin/news");
  redirect("/admin/news?deleted=1");
}

/* ------------------------- matches / events ------------------------- */

export async function saveMatchAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(str(formData, "id", 20));
  const division = str(formData, "division", 40) || "Чемпионат области";
  const stage = str(formData, "stage", 80) || "Регулярный чемпионат";
  const homeTeam = str(formData, "homeTeam", 80);
  const awayTeam = str(formData, "awayTeam", 80);
  if (!homeTeam || !awayTeam) throw new Error("Укажите обе команды");

  const homeRaw = str(formData, "homeScore", 5);
  const awayRaw = str(formData, "awayScore", 5);
  const status = str(formData, "status", 20) || "scheduled";
  const hasScore = homeRaw !== "" && awayRaw !== "";
  const startsRaw = str(formData, "startsAt", 40);
  const startsAt = startsRaw ? new Date(startsRaw) : new Date();

  const values = {
    season: str(formData, "season", 20) || "2025-2026",
    division,
    stage,
    homeTeam,
    awayTeam,
    homeScore: hasScore ? Number(homeRaw) : null,
    awayScore: hasScore ? Number(awayRaw) : null,
    venue: str(formData, "venue", 160),
    startsAt: Number.isNaN(startsAt.getTime()) ? new Date() : startsAt,
    status: hasScore ? "finished" : status,
  };

  if (Number.isInteger(id) && id > 0) {
    await db.update(matches).set(values).where(eq(matches.id, id));
  } else {
    await db.insert(matches).values(values);
  }

  refreshPublic();
  revalidatePath("/admin/matches");
  redirect("/admin/matches?saved=1");
}

export async function deleteMatchAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(str(formData, "id", 20));
  if (Number.isInteger(id) && id > 0) {
    await db.delete(matches).where(eq(matches.id, id));
  }
  refreshPublic();
  revalidatePath("/admin/matches");
  redirect("/admin/matches?deleted=1");
}

/* ------------------------- standings (турнирные таблицы) ------------------------- */

export async function saveStandingAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(str(formData, "id", 20));
  const season = str(formData, "season", 20) || "2025-2026";
  const division = str(formData, "division", 40);
  const team = str(formData, "team", 80);
  const city = str(formData, "city", 80);

  if (!division) throw new Error("Укажите турнир (дивизион).");
  if (!team) throw new Error("Укажите название команды.");

  const values = {
    season,
    division,
    position: num(formData, "position") || 1,
    team,
    city,
    games: num(formData, "games"),
    wins: num(formData, "wins"),
    winsOt: num(formData, "winsOt"),
    winsSo: num(formData, "winsSo"),
    lossesOt: num(formData, "lossesOt"),
    lossesSo: num(formData, "lossesSo"),
    losses: num(formData, "losses"),
    goalsFor: num(formData, "goalsFor"),
    goalsAgainst: num(formData, "goalsAgainst"),
    points: num(formData, "points"),
  };

  if (Number.isInteger(id) && id > 0) {
    await db.update(standings).set(values).where(eq(standings.id, id));
  } else {
    await db.insert(standings).values(values);
  }

  refreshPublic();
  revalidatePath("/admin/standings");
  redirect("/admin/standings?saved=1");
}

export async function deleteStandingAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(str(formData, "id", 20));
  if (Number.isInteger(id) && id > 0) {
    await db.delete(standings).where(eq(standings.id, id));
  }
  refreshPublic();
  revalidatePath("/admin/standings");
  redirect("/admin/standings?deleted=1");
}

/* ------------------------- questions ------------------------- */

export async function answerQuestionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(str(formData, "id", 20));
  const answer = str(formData, "answer", 6000);
  if (Number.isInteger(id) && id > 0) {
    await db
      .update(questions)
      .set({ answer: answer || null })
      .where(eq(questions.id, id));
  }
  revalidatePath("/admin/questions");
  redirect("/admin/questions?saved=1");
}

export async function deleteQuestionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(str(formData, "id", 20));
  if (Number.isInteger(id) && id > 0) {
    await db.delete(questions).where(eq(questions.id, id));
  }
  revalidatePath("/admin/questions");
  redirect("/admin/questions?deleted=1");
}
