"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";

const TOPICS = [
  "Общий вопрос",
  "Соревнования",
  "Судейство",
  "Переходы игроков",
  "Золотая шайба",
  "Сотрудничество",
];

const FIELD =
  "w-full border border-line bg-paper px-4 py-3 text-[14.5px] text-ink-900 outline-none transition-colors placeholder:text-muted-2 focus:border-ink-900";

const LABEL =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

export default function QuestionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("loading");
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Ошибка отправки");
      setStatus("ok");
      setMessage(
        "Обращение зарегистрировано. Ответ направим в течение трёх рабочих дней.",
      );
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Не удалось отправить вопрос",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="border border-line bg-paper p-7 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="q-name">
            Имя и фамилия *
          </label>
          <input
            id="q-name"
            name="name"
            required
            maxLength={120}
            className={FIELD}
            placeholder="Иван Иванов"
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="q-contact">
            E-mail или телефон
          </label>
          <input
            id="q-contact"
            name="contact"
            maxLength={160}
            className={FIELD}
            placeholder="mail@example.ru"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={LABEL} htmlFor="q-topic">
          Тема обращения
        </label>
        <select
          id="q-topic"
          name="topic"
          className={FIELD}
          defaultValue={TOPICS[0]}
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label className={LABEL} htmlFor="q-message">
          Текст обращения *
        </label>
        <textarea
          id="q-message"
          name="message"
          required
          minLength={10}
          rows={7}
          className={`${FIELD} resize-none`}
          placeholder="Опишите вопрос подробно — это ускорит подготовку ответа."
        />
      </div>

      <div className="mt-7 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[12px] leading-relaxed text-muted-2">
          Отправляя форму, вы соглашаетесь на обработку персональных данных.
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex items-center justify-center gap-2.5 bg-ink-900 px-8 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Отправка" : "Отправить"}
          <Icon name="arrow" className="arrow-slide h-4 w-4" strokeWidth={1.6} />
        </button>
      </div>

      {status === "ok" || status === "error" ? (
        <p
          className={`mt-6 border-l-2 py-2 pl-4 text-[13.5px] ${
            status === "ok"
              ? "border-ink-900 text-ink-700"
              : "border-accent text-accent"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
