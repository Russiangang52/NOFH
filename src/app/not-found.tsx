import Link from "next/link";
import { Btn, Logo } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center border-b border-line">
      <div className="container-x py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="tnum font-display text-[6rem] font-semibold leading-none text-ink-900 sm:text-[8rem]">
              404
            </p>
            <h1 className="rule-accent mt-8 text-[1.8rem] font-bold text-ink-900">
              Страница не найдена
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              Материал мог быть перемещён в архив или ссылка устарела.
              Воспользуйтесь разделами сайта или вернитесь на главную страницу.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Btn href="/">На главную</Btn>
              <Btn href="/novosti" variant="outline">
                Новости
              </Btn>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <Logo className="h-16 w-16 text-line-strong" />
            <ul className="mt-8 w-full max-w-xs">
              {[
                ["Расписание матчей", "/raspisanie"],
                ["Соревнования", "/sorevnovaniya"],
                ["Документы", "/federaciya/dokumenty"],
                ["Контакты", "/federaciya/kontakty"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center justify-between border-b border-line py-3.5 text-[14px] text-ink-700 transition-colors hover:text-accent"
                  >
                    {label}
                    <span>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
