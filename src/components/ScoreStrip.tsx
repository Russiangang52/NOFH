import Link from "next/link";
import type { MatchRow } from "@/db/schema";
import { formatDateShort, formatTime } from "@/components/ui";

export default function ScoreStrip({
  results,
  upcoming,
}: {
  results: MatchRow[];
  upcoming: MatchRow[];
}) {
  const items = [
    ...results.slice(0, 4).map((m) => ({ match: m, played: true })),
    ...upcoming.slice(0, 4).map((m) => ({ match: m, played: false })),
  ];

  return (
    <section className="border-b border-line bg-paper-2">
      <div className="container-x flex items-stretch gap-0 overflow-x-auto">
        <div className="flex shrink-0 items-center pr-6">
          <span className="eyebrow text-muted-2">Матчи</span>
        </div>
        {items.map(({ match, played }) => (
          <Link
            key={match.id}
            href="/raspisanie"
            className="group flex min-w-[210px] shrink-0 flex-col justify-center border-l border-line px-5 py-4 transition-colors hover:bg-paper"
          >
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-muted-2">
              <span className="tnum">{formatDateShort(match.startsAt)}</span>
              <span className="truncate">{match.division}</span>
            </span>
            <span className="mt-2 flex items-center justify-between gap-3">
              <span className="truncate text-[13px] font-medium text-ink-800">
                {match.homeTeam}
              </span>
              <span
                className={`tnum shrink-0 text-[13px] font-bold ${
                  played ? "text-ink-900" : "text-accent"
                }`}
              >
                {played
                  ? `${match.homeScore}:${match.awayScore}`
                  : formatTime(match.startsAt)}
              </span>
            </span>
            <span className="mt-1 truncate text-[13px] font-medium text-ink-800">
              {match.awayTeam}
            </span>
          </Link>
        ))}
        <Link
          href="/raspisanie"
          className="flex shrink-0 items-center border-l border-line px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"
        >
          Все матчи
        </Link>
      </div>
    </section>
  );
}
