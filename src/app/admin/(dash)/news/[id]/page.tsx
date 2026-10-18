import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { saveNewsAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export function toDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function NewsFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  let item = null;

  if (!isNew) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) notFound();
    const rows = await db
      .select()
      .from(news)
      .where(eq(news.id, numericId))
      .limit(1);
    item = rows[0] ?? null;
    if (!item) notFound();
  }

  const FIELD =
    "w-full border border-line bg-paper px-4 py-3 text-[14.5px] text-ink-900 outline-none transition-colors placeholder:text-muted-2 focus:border-ink-900";
  const LABEL =
    "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-accent">
            {isNew ? "Новый материал" : "Редактирование"}
          </p>
          <h1 className="mt-3 text-[1.8rem] font-bold tracking-tight text-ink-900">
            {isNew ? "Добавить новость" : "Изменить новость"}
          </h1>
        </div>
        <Link
          href="/admin/news"
          className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-accent"
        >
          ← К списку
        </Link>
      </div>

      <form
        action={saveNewsAction}
        className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start"
      >
        {item ? <input type="hidden" name="id" value={item.id} /> : null}

        <div className="space-y-6">
          <div>
            <label className={LABEL} htmlFor="title">
              Заголовок *
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={item?.title ?? ""}
              className={FIELD}
              placeholder="Например: Итоги очередного тура чемпионата области"
            />
          </div>

          <div>
            <label className={LABEL} htmlFor="excerpt">
              Краткое описание (лид)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={item?.excerpt ?? ""}
              className={`${FIELD} resize-none`}
              placeholder="Одно-два предложения для карточки новости в списке. Если оставить пустым — возьмём начало текста."
            />
          </div>

          <div>
            <label className={LABEL} htmlFor="body">
              Текст новости *
            </label>
            <textarea
              id="body"
              name="body"
              rows={18}
              defaultValue={item?.body ?? ""}
              className={`${FIELD} resize-y font-mono text-[13.5px] leading-relaxed`}
              placeholder={"Первый абзац.\n\nВторой абзац — между абзацами оставляйте пустую строку."}
            />
            <p className="mt-2 text-[12px] text-muted-2">
              Абзацы разделяются пустой строкой. Переносы строк внутри абзаца
              сохраняются.
            </p>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8">
          <div className="border border-line p-6">
            <p className="eyebrow text-muted-2">Публикация</p>

            <div className="mt-5 space-y-5">
              <div>
                <label className={LABEL} htmlFor="category">
                  Раздел
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={item?.category ?? "hockey"}
                  className={FIELD}
                >
                  <option value="hockey">Новости нижегородского хоккея</option>
                  <option value="nofh">Новости НОФХ</option>
                </select>
              </div>

              <div>
                <label className={LABEL} htmlFor="publishedAt">
                  Дата публикации
                </label>
                <input
                  id="publishedAt"
                  name="publishedAt"
                  type="datetime-local"
                  defaultValue={toDateTimeLocal(
                    item?.publishedAt ?? new Date(),
                  )}
                  className={FIELD}
                />
              </div>

              <div>
                <label className={LABEL} htmlFor="tags">
                  Рубрики через запятую
                </label>
                <input
                  id="tags"
                  name="tags"
                  defaultValue={item?.tags ?? ""}
                  className={FIELD}
                  placeholder="Золотая шайба, Результаты"
                />
              </div>

              <div>
                <label className={LABEL} htmlFor="slug">
                  Адрес страницы (латиницей)
                </label>
                <input
                  id="slug"
                  name="slug"
                  defaultValue={item?.slug ?? ""}
                  className={FIELD}
                  placeholder="itogi-tura"
                />
                <p className="mt-2 text-[12px] text-muted-2">
                  Оставьте пустым — сгенерируем из заголовка.
                </p>
              </div>

              <label className="flex items-center gap-3 text-[13.5px] text-ink-700">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={item?.featured ?? false}
                  className="h-4 w-4 accent-[#c8102e]"
                />
                Показать крупно на главной
              </label>
            </div>
          </div>

          <div className="border border-line p-6">
            <p className="eyebrow text-muted-2">Фотография</p>

            <div className="mt-5 space-y-5">
              <div>
                <label className={LABEL} htmlFor="imageFile">
                  Загрузить файл
                </label>
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  className="w-full border border-line bg-paper px-3 py-2.5 text-[13px] text-ink-700 file:mr-4 file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.12em] file:text-white"
                />
                <p className="mt-2 text-[12px] text-muted-2">
                  JPEG или PNG до 4 МБ. Файл сохранится в базе и будет доступен
                  по постоянной ссылке.
                </p>
              </div>

              <div className="relative">
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-px w-full bg-line" />
                </span>
                <span className="relative mx-auto block w-fit bg-paper px-3 text-[10.5px] uppercase tracking-[0.14em] text-muted-2">
                  или указать путь
                </span>
              </div>

              <div>
                <label className={LABEL} htmlFor="image">
                  Путь к изображению
                </label>
                <input
                  id="image"
                  name="image"
                  defaultValue={item?.image ?? "/photos/stock/action-2.jpg"}
                  className={FIELD}
                  placeholder="/photos/news/filename.jpg"
                />
              </div>

              {item ? (
                <input type="hidden" name="views" value={item.views} />
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-ink-900 px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent"
            >
              {isNew ? "Опубликовать" : "Сохранить изменения"}
            </button>
            <Link
              href="/admin/news"
              className="w-full border border-line-strong px-6 py-3.5 text-center text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-900 transition-colors hover:border-ink-900"
            >
              Отмена
            </Link>
          </div>
        </aside>
      </form>
    </>
  );
}
