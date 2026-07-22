"use client";

import { useMemo, useState } from "react";
import {
  bandLabel,
  buildTheoreticalOutcome,
  type TheoreticalOutcome,
} from "@/lib/genesis/theoretical-outcome";
import type { Organism } from "@/lib/genesis/simulate";
import type { WorldEnv } from "@/lib/genesis/world";

type Props = {
  organism: Organism | undefined;
  env: WorldEnv;
  simTick: number;
  maxGeneration: number;
};

export function TheoreticalOutcomePanel({
  organism,
  env,
  simTick,
  maxGeneration,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(true);

  const outcome: TheoreticalOutcome | null = useMemo(() => {
    if (!organism) return null;
    return buildTheoreticalOutcome(organism, env, {
      simTick,
      maxGeneration,
    });
  }, [organism, env, simTick, maxGeneration]);

  if (!organism || !outcome) {
    return (
      <section className="glass-strong rounded-[var(--radius-xl)] p-5">
        <h2 className="heading-section text-lg">Theoretical outcome</h2>
        <p className="mt-2 text-sm text-muted">
          Run the simulation and select a creature to generate its theoretical
          end-state report (phenotype, niche, multi-world fitness, population
          forecast).
        </p>
      </section>
    );
  }

  async function copyReport() {
    if (!outcome) return;
    try {
      await navigator.clipboard.writeText(outcome.fullReportMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function downloadReport() {
    if (!outcome) return;
    const blob = new Blob([outcome.fullReportMarkdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `genesis-outcome-gen${outcome.generation}-${outcome.lineage}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const bandColor: Record<string, string> = {
    "extinct-likely": "badge-warn",
    struggling: "badge-warn",
    stable: "badge-sky",
    thriving: "badge-ok",
    dominant: "badge-ok",
  };

  return (
    <section className="glass-strong space-y-5 rounded-[var(--radius-xl)] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            End of lab · assessable outcome
          </p>
          <h2 className="heading-section mt-1 text-xl sm:text-2xl">
            Theoretical outcome of your creature
          </h2>
          <p className="mt-1 text-sm text-muted">
            Predicted phenotype, niche, energy, reproduction, multi-world
            survival, and long-term population theory from this genome +
            environment.
          </p>
        </div>
        <span className={`badge ${bandColor[outcome.survivalBand] ?? ""}`}>
          {bandLabel(outcome.survivalBand)}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Mini label="Fitness now" value={outcome.currentFitness.toFixed(2)} />
        <Mini label="Generation" value={String(outcome.generation)} />
        <Mini label="Best world" value={outcome.bestWorld} />
        <Mini label="Worst world" value={outcome.worstWorld} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Block title="1. Theoretical phenotype" body={outcome.phenotype} />
        <Block title="2. Ecological niche" body={outcome.ecologicalNiche} />
        <Block title="3. Energy budget" body={outcome.energyBudget} />
        <Block
          title="4. Reproductive strategy"
          body={outcome.reproductiveStrategy}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-soft rounded-[var(--radius-md)] p-4">
          <h3 className="text-sm font-semibold text-ink">Strengths</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
            {outcome.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="glass-soft rounded-[var(--radius-md)] p-4">
          <h3 className="text-sm font-semibold text-ink">Vulnerabilities</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
            {outcome.vulnerabilities.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink">
          5. Multi-world theoretical fitness
        </h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-soft">
                <th className="py-2 pr-3">Scenario</th>
                <th className="py-2 pr-3">Fitness</th>
                <th className="py-2 pr-3">Band</th>
                <th className="py-2">Theory note</th>
              </tr>
            </thead>
            <tbody>
              {outcome.scenarioScores.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-[var(--glass-border-dim)]"
                >
                  <td className="py-2 pr-3 font-medium text-ink">{s.name}</td>
                  <td className="py-2 pr-3 tabular-nums">{s.fitness}</td>
                  <td className="py-2 pr-3 text-muted">
                    {bandLabel(s.band)}
                  </td>
                  <td className="py-2 text-xs text-soft">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Block
          title="Short-term population"
          body={outcome.theoreticalPopulation.shortTerm}
        />
        <Block
          title="Medium-term population"
          body={outcome.theoreticalPopulation.mediumTerm}
        />
        <Block
          title="Long-term population"
          body={outcome.theoreticalPopulation.longTerm}
        />
      </div>

      <Block title="Evolution forecast" body={outcome.evolutionForecast} />

      <div className="callout callout-tip">
        <div className="text-xs font-bold uppercase tracking-wide opacity-75">
          Student conclusion (use in your write-up)
        </div>
        <p className="mt-1 text-sm leading-relaxed">{outcome.studentConclusion}</p>
      </div>

      <div className="glass-soft rounded-[var(--radius-md)] p-4">
        <h3 className="text-sm font-semibold text-ink">
          What you should be able to explain
        </h3>
        <ul className="mt-2 space-y-2 text-sm text-muted">
          {outcome.assessmentRubric.map((r) => (
            <li key={r.criterion}>
              <strong className="text-ink">{r.criterion}:</strong> {r.target}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={copyReport}>
          {copied ? "Copied ✓" : "Copy full theoretical report"}
        </button>
        <button type="button" className="btn btn-sky" onClick={downloadReport}>
          Download .md report
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setShowFull((v) => !v)}
        >
          {showFull ? "Hide" : "Show"} molecular build detail
        </button>
      </div>

      {showFull && (
        <div className="glass-soft rounded-[var(--radius-md)] p-4 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              Central dogma + known structures
            </h3>
            <p className="mt-1 break-all font-mono text-[10px] text-soft">
              DNA: {organism.expression.dna}
            </p>
            <p className="break-all font-mono text-[10px] text-soft">
              AA: {organism.expression.aminoAcidSequence || "—"}
            </p>
            <p className="mt-1 text-xs text-muted">
              Secondary: {organism.expression.secondarySummary}
            </p>
            {organism.expression.motifs.length > 0 && (
              <p className="mt-1 text-xs text-muted">
                Motifs: {organism.expression.motifs.join(" · ")}
              </p>
            )}
            {organism.expression.complexes.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-accent">
                  Systems (complexity 5)
                </p>
                <ul className="mt-1 space-y-1 text-sm text-muted">
                  {organism.expression.complexes.map((c) => (
                    <li key={c.id}>
                      <strong className="text-ink">{c.name}</strong> (
                      {Math.round(c.score * 100)}%) — {c.realWorld}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {organism.expression.structures.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                {organism.expression.structures.map((s) => (
                  <li key={s.id}>
                    <strong className="text-ink">{s.name}</strong>{" "}
                    <span className="text-soft">
                      C{s.complexity} · {Math.round(s.score * 100)}% · {s.level}
                    </span>{" "}
                    — {s.realWorld}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-muted">
                No strong known structures assigned for this sequence.
              </p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Function tags</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {outcome.proteinProfile.map((p) => (
                <li key={p.klass}>
                  <strong className="text-ink">{p.klass}</strong> ×{p.strength} —{" "}
                  {p.role}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-soft rounded-[var(--radius-md)] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-soft">{label}</div>
      <div className="text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-soft rounded-[var(--radius-md)] p-4">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
