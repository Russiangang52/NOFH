"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { matches, media, news, questions } from "@/db/schema";
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

export async function saveNewsAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(str(formData, "id", 20));
  const title = str(formData, "title", 300);
  if (title.length < 3) throw new Error("Укажите заголовок");

  const body = str(formData, "body", 20000);
  const excerptInput = str(formData, "excerpt", 600);
  const excerpt =
    excerptInput ||
    `${body.replace(/\s+/g, " ").trim().slice(0, 200)}…`;

  const category = str(formData, "category", 20) === "nofh" ? "nofh" : "hockey";
  const tags = str(formData, "tags", 200);
  const slug = str(formData, "slug", 200) || slugify(title);
  const publishedAtRaw = str(formData, "publishedAt", 40);
  const publishedAt = publishedAtRaw
    ? new Date(publishedAtRaw)
    : new Date();

  const uploaded = await saveUpload(formData.get("imageFile") as File | null);
  const image = uploaded || str(formData, "image", 300) || "/photos/stock/action-2.jpg";
  const featured = formData.get("featured") === "on";
  const viewsRaw = Number(str(formData, "views", 12));

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

  if (Number.isInteger(id) && id > 0) {
    await db.update(news).set(values).where(eq(news.id, id));
  } else {
    await db.insert(news).values(values);
  }

  refreshPublic();
  redirect("/admin/news?saved=1");
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
