"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { Logo } from "@/components/ui";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-2 px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 border-b border-line pb-6">
          <Logo className="h-10 w-10 text-ink-900" />
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-bold text-ink-900">
              Федерация хоккея
            </span>
            <span className="block text-[10.5px] uppercase tracking-[0.18em] text-muted">
              панель управления
            </span>
          </span>
        </div>

        <form action={formAction} className="mt-8">
          <label
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
            htmlFor="password"
          >
            Пароль доступа
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            className="w-full border border-line bg-paper px-4 py-3 text-[15px] text-ink-900 outline-none transition-colors focus:border-ink-900"
            placeholder="••••••••"
          />

          {state.error ? (
            <p className="mt-4 border-l-2 border-accent py-1 pl-4 text-[13px] text-accent">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-7 w-full bg-ink-900 px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent disabled:opacity-50"
          >
            {pending ? "Проверяем" : "Войти"}
          </button>
        </form>

        <p className="mt-8 border-t border-line pt-6 text-[12.5px] leading-relaxed text-muted-2">
          Доступ только для сотрудников федерации. Пароль задаётся переменной
          окружения <code className="text-muted">ADMIN_PASSWORD</code>.
        </p>
      </div>
    </main>
  );
}
