"use client";

import { useRef, useState } from "react";
import { MAX_PHOTO_BYTES, PHOTO_MIME_TYPES, type LibraryPhoto } from "@/lib/photos";

export default function UploadPhoto({
  onUploaded,
  onBusyChange,
  multiple = false,
}: {
  onUploaded: (photo: LibraryPhoto) => void;
  onBusyChange?: (busy: boolean) => void;
  multiple?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function upload(files: FileList | File[] | null) {
    if (!files?.length || busy) return;
    const selected = Array.from(files).slice(0, multiple ? 20 : 1);
    setError("");
    setBusy(true);
    onBusyChange?.(true);
    let succeeded = 0;
    try {
      for (const [index, file] of selected.entries()) {
        if (!PHOTO_MIME_TYPES.includes(file.type)) throw new Error(`${file.name}: выберите JPEG, PNG или WebP.`);
        if (file.size > MAX_PHOTO_BYTES) throw new Error(`${file.name}: файл больше 4 МБ.`);
        setStatus(`Сохраняем ${index + 1} из ${selected.length}…`);
        const data = new FormData();
        data.set("file", file);
        const response = await fetch("/api/admin/media", { method: "POST", body: data, credentials: "same-origin" });
        if (response.status === 413) throw new Error("Слишком большой файл. Максимальный размер — 4 МБ.");
        const result = await response.json() as { photo?: LibraryPhoto; error?: string };
        if (!response.ok || !result.photo) throw new Error(result.error || "Файл не сохранён. Повторите попытку.");
        onUploaded(result.photo);
        succeeded += 1;
      }
      setStatus(selected.length > 1 ? `Сохранено фотографий: ${succeeded}.` : "Фотография сохранена в вашей базе.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить фото.");
      setStatus(succeeded ? `Сохранено фотографий: ${succeeded}.` : "");
    } finally {
      setBusy(false);
      onBusyChange?.(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <div
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); void upload(event.dataTransfer.files); }}
        className={`border border-dashed p-5 transition-colors ${dragging ? "border-accent bg-accent-soft" : "border-line-strong bg-paper-2"}`}
        aria-busy={busy}
      >
        <input
          ref={input}
          type="file"
          aria-label="Файл фотографии"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          disabled={busy}
          className="sr-only"
          onChange={(event) => void upload(event.target.files)}
        />
        <p className="text-[13px] leading-relaxed text-muted">
          {multiple ? "Перетащите фотографии сюда" : "Перетащите фотографию сюда"}
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => input.current?.click()}
          className="mt-3 border border-ink-900 bg-paper px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-white disabled:cursor-wait disabled:opacity-50"
        >
          {busy ? "Загрузка…" : multiple ? "Выбрать фотографии" : "Выбрать фотографию"}
        </button>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-2">
          JPEG, PNG, WebP · до 4 МБ на файл. Сохраняются на вашем сайте, без внешних ссылок.
        </p>
      </div>
      <p role="status" className="mt-2 text-[12px] text-muted">{status}</p>
      {error ? <p role="alert" className="mt-2 border-l-2 border-accent pl-3 text-[13px] text-accent">{error}</p> : null}
    </div>
  );
}
