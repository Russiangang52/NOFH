"use client";

import { useEffect, useId, useRef, useState } from "react";
import Photo from "@/components/Photo";
import UploadPhoto from "@/components/admin/UploadPhoto";
import MediaLibrary from "@/components/admin/MediaLibrary";
import { isOwnedPhotoPath, type LibraryPhoto } from "@/lib/photos";

export default function PhotoPicker({ value, onChange, onBusyChange }: {
  value: string;
  onChange: (url: string) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const modal = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (open && !modal.current?.open) modal.current?.showModal();
    else if (!open && modal.current?.open) modal.current.close();
  }, [open]);

  const select = (photo: LibraryPhoto) => { onChange(photo.url); setOpen(false); };

  return (
    <div className="border border-line p-6">
      <p className="eyebrow text-muted-2">Фотография публикации</p>
      <input type="hidden" name="image" value={value} />
      {value && isOwnedPhotoPath(value) ? (
        <div className="mt-5">
          <div className="relative aspect-[4/3] overflow-hidden bg-paper-3">
            <Photo src={value} alt="Обложка публикации" fill sizes="360px" />
          </div>
          <p className="mt-2 break-all text-[11px] text-muted-2">{value}</p>
          <button type="button" disabled={busy} onClick={() => onChange("")} className="mt-2 text-[11px] text-muted hover:text-accent disabled:opacity-50">Убрать обложку</button>
        </div>
      ) : <p className="mt-4 text-[12px] leading-relaxed text-muted">Выберите готовую фотографию или загрузите свою. Внешние ссылки не используются.</p>}
      <div className="mt-5">
        <UploadPhoto onUploaded={select} onBusyChange={loading => { setBusy(loading); onBusyChange(loading); }} />
      </div>
      <button type="button" disabled={busy} onClick={() => setOpen(true)} className="mt-4 w-full border border-line-strong bg-paper px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-900 hover:border-ink-900 disabled:opacity-50">
        Выбрать из медиатеки
      </button>
      <p className="mt-4 text-[11px] leading-relaxed text-muted-2">Фото сохраняется сразу. После выбора нажмите «Сохранить изменения», чтобы обновить публикацию.</p>

      <dialog ref={modal} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }} aria-labelledby={titleId} className="fixed inset-0 m-auto max-h-[88dvh] w-[min(1100px,calc(100vw-2rem))] overflow-y-auto border border-line bg-paper p-0 text-ink-900 shadow-xl backdrop:bg-ink-900/60">
        <div className="p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-5">
            <h2 id={titleId} className="text-[1.5rem] font-semibold">Выбрать фотографию</h2>
            <button type="button" onClick={() => setOpen(false)} className="border border-line-strong px-4 py-2 text-[12px] hover:border-ink-900">Закрыть</button>
          </div>
          {open ? <MediaLibrary onSelect={select} selectedUrl={value} /> : null}
        </div>
      </dialog>
    </div>
  );
}
