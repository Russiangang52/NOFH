"use client";

import { useMemo, useState } from "react";
import type { StandingRow } from "@/db/schema";

// Колонки, которые показываются только на планшете и больше
const COLS_DESKTOP = [
  ["winsOt", "ВО"],
  ["winsSo", "ВБ"],
  ["lossesSo", "ПБ"],
  ["lossesOt", "ПО"],
] as const;

// Колонки, которые показываются всегда (основные)
const COLS_BASE = [
  ["games", "И"],
  ["wins", "В"],
  ["losses", "П"],
] as const;

export default function StandingsBoard({
  rows,
  playoffCut = 4,
}: {
  rows: StandingRow[];
  playoffCut?: number;
}) {
  const divisions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.division))),
    [rows],
  );
  const [active, setActive] = useState(divisions[0] ?? "");

  const visible = rows
    .filter((r) => r.division === active)
    .sort((a, b) => a.position - b.position);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 overflow-x-auto scrollbar-hide border-b border-line pb-2">
        {divisions.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActive(d)}
            className={`nav-link -mb-px py-4 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors ${
              active === d ? "text-ink-900" : "text-muted hover:text-ink-900"
            }`}
            data-active={active === d}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full border-collapse text-[13px] sm:text-[13.5px]">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-[0.08em] text-muted-2 sm:text-[10.5px] sm:tracking-[0.1em]">
              <th className="w-8 py-3 pl-1 text-left font-semibold sm:w-12">№</th>
              <th className="py-3 pr-2 text-left font-semibold">Команда</th>
              {COLS_BASE.map(([, label]) => (
                <th key={label} className="w-8 py-3 text-center font-semibold sm:w-12">
                  {label}
                </th>
              ))}
              {COLS_DESKTOP.map(([, label]) => (
                <th
                  key={label}
                  className="hidden w-12 py-3 text-center font-semibold md:table-cell"
                >
                  {label}
                </th>
              ))}
              <th className="hidden w-20 py-3 text-center font-semibold sm:table-cell">
                Шайбы
              </th>
              <th className="w-10 py-3 pr-1 text-right font-semibold sm:w-16">О</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={row.id}
                className={`row-hover border-b border-line last:border-b-0 ${
                  row.position <= playoffCut ? "bg-paper/0" : ""
                }`}
              >
                <td className="py-3 pl-1">
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <span
                      className={`h-5 w-[2px] ${
                        row.position <= playoffCut ? "bg-accent" : "bg-transparent"
                      }`}
                    />
                    <span className="tnum text-[12px] font-semibold text-muted sm:text-[12.5px]">
                      {row.position}
                    </span>
                  </span>
                </td>
                <td className="py-3 pr-2">
                  <span className="block font-semibold leading-tight text-ink-900">
                    {row.team}
                  </span>
                  <span className="block text-[10.5px] text-muted-2 sm:ml-2 sm:inline sm:text-[12px]">
                    {row.city}
                  </span>
                </td>
                {COLS_BASE.map(([key]) => (
                  <td
                    key={key}
                    className="tnum py-3 text-center text-ink-700"
                  >
                    {row[key]}
                  </td>
                ))}
                {COLS_DESKTOP.map(([key]) => (
                  <td
                    key={key}
                    className="tnum hidden py-3 text-center text-ink-700 md:table-cell"
                  >
                    {row[key]}
                  </td>
                ))}
                <td className="tnum hidden py-3 text-center text-ink-700 sm:table-cell">
                  {row.goalsFor}&#8202;:&#8202;{row.goalsAgainst}
                </td>
                <td className="tnum py-3 pr-1 text-right text-[14px] font-bold text-ink-900 sm:text-[15px]">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Легенда — адаптивная */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-3 text-[10.5px] text-muted-2 sm:gap-x-6 sm:text-[11.5px] sm:pt-4">
        <span className="flex items-center gap-2">
          <span className="h-3 w-[2px] bg-accent" />
          зона плей-офф
        </span>
        <span>И — игры</span>
        <span>В — победы</span>
        <span>П — поражения</span>
        <span>О — очки</span>
        <span className="hidden md:inline">ВО / ВБ — победы в овертайме / по буллитам</span>
        <span className="hidden md:inline">ПБ / ПО — поражения по буллитам / в овертайме</span>
        <span className="hidden sm:inline">Шайбы — забито:пропущено</span>
      </div>
    </div>
  );
}
