import { desc } from "drizzle-orm";
import { db } from "@/db";
import { questions } from "@/db/schema";
import {
  answerQuestionAction,
  deleteQuestionAction,
} from "@/app/admin/actions";
import { formatDate } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const rows = await db
    .select()
    .from(questions)
    .orderBy(desc(questions.createdAt))
    .limit(100);

  return (
    <>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-accent">Обратная связь</p>
        <h1 className="mt-3 text-[2rem] font-bold tracking-tight text-ink-900">
          Обращения с сайта
        </h1>
        <p className="mt-2 text-[14px] text-muted">
          Вопросы из формы «Задать вопрос». Всего: {rows.length}
        </p>
      </div>

      {saved ? (
        <p className="mt-6 border-l-2 border-ink-900 py-2 pl-4 text-[13.5px] text-ink-700">
          Ответ сохранён.
        </p>
      ) : null}
      {deleted ? (
        <p className="mt-6 border-l-2 border-accent py-2 pl-4 text-[13.5px] text-accent">
          Обращение удалено.
        </p>
      ) : null}

      <div className="mt-10 space-y-8">
        {rows.length === 0 ? (
          <p className="text-[14px] text-muted">Обращений пока нет.</p>
        ) : null}

        {rows.map((q) => (
          <article key={q.id} className="border border-line">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-paper-2 px-6 py-4">
              <div>
                <p className="text-[15px] font-semibold text-ink-900">
                  {q.name}
                  {q.contact ? (
                    <span className="ml-3 text-[12.5px] font-normal text-muted">
                      {q.contact}
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-[11.5px] uppercase tracking-[0.1em] text-muted-2">
                  {q.topic} · {formatDate(q.createdAt)}
                </p>
              </div>
              <span
                className={`border px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] ${
                  q.answer
                    ? "border-line text-muted"
                    : "border-accent/30 bg-accent-soft text-accent"
                }`}
              >
                {q.answer ? "есть ответ" : "без ответа"}
              </span>
            </div>

            <div className="px-6 py-5">
              <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-ink-700">
                {q.message}
              </p>

              <form action={answerQuestionAction} className="mt-6">
                <input type="hidden" name="id" value={q.id} />
                <label className="mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Ответ (для внутреннего учёта)
                </label>
                <textarea
                  name="answer"
                  rows={3}
                  defaultValue={q.answer ?? ""}
                  className="w-full resize-none border border-line bg-paper px-4 py-3 text-[14px] text-ink-900 outline-none focus:border-ink-900"
                  placeholder="Кто ответил, что сообщено заявителю…"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="bg-ink-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent"
                  >
                    Сохранить ответ
                  </button>
                </div>
              </form>
            </div>

            <form action={deleteQuestionAction} className="border-t border-line px-6 py-4">
              <input type="hidden" name="id" value={q.id} />
              <button
                type="submit"
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"
              >
                Удалить обращение
              </button>
            </form>
          </article>
        ))}
      </div>
    </>
  );
}
