"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { matches, media, news, questions } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { isBundledPhotoPath, isOwnedPhotoPath } from "@/lib/photos";
import {
  checkPassword,
  createSession,
  destroySession,
  requireAdmin,
} from "@/lib/auth";

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
  if (!process.env.ADMIN_PASSWORD) return { error: "Настройте ADMIN_PASSWORD в переменных окружения хостинга и выполните новый деплой." };
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

/* ------------------------- news ------------------------- */

export type NewsFormState = { error?: string };

export async function saveNewsAction(
  _previous: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  await requireAdmin();
  const idRaw = str(formData, "id", 20);
  const id = idRaw ? Number(idRaw) : null;
  if (id !== null && (!Number.isSafeInteger(id) || id <= 0)) return { error: "Некорректный номер публикации." };
  const title = str(formData, "title", 300);
  const body = str(formData, "body", 20000);
  if (title.length < 3) return { error: "Укажите заголовок не короче трёх символов." };
  if (body.length < 5) return { error: "Добавьте текст публикации." };
  const slugInput = str(formData, "slug", 200);
  let slug = slugInput || slugify(title);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { error: "В адресе страницы допустимы латинские буквы, цифры и дефисы." };
  const image = str(formData, "image", 300);
  if (image && !isOwnedPhotoPath(image)) return { error: "Выберите фотографию из медиатеки или загрузите файл. Внешние ссылки не используются." };
  const rawDate = str(formData, "publishedAt", 40);
  const publishedAt = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(rawDate)
    ? new Date(`${rawDate}:00+03:00`)
    : new Date();
  if (Number.isNaN(publishedAt.getTime())) return { error: "Проверьте дату публикации." };

  let oldSlug: string | undefined;
  try {
    await ensureSeeded();
    const current = id === null ? undefined : (await db.select().from(news).where(eq(news.id, id)).limit(1))[0];
    if (id !== null && !current) return { error: "Публикация не найдена. Возможно, её удалил другой администратор." };
    oldSlug = current?.slug;
    const duplicate = (await db.select({ id: news.id }).from(news).where(eq(news.slug, slug)).limit(1))[0];
    if (duplicate && duplicate.id !== id) {
      if (slugInput) return { error: "Такой адрес страницы уже существует. Укажите другой." };
      slug = `${slug}-${Date.now().toString(36)}`;
    }
    if (image && !isBundledPhotoPath(image)) {
      const photoId = Number(image.split("/").pop());
      if (!Number.isSafeInteger(photoId)) return { error: "Некорректный файл фотографии." };
      const [photo] = await db.select({ id: media.id }).from(media).where(eq(media.id, photoId)).limit(1);
      if (!photo) return { error: "Фотография не найдена в вашей базе. Загрузите её ещё раз." };
    }
    const excerpt = str(formData, "excerpt", 600) || body.replace(/\s+/g, " ").slice(0, 200) + (body.length > 200 ? "…" : "");
    const values = {
      title, body, slug, excerpt, image,
      category: str(formData, "category", 20) === "nofh" ? "nofh" : "hockey",
      tags: str(formData, "tags", 200),
      featured: formData.get("featured") === "on",
      views: current?.views ?? 0,
      publishedAt,
    };
    if (id === null) await db.insert(news).values(values);
    else await db.update(news).set(values).where(eq(news.id, id));
  } catch (error) {
    console.error("News could not be saved", error instanceof Error ? error.message : "unknown error");
    return { error: "Не удалось сохранить материал. Проверьте адрес страницы и соединение с базой, затем повторите попытку. Фотография остаётся в медиатеке." };
  }

  refreshPublic();
  revalidatePath("/admin/news");
  revalidatePath(`/novosti/${slug}`);
  if (oldSlug && oldSlug !== slug) revalidatePath(`/novosti/${oldSlug}`);
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
