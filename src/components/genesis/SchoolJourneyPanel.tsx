"use client";

import { useMemo, useState } from "react";
import type { YearLevel } from "@/lib/types";
import type { SimState } from "@/lib/genesis/simulate";
import {
  buildHumanityOutcome,
  canEnterHumanity,
  canWriteFinalEssay,
  completeStage,
  currentStage,
  HUMANITY_ENTRIES,
  HUMANITY_INTENTIONS,
  JOURNEY_STAGES,
  stagesForYear,
  type HumanityEntry,
  type HumanityIntention,
  type JourneyStageId,
  type SchoolJourneyState,
} from "@/lib/genesis/school-journey";

type Props = {
  journey: SchoolJourneyState;
  sim: SimState;
  onChange: (j: SchoolJourneyState) => void;
  onIntroduceHumanity: (entry: Exclude<HumanityEntry, "none">) => void;
  onReseedEden: (year: YearLevel) => void;
};

const YEARS: YearLevel[] = [7, 8, 9, 10, 11, 12];

export function SchoolJourneyPanel({
  journey,
  sim,
  onChange,
  onIntroduceHumanity,
  onReseedEden,
}: Props) {
  const stage = currentStage(journey);
  const available = stagesForYear(journey.schoolYear);
  const [showReport, setShowReport] = useState(false);
  const [copied, setCopied] = useState(false);

  const outcome = useMemo(
    () => buildHumanityOutcome(journey, sim),
    [journey, sim],
  );

  const progressPct = Math.round(
    (journey.stagesCompleted.filter((id) =>
      available.some((s) => s.id === id),
    ).length /
      Math.max(1, available.length)) *
      100,
  );

  function setYear(y: YearLevel) {
    onChange({ ...journey, schoolYear: y });
    onReseedEden(y);
  }

  function markStageDone() {
    onChange(completeStage(journey, stage.id));
  }

  function setStageNote(id: JourneyStageId, text: string) {
    onChange({
      ...journey,
      stageNotes: { ...journey.stageNotes, [id]: text },
    });
  }

  function setEntry(entry: HumanityEntry) {
    if (entry === "none") {
      onChange({
        ...journey,
        humanityEntry: "none",
        humanityEntered: false,
      });
      return;
    }
    if (!canEnterHumanity(journey.schoolYear)) return;
    onChange({
      ...journey,
      humanityEntry: entry,
      humanityEntered: true,
      stagesCompleted: journey.stagesCompleted.includes("human-arrival")
        ? journey.stagesCompleted
        : [...journey.stagesCompleted, "human-arrival"],
    });
    onIntroduceHumanity(entry);
  }

  function toggleIntention(id: HumanityIntention) {
    const has = journey.intentions.includes(id);
    const intentions = has
      ? journey.intentions.filter((x) => x !== id)
      : [...journey.intentions, id].slice(0, 4);
    onChange({
      ...journey,
      intentions,
      stagesCompleted: journey.stagesCompleted.includes("settlement-intent")
        ? journey.stagesCompleted
        : journey.schoolYear >= 11
          ? [...journey.stagesCompleted, "settlement-intent"]
          : journey.stagesCompleted,
    });
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(outcome.markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function downloadReport() {
    const blob = new Blob([outcome.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habitation-essay-y${journey.schoolYear}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function fillScaffold() {
    onChange({
      ...journey,
      essayDraft: journey.essayDraft.trim()
        ? journey.essayDraft
        : outcome.essayScaffold,
      stagesCompleted: journey.stagesCompleted.includes("final-essay")
        ? journey.stagesCompleted
        : canWriteFinalEssay(journey.schoolYear)
          ? [...journey.stagesCompleted, "final-essay"]
          : journey.stagesCompleted,
    });
    setShowReport(true);
  }

  return (
    <div className="glass-strong rounded-[var(--radius-xl)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            World habitation science · Years 7–12
          </p>
          <h2 className="heading-section mt-1 text-lg sm:text-xl">
            Earth-like world · step-by-step biology
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-muted">
            Imagine you are preparing to understand — and maybe inhabit — an
            Earth-like planet with its own diverse plants and animals. Work
            through science steps.{" "}
            <strong className="text-ink">There is no wrong path</strong>, only
            better evidence. At the end you submit a{" "}
            <strong className="text-ink">final essay</strong> using what you
            measured.
          </p>
        </div>
        <label className="text-xs text-soft">
          School year
          <select
            className="mt-1 block rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-sm font-semibold text-ink"
            value={journey.schoolYear}
            onChange={(e) => setYear(Number(e.target.value) as YearLevel)}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                Year {y}
                {y <= 8
                  ? " · survey"
                  : y <= 10
                    ? " · biosphere"
                    : " · habitation + essay"}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Progress */}
      <div>
        <div className="mb-1 flex justify-between text-[11px] text-muted">
          <span>Science steps completed</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--glass-soft)]">
          <div
            className="h-full rounded-full bg-sky-500/80 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {available.map((s) => {
            const done = journey.stagesCompleted.includes(s.id);
            const active = s.id === stage.id;
            return (
              <span
                key={s.id}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  done
                    ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-200"
                    : active
                      ? "bg-[var(--sky-soft)] text-ink ring-1 ring-sky-400/50"
                      : "bg-[var(--glass-soft)] text-muted"
                }`}
                title={s.scienceFocus}
              >
                {done ? "✓ " : `${s.order}. `}
                {s.kidTitle.replace(/^Step \d+ · /, "")}
              </span>
            );
          })}
        </div>
      </div>

      <div className="callout callout-tip text-sm">
        <strong>No wrong answers.</strong> Try any climate, any flora/fauna,
        any arrival story. Your teacher looks for clear science, use of sim
        evidence, and honest trade-offs in the final essay.
      </div>

      {/* Current step */}
      <div className="rounded-xl bg-[var(--glass-soft)] p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-soft">
          {stage.scienceFocus} · unlocks at Y{stage.minYear}+
        </p>
        <h3 className="mt-1 text-base font-bold text-ink">{stage.kidTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{stage.story}</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-ink">Learn</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
              {stage.learning.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink">Try in the lab</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
              {stage.tryThis.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink">Essay seeds</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
              {stage.essayPrompts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>

        <label className="mt-3 block text-xs text-soft">
          My field notes for this step
          <textarea
            className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-sm text-ink"
            rows={2}
            placeholder="What did you observe? Any surprise? (feeds your essay)"
            value={journey.stageNotes[stage.id] ?? ""}
            onChange={(e) => setStageNote(stage.id, e.target.value)}
          />
        </label>

        <button type="button" className="btn btn-sky mt-3" onClick={markStageDone}>
          Mark step explored ✓
        </button>
      </div>

      {/* Live evidence */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Mini label="Plants" value={String(sim.stats.floraCount)} />
        <Mini label="Animals" value={String(sim.stats.population)} />
        <Mini label="Humans" value={String(sim.stats.humanCount)} />
        <Mini
          label="Water"
          value={`${(sim.stats.waterCoverage * 100).toFixed(0)}%`}
        />
        <Mini
          label="Season"
          value={String(sim.stats.season)}
        />
      </div>

      {/* Arrival */}
      {canEnterHumanity(journey.schoolYear) ? (
        <div className="rounded-xl border border-[var(--glass-border)] p-4">
          <h3 className="text-sm font-bold text-ink">
            Habitation step · how do people enter?
          </h3>
          <p className="mt-1 text-xs text-muted">
            Any route is valid. Defend it with climate, water and biosphere
            evidence in your essay.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {HUMANITY_ENTRIES.map((e) => {
              const selected = journey.humanityEntry === e.id;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEntry(e.id)}
                  className={`rounded-lg px-3 py-2.5 text-left text-xs transition ${
                    selected
                      ? "bg-[var(--sky-soft)] ring-2 ring-sky-400/60"
                      : "bg-[var(--glass-soft)] hover:bg-[var(--sky-soft)]/50"
                  }`}
                >
                  <span className="font-semibold text-ink">{e.kidLabel}</span>
                  <span className="mt-0.5 block text-muted">{e.blurb}</span>
                  <span className="mt-1 block text-[10px] text-soft">
                    Science: {e.scienceAngle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="callout callout-info text-sm">
          <strong>Years 7–10:</strong> survey-only mission. Map climate, plants
          and animals. Human arrival unlocks in{" "}
          <strong>Year 11</strong> — you are still doing real science.
        </div>
      )}

      {/* Intentions */}
      {journey.schoolYear >= 11 && journey.humanityEntered && (
        <div className="rounded-xl border border-[var(--glass-border)] p-4">
          <h3 className="text-sm font-bold text-ink">
            Life intentions (pick up to 4)
          </h3>
          <p className="mt-1 text-xs text-muted">
            What should people try to do here? Mix freely — realism is
            multi-goal. Explain trade-offs in the essay.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {HUMANITY_INTENTIONS.map((i) => {
              const on = journey.intentions.includes(i.id);
              return (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => toggleIntention(i.id)}
                  className={`rounded-lg px-2.5 py-2 text-left text-xs ${
                    on
                      ? "bg-emerald-500/20 ring-2 ring-emerald-400/50"
                      : "bg-[var(--glass-soft)] hover:bg-emerald-500/10"
                  }`}
                >
                  <span className="text-base">{i.emoji}</span>{" "}
                  <span className="font-semibold text-ink">{i.kidLabel}</span>
                  <span className="mt-0.5 block text-[10px] text-muted">
                    {i.scienceAngle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Final essay */}
      {canWriteFinalEssay(journey.schoolYear) && (
        <div className="rounded-xl border border-sky-400/30 bg-sky-500/5 p-4">
          <h3 className="text-sm font-bold text-ink">
            Final essay {journey.schoolYear >= 12 ? "(required)" : "(draft OK)"}
          </h3>
          <p className="mt-1 text-xs text-muted">
            Write as a briefing to a mission council. Use sim evidence. Any
            evidence-based recommendation is acceptable.
          </p>
          <label className="mt-2 block text-xs text-soft">
            Essay title
            <input
              className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-sm text-ink"
              value={journey.essayTitle}
              onChange={(e) =>
                onChange({ ...journey, essayTitle: e.target.value })
              }
            />
          </label>
          <label className="mt-2 block text-xs text-soft">
            Essay body
            <textarea
              className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 font-sans text-sm leading-relaxed text-ink"
              rows={10}
              placeholder="Start writing, or click “Insert scaffold” for section headings…"
              value={journey.essayDraft}
              onChange={(e) =>
                onChange({ ...journey, essayDraft: e.target.value })
              }
            />
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className="btn btn-sky" onClick={fillScaffold}>
              Insert scaffold
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowReport((v) => !v)}
            >
              {showReport ? "Hide" : "Show"} full evidence report
            </button>
            <button type="button" className="btn btn-ghost" onClick={copyReport}>
              {copied ? "Copied ✓" : "Copy essay pack"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={downloadReport}>
              Download .md
            </button>
          </div>
        </div>
      )}

      {showReport && (
        <div className="space-y-3 rounded-xl bg-[var(--glass-soft)] p-4">
          <h3 className="font-bold text-ink">{outcome.title}</h3>
          <p className="text-sm text-muted">{outcome.kidSummary}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Evidence strengths
              </p>
              <ul className="mt-1 list-disc pl-4 text-xs text-muted">
                {outcome.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                Risks / discuss
              </p>
              <ul className="mt-1 list-disc pl-4 text-xs text-muted">
                {outcome.risks.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm text-ink">
            <strong>Long-term theory:</strong> {outcome.longTerm}
          </p>
          <p className="text-xs text-muted">{outcome.scientificSummary}</p>
          <details className="text-xs text-muted">
            <summary className="cursor-pointer font-semibold text-ink">
              All science steps (Y7–12)
            </summary>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              {JOURNEY_STAGES.map((s) => (
                <li key={s.id}>
                  <strong>{s.kidTitle}</strong> — {s.scienceFocus}
                </li>
              ))}
            </ol>
          </details>
        </div>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--glass-soft)] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-soft">{label}</div>
      <div className="truncate text-lg font-bold text-ink">{value}</div>
    </div>
  );
}
