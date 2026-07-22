"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  allTimeBlocks,
  blockCompletedToday,
  getActiveBlock,
  getNextBlock,
  isInAnyWindow,
  minutesUntilNextWindow,
  STUDY_WINDOWS,
  type TimeBlock,
} from "@/lib/schedule";

export function SchedulePanel({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    const blocks = allTimeBlocks();
    setDoneIds(
      new Set(blocks.filter((b) => blockCompletedToday(b.id)).map((b) => b.id)),
    );
    return () => clearInterval(t);
  }, []);

  if (!now) {
    return (
      <div className="glass rounded-[var(--radius-lg)] p-4 text-sm text-muted">
        Loading schedule…
      </div>
    );
  }

  const active = getActiveBlock(now);
  const next = getNextBlock(now);
  const inWindow = isInAnyWindow(now);
  const blocks = allTimeBlocks();
  const until = minutesUntilNextWindow(now);

  return (
    <div className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Study windows · 30-min blocks
          </p>
          <h2 className="heading-section mt-1 text-lg sm:text-xl">
            Today&apos;s timetable
          </h2>
        </div>
        {!compact && (
          <Link href="/schedule" className="btn btn-chip btn-ghost">
            Full schedule
          </Link>
        )}
      </div>

      <p className="mt-2 text-sm text-muted">
        Windows: 10am–12pm · 2–3pm · 4–5pm · 7–8pm (device local time). Each
        block is 30 minutes.
      </p>

      {active ? (
        <div className="callout callout-tip mt-4">
          <strong>Live now:</strong> {active.label} — good time to complete one
          lesson block.
          <div className="mt-3">
            <Link href="/year/7/math" className="btn btn-ok btn-chip">
              Start a 30-min maths block
            </Link>
          </div>
        </div>
      ) : (
        <div className="callout callout-info mt-4">
          {inWindow
            ? "Between half-hours — stretch, then jump into the next slot."
            : `Outside study windows. Next window in about ${until ?? "?"} min.`}
          {next && (
            <p className="mt-1 text-sm">
              Next block: <strong>{next.label}</strong>
            </p>
          )}
        </div>
      )}

      <div className="mt-5 space-y-4">
        {STUDY_WINDOWS.map((w) => {
          const wBlocks = blocks.filter((b) => b.windowId === w.id);
          return (
            <div key={w.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-soft">
                {w.label} · {w.startHour > 12 ? w.startHour - 12 : w.startHour}
                {w.startHour >= 12 ? "pm" : "am"}–
                {w.endHour > 12 ? w.endHour - 12 : w.endHour}
                {w.endHour >= 12 ? "pm" : "am"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {wBlocks.map((b) => (
                  <BlockChip
                    key={b.id}
                    block={b}
                    active={active?.id === b.id}
                    done={doneIds.has(b.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlockChip({
  block,
  active,
  done,
}: {
  block: TimeBlock;
  active: boolean;
  done: boolean;
}) {
  return (
    <span
      className={`badge ${
        done ? "badge-ok" : active ? "badge-sky" : ""
      }`}
      title={block.label}
    >
      {done ? "✓ " : active ? "● " : ""}
      {block.shortLabel}
    </span>
  );
}
