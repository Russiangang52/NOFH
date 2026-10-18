"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveNewsAction, type NewsFormState } from "@/app/admin/actions";
import PhotoPicker from "@/components/admin/PhotoPicker";

export type NewsDraft = {
  id?: number;
  title: string;
  excerpt: string;
  body: string;
  category: "hockey" | "nofh";
  tags: string;
  slug: string;
  publishedAt: string;
  featured: boolean;
  image: string;
};

const FIELD = "w-full border border-line bg-paper px-4 py-3 text-[14px] text-ink-900 outline-none transition-colors placeholder:text-muted-2 focus:border-ink-900";
const LABEL = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

export default function NewsEditor({ initial }: { initial: NewsDraft }) {
  const [draft, setDraft] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [state, save, pending] = useActionState<NewsFormState, FormData>(saveNewsAction, {});

  function change<Key extends keyof NewsDraft>(key: Key, value: NewsDraft[Key]) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  return (
    <form action={save} onSubmit={event => { if (uploading) event.preventDefault(); }} className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      {draft.id ? <input type="hidden" name="id" value={draft.id} /> : null}
      <div className="space-y-6">
        {state.error ? <p role="alert" className="border-l-2 border-accent bg-accent-soft p-4 text-[14px] leading-relaxed text-accent">{state.error}</p> : null}
        <div>
          <label className={LABEL} htmlFor="title">Заголовок *</label>
          <input id="title" name="title" required minLength={3} maxLength={300} value={draft.title} onChange={event => change("title", event.target.value)} className={FIELD} placeholder="Например: Итоги тура чемпионата области" />
        </div>
        <div>
          <label className={LABEL} htmlFor="excerpt">Краткое описание</label>
          <textarea id="excerpt" name="excerpt" rows={3} maxLength={600} value={draft.excerpt} onChange={event => change("excerpt", event.target.value)} className={`${FIELD} resize-y`} placeholder="Одно-два предложения для карточки новости. Можно оставить пустым." />
        </div>
        <div>
          <label className={LABEL} htmlFor="body">Текст новости *</label>
          <textarea id="body" name="body" required minLength={5} maxLength={20000} rows={20} value={draft.body} onChange={event => change("body", event.target.value)} className={`${FIELD} resize-y leading-relaxed`} placeholder={"Первый абзац.\n\nВторой абзац — между абзацами оставьте пустую строку."} />
          <p className="mt-2 text-[12px] text-muted-2">Абзацы разделяются пустой строкой. Переносы сохраняются.</p>
        </div>
      </div>

      <aside className="space-y-6">
        <PhotoPicker value={draft.image} onChange={url => change("image", url)} onBusyChange={setUploading} />
        <div className="border border-line p-6">
          <p className="eyebrow text-muted-2">Публикация</p>
          <div className="mt-5 space-y-5">
            <div>
              <label className={LABEL} htmlFor="category">Раздел</label>
              <select id="category" name="category" value={draft.category} onChange={event => change("category", event.target.value === "nofh" ? "nofh" : "hockey")} className={FIELD}>
                <option value="hockey">Новости нижегородского хоккея</option>
                <option value="nofh">Новости НОФХ</option>
              </select>
            </div>
            <div>
              <label className={LABEL} htmlFor="publishedAt">Дата и время · Москва</label>
              <input id="publishedAt" name="publishedAt" type="datetime-local" value={draft.publishedAt} onChange={event => change("publishedAt", event.target.value)} className={FIELD} />
            </div>
            <div>
              <label className={LABEL} htmlFor="tags">Рубрики через запятую</label>
              <input id="tags" name="tags" maxLength={200} value={draft.tags} onChange={event => change("tags", event.target.value)} className={FIELD} placeholder="Золотая шайба, Результаты" />
            </div>
            <div>
              <label className={LABEL} htmlFor="slug">Адрес страницы</label>
              <input id="slug" name="slug" maxLength={200} value={draft.slug} onChange={event => change("slug", event.target.value)} className={FIELD} placeholder="itogi-tura" />
              <p className="mt-2 text-[12px] text-muted-2">Латиницей. Оставьте пустым для автоматического адреса.</p>
            </div>
            <label className="flex items-center gap-3 text-[13px] text-ink-700">
              <input type="checkbox" name="featured" checked={draft.featured} onChange={event => change("featured", event.target.checked)} className="h-4 w-4 accent-[#c8102e]" />
              Отметить как главный материал
            </label>
          </div>
        </div>
        <div className="space-y-3">
          <button type="submit" disabled={pending || uploading} className="w-full bg-ink-900 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-50">
            {uploading ? "Дождитесь загрузки фото…" : pending ? "Сохраняем…" : draft.id ? "Сохранить изменения" : "Опубликовать"}
          </button>
          <Link href="/admin/news" className="block w-full border border-line-strong px-6 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-900 hover:border-ink-900">Отмена</Link>
        </div>
      </aside>
    </form>
  );
}
