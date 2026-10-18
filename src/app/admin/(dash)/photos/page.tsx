import type { Metadata } from "next";
import MediaLibrary from "@/components/admin/MediaLibrary";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Медиатека — управление сайтом", robots: { index: false, follow: false } };

export default async function AdminPhotosPage() {
  await requireAdmin();
  return (
    <>
      <div className="mb-9 border-b border-line pb-6">
        <p className="eyebrow text-accent">Собственное хранилище</p>
        <h1 className="mt-3 text-[2rem] font-bold tracking-tight text-ink-900">Фотографии</h1>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted">
          Все фотографии сайта в одном месте. Загрузите новый файл, используйте его в новости или скачайте резервную копию.
        </p>
      </div>
      <MediaLibrary />
    </>
  );
}
