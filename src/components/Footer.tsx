import Link from "next/link";
import { NAV, SITE } from "@/lib/content";
import { Logo } from "@/components/ui";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 bg-ink-900 text-white">
      <div className="container-x py-16">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.5fr_2fr]">
          <div>
            <div className="flex items-center gap-3 text-white">
              <Logo className="h-11 w-11" />
              <span className="leading-tight">
                <span className="block font-display text-[15px] font-bold">
                  Федерация хоккея
                </span>
                <span className="block text-[10.5px] uppercase tracking-[0.18em] text-white/50">
                  Нижегородская область
                </span>
              </span>
            </div>
            <p className="mt-6 max-w-sm text-[13.5px] leading-relaxed text-white/55">
              {SITE.fullName} — региональная общественная организация,
              аккредитованная Федерацией хоккея России. Организуем областные
              соревнования и развиваем хоккей в муниципалитетах региона.
            </p>
            <div className="mt-7 flex gap-3">
              {[
                ["ВК", SITE.vk],
                ["ТГ", SITE.vk],
                ["YT", SITE.vk],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-white/15 text-[11px] font-semibold tracking-wider text-white/70 transition-colors hover:border-white hover:bg-white hover:text-ink-900"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="eyebrow text-white/40">Разделы</p>
              <ul className="mt-5 space-y-2.5 text-[13.5px] text-white/70">
                {NAV.slice(1).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="u-link hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-white/40">Документы</p>
              <ul className="mt-5 space-y-2.5 text-[13.5px] text-white/70">
                {[
                  ["Регламент", "/federaciya/dokumenty/reglament"],
                  ["Календари", "/federaciya/dokumenty/kalendari"],
                  ["Судейство", "/federaciya/dokumenty/sudejstvo"],
                  ["Переходы", "/federaciya/dokumenty/perexody"],
                  ["Дисквалификации", "/federaciya/dokumenty/diskvalifikacii"],
                  ["Отчётность", "/otchyotnost"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="u-link hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-white/40">Контакты</p>
              <ul className="mt-5 space-y-3 text-[13.5px] leading-relaxed text-white/70">
                <li>{SITE.address}</li>
                <li>
                  <a href={`tel:${SITE.phone}`} className="u-link hover:text-white">
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="u-link hover:text-white"
                  >
                    {SITE.email}
                  </a>
                </li>
                <li className="text-white/45">{SITE.schedule}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-[12px] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.fullName}
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/otchyotnost" className="hover:text-white/80">
              Отчётность
            </Link>
            <Link href="/admin" className="hover:text-white/80">
              Панель управления
            </Link>
            <Link href="/federaciya/kontakty" className="hover:text-white/80">
              Контакты
            </Link>
            <span>Политика обработки персональных данных</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
