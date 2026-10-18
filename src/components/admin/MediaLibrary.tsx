"use client";

import { useEffect, useState } from "react";
import Photo from "@/components/Photo";
import UploadPhoto from "@/components/admin/UploadPhoto";
import { BUNDLED_PHOTOS, photoDownloadUrl, photoSize, type LibraryPhoto, type LibraryResponse } from "@/lib/photos";

async function readPage(cursor?: number): Promise<LibraryResponse> {
  const response = await fetch(`/api/admin/media${cursor ? `?cursor=${cursor}` : ""}`, { cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Не удалось открыть медиатеку.");
  return result as LibraryResponse;
}

function mergePhotos(existing: LibraryPhoto[], incoming: LibraryPhoto[]) {
  return Array.from(new Map([...existing, ...incoming].map(photo => [photo.id, photo])).values());
}

export default function MediaLibrary({ onSelect, selectedUrl }: {
  onSelect?: (photo: LibraryPhoto) => void;
  selectedUrl?: string;
}) {
  const [uploads, setUploads] = useState<LibraryPhoto[]>([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "database" | "project">("all");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let ignore = false;
    readPage().then(result => {
      if (ignore) return;
      setUploads(current => mergePhotos(current, result.photos));
      setTotal(current => Math.max(current, result.total));
      setCursor(result.nextCursor);
    }).catch(err => {
      if (!ignore) setError(err instanceof Error ? err.message : "Медиатека недоступна.");
    }).finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  async function loadMore() {
    if (!cursor || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await readPage(cursor);
      setUploads(current => mergePhotos(current, result.photos));
      setCursor(result.nextCursor);
      setTotal(result.total);
    } catch (err) { setError(err instanceof Error ? err.message : "Не удалось загрузить фотографии."); }
    finally { setLoading(false); }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setNotice(`Путь скопирован: ${url}`);
    } catch { setNotice(`Путь к файлу: ${url}`); }
  }

  async function exportUploads() {
    setExporting(true);
    setError("");
    try {
      let page = await readPage();
      const all = [...page.photos];
      while (page.nextCursor !== null) {
        page = await readPage(page.nextCursor);
        all.push(...page.photos);
      }
      if (!all.length) throw new Error("Вы ещё не загрузили фотографии.");
      if (all.reduce((sum, photo) => sum + photo.bytes, 0) > 100 * 1024 * 1024) {
        throw new Error("Архив превышает 100 МБ. Скачайте файлы по отдельности или сделайте резервную копию PostgreSQL.");
      }
      const { zipSync, strToU8 } = await import("fflate");
      const files: Record<string, Uint8Array> = {};
      for (const [index, photo] of all.entries()) {
        setNotice(`Готовим архив: ${index + 1} из ${all.length}…`);
        const response = await fetch(photo.url);
        if (!response.ok) throw new Error(`Не удалось прочитать ${photo.filename}. Архив не создан.`);
        const filename = photo.filename.replace(/[\\/]/g, "-");
        files[`uploads/${photo.mediaId}-${filename}`] = new Uint8Array(await response.arrayBuffer());
      }
      files["manifest.json"] = strToU8(JSON.stringify({ version: 1, photos: all }, null, 2));
      files["README.txt"] = strToU8("Копия фотографий из медиатеки НОФХ. Для полного переноса сайта сохраните также базу PostgreSQL: связи с новостями хранятся в ней.\n");
      const zip = zipSync(files, { level: 0 });
      const url = URL.createObjectURL(new Blob([new Uint8Array(zip)], { type: "application/zip" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `nofh-uploads-${new Date().toISOString().slice(0, 10)}.zip`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
      setNotice(`Архив готов: ${all.length} фото. Сохраните файл на компьютер.`);
    } catch (err) {
      setNotice("");
      setError(err instanceof Error ? err.message : "Не удалось подготовить архив.");
    } finally { setExporting(false); }
  }

  const photos = [...uploads, ...BUNDLED_PHOTOS].filter(photo =>
    (filter === "all" || photo.storage === filter) &&
    `${photo.title} ${photo.filename}`.toLocaleLowerCase("ru").includes(search.toLocaleLowerCase("ru"))
  );

  return (
    <section aria-label="Медиатека фотографий">
      {!onSelect ? (
        <div className="mb-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <UploadPhoto multiple onUploaded={photo => {
            setUploads(current => [photo, ...current.filter(item => item.id !== photo.id)]);
            setTotal(current => current + 1);
            setFilter("database");
          }} />
          <div className="border-l border-line pl-6 text-[13px] leading-relaxed text-muted">
            <p className="font-semibold text-ink-900">Ваши файлы, ваше хранилище</p>
            <p className="mt-2">Исходные фото включены в проект. Новые загрузки хранятся в вашей PostgreSQL-базе и доступны с вашего домена. Старый сайт для этого не нужен.</p>
            <div className="mt-5 flex flex-wrap gap-4">
              <a href="/photos/nofh-originals.zip" download className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-900 underline underline-offset-4 hover:text-accent">
                24 оригинала · ZIP
              </a>
              <button type="button" disabled={exporting || !total} onClick={() => void exportUploads()} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-900 underline underline-offset-4 hover:text-accent disabled:opacity-40">
                {exporting ? "Готовим архив…" : "Архив моих загрузок"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex flex-wrap gap-5">
          {([
            ["all", `Все · ${BUNDLED_PHOTOS.length + total}`],
            ["database", `Мои загрузки · ${total}`],
            ["project", `В проекте · ${BUNDLED_PHOTOS.length}`],
          ] as const).map(([value, label]) => (
            <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`text-[12px] font-semibold transition-colors ${filter === value ? "text-accent" : "text-muted hover:text-ink-900"}`}>
              {label}
            </button>
          ))}
        </div>
        <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Найти фотографию…" aria-label="Поиск по названию фотографии" className="min-w-0 border border-line bg-paper px-3 py-2 text-[13px] outline-none focus:border-ink-900" />
      </div>

      {error ? <p role="alert" className="my-5 border-l-2 border-accent pl-4 text-[13px] text-accent">{error}</p> : null}
      {notice ? <p role="status" className="my-4 break-all text-[12px] text-muted">{notice}</p> : null}
      {loading ? <p role="status" className="mt-5 text-[13px] text-muted">Загружаем медиатеку…</p> : null}

      <div className={`mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2 ${onSelect ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
        {photos.map(photo => (
          <article key={photo.id} className="min-w-0">
            {onSelect ? (
              <button type="button" onClick={() => onSelect(photo)} className={`relative block aspect-[4/3] w-full overflow-hidden bg-paper-3 outline-offset-4 ${photo.url === selectedUrl ? "outline-2 outline-accent" : "hover:outline-1 hover:outline-ink-900"}`} aria-label={`Выбрать: ${photo.title}`}>
                <Photo src={photo.url} alt={photo.title} fill sizes="(max-width: 640px) 100vw, 300px" />
              </button>
            ) : (
              <a href={photo.url} target="_blank" rel="noreferrer" className="relative block aspect-[4/3] overflow-hidden bg-paper-3" aria-label={`Открыть: ${photo.title}`}>
                <Photo src={photo.url} alt={photo.title} fill sizes="(max-width: 640px) 100vw, 300px" />
              </a>
            )}
            <p className="mt-3 truncate text-[13px] font-medium text-ink-900" title={photo.title}>{photo.title}</p>
            <p className="mt-1 text-[11px] text-muted-2">{photo.storage === "project" ? "Файл проекта" : "PostgreSQL"} · {photoSize(photo.bytes)}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-[11px] font-semibold text-ink-700">
              {onSelect ? (
                <button type="button" onClick={() => onSelect(photo)} className="hover:text-accent">Использовать</button>
              ) : (
                <button type="button" onClick={() => void copyUrl(photo.url)} className="hover:text-accent">Копировать путь</button>
              )}
              <a href={photoDownloadUrl(photo)} download={photo.filename} className="hover:text-accent">Скачать</a>
            </div>
          </article>
        ))}
      </div>
      {!photos.length && !loading ? <p className="py-10 text-[14px] text-muted">Фотографии не найдены. Загрузите файл или измените поиск.</p> : null}
      {cursor !== null && filter !== "project" ? (
        <button type="button" disabled={loading} onClick={() => void loadMore()} className="mt-8 border border-line-strong px-5 py-3 text-[12px] text-ink-900 hover:border-ink-900 disabled:opacity-50">Загрузить ещё фотографии</button>
      ) : null}
    </section>
  );
}
