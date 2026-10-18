"use client";

import { useMemo, useState } from "react";
import type { StandingRow } from "@/db/schema";

const COLS = [
  ["games", "И"],
  ["wins", "В"],
  ["winsOt", "ВО"],
  ["winsSo", "ВБ"],
  ["lossesSo", "ПБ"],
  ["lossesOt", "ПО"],
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
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-line">
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-line text-[10.5px] uppercase tracking-[0.1em] text-muted-2">
              <th className="w-12 py-3 pl-1 text-left font-semibold">№</th>
              <th className="py-3 text-left font-semibold">Команда</th>
              {COLS.map(([, label]) => (
                <th key={label} className="w-12 py-3 text-center font-semibold">
                  {label}
                </th>
              ))}
              <th className="w-24 py-3 text-center font-semibold">Шайбы</th>
              <th className="w-16 py-3 pr-1 text-right font-semibold">Очки</th>
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
                <td className="py-3.5 pl-1">
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-5 w-[2px] ${
                        row.position <= playoffCut
                          ? "bg-accent"
                          : "bg-transparent"
                      }`}
                    />
                    <span className="tnum text-[12.5px] font-semibold text-muted">
                      {row.position}
                    </span>
                  </span>
                </td>
                <td className="py-3.5">
                  <span className="font-semibold text-ink-900">{row.team}</span>
                  <span className="ml-2 text-[12px] text-muted-2">
                    {row.city}
                  </span>
                </td>
                {COLS.map(([key]) => (
                  <td
                    key={key}
                    className="tnum py-3.5 text-center text-ink-700"
                  >
                    {row[key]}
                  </td>
                ))}
                <td className="tnum py-3.5 text-center text-ink-700">
                  {row.goalsFor}&#8202;:&#8202;{row.goalsAgainst}
                </td>
                <td className="tnum py-3.5 pr-1 text-right text-[15px] font-bold text-ink-900">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 text-[11.5px] text-muted-2">
        <span className="flex items-center gap-2">
          <span className="h-3 w-[2px] bg-accent" />
          зона плей-офф
        </span>
        <span>И — игры</span>
        <span>В — победы</span>
        <span>ВО / ВБ — победы в овертайме / по буллитам</span>
        <span>ПБ / ПО — поражения по буллитам / в овертайме</span>
        <span>П — поражения</span>
      </div>
    </div>
  );
}
